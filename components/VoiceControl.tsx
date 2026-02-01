import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { triggerIsland } from './DynamicIsland';

interface VoiceControlProps {
  toggleTheme: () => void;
  toggleChat: () => void;
  toggleMusic: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ toggleTheme, toggleChat, toggleMusic }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // 🔥 1. কমান্ড লিস্ট (ম্যানুয়ালি এডিট করা যাবে)
  const COMMANDS = [
    {
      // 1. হোম পেজে যাওয়ার কমান্ড
      keywords: ['home', 'go to home', 'top', 'start', 'scroll up'], 
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      message: "Going Home 🏠"
    },
    {
      // 2. প্রজেক্ট সেকশন
      keywords: ['project', 'projects', 'my work', 'portfolio', 'show projects'],
      action: () => scrollToSection('projects'),
      message: "Opening Projects 📂"
    },
    {
      // 3. অ্যাবাউট সেকশন
      keywords: ['about', 'about me', 'who are you', 'bio', 'details'],
      action: () => scrollToSection('about'),
      message: "Showing About Section 👨‍💻"
    },
    {
      // 4. কন্টাক্ট সেকশন
      keywords: ['contact', 'email', 'message', 'call', 'touch'],
      action: () => scrollToSection('contact'),
      message: "Let's Connect! 📬"
    },
    {
      // 5. জার্নি বা এক্সপেরিয়েন্স
      keywords: ['journey', 'history', 'experience', 'timeline'],
      action: () => scrollToSection('journey'),
      message: "My Journey 🚀"
    },
    {
      // 6. স্কিলস বা রিসোর্স
      keywords: ['resource', 'resources', 'tools', 'skill', 'skills'],
      action: () => scrollToSection('resources'),
      message: "Checking Resources 🛠️"
    },
    {
      // 7. থিম চেঞ্জ (ডার্ক/লাইট)
      keywords: ['theme', 'dark mode', 'light mode', 'switch mode', 'change theme'],
      action: toggleTheme,
      message: "Theme Switched 🌗"
    },
    {
      // 8. মিউজিক প্লেয়ার
      keywords: ['music', 'play music', 'song', 'stop music', 'play song'],
      action: toggleMusic,
      message: "Music Player Toggled 🎵"
    },
    {
      // 9. চ্যাটবট
      keywords: ['chat', 'chatbot', 'ai', 'help', 'bot'],
      action: toggleChat,
      message: "AI Chat Toggled 🤖"
    },
    {
      // 10. ফেসবুক
      keywords: ['facebook', 'fb', 'social media'],
      action: () => window.open('https://facebook.com/rahimsaroar', '_blank'),
      message: "Opening Facebook... 🌐"
    },
    {
      // 🔥 11. Secret Vault / Search Command (নতুন যোগ করা হয়েছে)
      keywords: ['secret', 'search', 'find', 'open search', 'magic', 'ah', 'chudi'],
      action: () => {
         // এটি SecretVault.tsx এ সিগন্যাল পাঠাবে
         window.dispatchEvent(new Event('open-secret-search'));
      },
      message: "ছিঃ! 🫣 এই সার্চ হিস্ট্রি কিন্তু আমি তোর বাপেক পাঠাবো! 📞👨‍🦰"
    },
    
    // 🔥 আরও কমান্ড যোগ করতে চাইলে এখানে লিখুন...
  ];

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const toggleListen = () => {
    if (!isSupported) {
      triggerIsland("Voice Control not supported ❌", "info");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      triggerIsland("হ হ শুনোছি, তুই কতে থাক! 👂🐸", "info");
    } else {
      recognition.stop();
      setIsListening(false);
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("User said:", transcript);
      handleSmartCommand(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // 🧠 স্মার্ট কমান্ড প্রসেসর
  const handleSmartCommand = (transcript: string) => {
    // আমরা লুপ চালিয়ে দেখব ইউজারের কথার সাথে কোনো কিওয়ার্ড মিলে কিনা
    const matchedCommand = COMMANDS.find(cmd => 
      cmd.keywords.some(keyword => transcript.includes(keyword))
    );

    if (matchedCommand) {
      matchedCommand.action(); // কাজ করবে
      triggerIsland(matchedCommand.message, "success"); // নোটিফিকেশন দেখাবে
    } else {
      triggerIsland(`Did not catch that: "${transcript}" 🤷‍♂️`, "info");
    }
  };

  // হেল্পার: সেকশনে স্ক্রল করা
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      triggerIsland(`Section #${id} not found!`, "info");
    }
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleListen}
      className={`relative group p-3 rounded-xl transition-all duration-300 ease-out 
        ${isListening 
          ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110' 
          : 'text-slate-400 hover:text-white hover:bg-white/10'
        }
      `}
    >
      {isListening ? <Mic size={22} className="animate-pulse" /> : <MicOff size={22} />}
      
      <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold tracking-wider text-white bg-slate-800/90 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-xl border border-white/10 whitespace-nowrap pointer-events-none z-50">
        Voice
        <span className="absolute w-2 h-2 rotate-45 -translate-x-1/2 -bottom-1 left-1/2 bg-slate-800/90"></span>
      </span>
    </button>
  );
};

export default VoiceControl;