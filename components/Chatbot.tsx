import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// 🔥 নতুন: এখানে প্রপস ডিফাইন করা হয়েছে যাতে App.tsx থেকে কন্ট্রোল করা যায়
interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
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

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  // ❌ আগের isOpen স্টেট বাদ দেওয়া হয়েছে, এখন props থেকে আসবে
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

  // Initialize Gemini Chat Session (Logic Unchanged)
  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: "AIzaSyCFcqaHvTeuAJF-My1kJmMN1cLERFZUSpM" });
        const chat = ai.chats.create({
          model: 'gemini-1.5-flash', // মডেল নাম আপডেট করা হলো (স্ট্যান্ডার্ড)
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

  // যদি ওপেন না থাকে, তবে কিছুই রেন্ডার করবে না
  if (!isOpen) return null;

  return (
    // 🔥 পজিশন আপডেট: ডকের উপরে দেখানোর জন্য bottom-24 এবং left/right এডজাস্টমেন্ট
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 z-[100] w-[90%] md:w-[350px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans h-[500px]">
      
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-4 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold">Mishu's AI</h3>
            <span className="flex items-center gap-1 text-[10px] text-blue-100 opacity-90">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Gemini Powered
            </span>
          </div>
        </div>
        
        {/* Close Button calling props.onClose */}
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors focus:outline-none"
          aria-label="Close chat"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 scroll-smooth">
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
            <div className="flex items-center gap-1 px-4 py-3 bg-white border rounded-bl-none shadow-sm dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700">
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
        className="flex gap-2 p-3 bg-white border-t dark:bg-slate-900 border-slate-100 dark:border-slate-800"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2 text-sm transition-all rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-400 font-bengali"
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
  );
};

export default Chatbot;