import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const SYSTEM_INSTRUCTION = `You are the AI Assistant for Rahim Saroar Mishu's Portfolio.
Owner Details:
- Name: Rahim Saroar Mishu.
- Age: 19 (Born: Sep 3, 2007).
- Education: 11th Grade Science Student, Passed SSC in 2025 with GPA 5.
- Father: Abdul Alim, Mother: Arjuara Begum.
- Skills: Python (AI/Computer Vision), React, Tailwind, Arduino, IoT.
- Projects: Stealth GPS Tracker, AI Assistant (Jarvis), Rhythm of Peace (FB Page).
- Goal: To be a confident speaker and tech innovator.
- Tone: Friendly, concise, and helpful. Speak in both Bangla and English based on the user's language.`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "হ্যালো! মিশুর পোর্টফোলিওতে স্বাগতম। আমি আপনাকে কিভাবে সাহায্য করতে পারি? (Hello! I am Mishu's AI assistant. How can I help?)",
      sender: 'bot',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // Initialize Gemini Chat Session
  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: "AIzaSyAj5Kyyrgq-IUoAv7NeL0hdTHmbYBHyL0A" });
        const chat = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          }
        });
        setChatSession(chat);
      } catch (error) {
        console.error("Failed to initialize AI:", error);
      }
    };
    
    initChat();
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    // Add User Message
    const userMsg: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      let botResponseText = "Sorry, I am having trouble connecting to the brain right now.";
      
      if (chatSession) {
        const result = await chatSession.sendMessage({ message: userMsg.text });
        if (result.text) {
            botResponseText = result.text;
        }
      } else {
        // Fallback if API key is missing or init failed
        botResponseText = "AI System is initializing or unavailable. Please check the API configuration.";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botResponseText, sender: 'bot' },
      ]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "I encountered an error while processing your request.", sender: 'bot' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[60] w-[320px] md:w-[350px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
          
          {/* Header with Close Button */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Mishu's AI</h3>
                <span className="flex items-center gap-1 text-[10px] text-blue-100 opacity-90">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Gemini Powered
                </span>
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors focus:outline-none"
              aria-label="Close chat"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm font-bengali ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything / কিছু জিজ্ঞাসা করুন..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 font-bengali"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Trigger Button - 🔥 Updated ClassName & Position (Bottom 6) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          // এখানে ক্লাস নেম পরিবর্তন করা হয়েছে যাতে এটি সবার নিচে (bottom-6) এবং সঠিক সাইজে (w-14 h-14) থাকে
          className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-xl hover:shadow-blue-600/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="relative">
              <Bot size={28} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
          </div>
        </button>
      )}
    </>
  );
};

export default Chatbot;