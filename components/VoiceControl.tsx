import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { triggerIsland } from './DynamicIsland'; // আপনার DynamicIsland ইমপোর্ট ঠিক থাকলে এটি কাজ করবে

interface VoiceControlProps {
  toggleTheme: () => void;
  toggleChat: () => void;
  toggleMusic: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ toggleTheme, toggleChat, toggleMusic }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // 🔥 1. কমান্ড লিস্ট (আপনার কাস্টম মেসেজ সহ)
  const COMMANDS = [
    {
      keywords: ['home', 'go to home', 'top', 'start', 'scroll up'], 
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      message: "Going Home 🏠"
    },
    {
      keywords: ['project', 'projects', 'my work', 'portfolio', 'show projects'],
      action: () => scrollToSection('projects'),
      message: "Opening Projects 📂"
    },
    {
      keywords: ['about', 'about me', 'who are you', 'bio', 'details'],
      action: () => scrollToSection('about'),
      message: "Showing About Section 👨‍💻"
    },
    {
      keywords: ['contact', 'email', 'message', 'call', 'touch'],
      action: () => scrollToSection('contact'),
      message: "Let's Connect! 📬"
    },
    {
      keywords: ['journey', 'history', 'experience', 'timeline'],
      action: () => scrollToSection('journey'),
      message: "My Journey 🚀"
    },
    {
      keywords: ['resource', 'resources', 'tools', 'skill', 'skills'],
      action: () => scrollToSection('resources'),
      message: "Checking Resources 🛠️"
    },
    {
      keywords: ['theme', 'dark mode', 'light mode', 'switch mode', 'change theme'],
      action: toggleTheme,
      message: "Theme Switched 🌗"
    },
    {
      keywords: ['music', 'play music', 'song', 'stop music', 'play song'],
      action: toggleMusic,
      message: "Music Player Toggled 🎵"
    },
    {
      keywords: ['chat', 'chatbot', 'ai', 'help', 'bot'],
      action: toggleChat,
      message: "AI Chat Toggled 🤖"
    },
    {
      keywords: ['facebook', 'fb', 'social media'],
      action: () => window.open('https://facebook.com/rahimsaroar', '_blank'),
      message: "Opening Facebook... 🌐"
    },
    {
      // 🔥 Secret Vault / Funny Command
      keywords: ['secret', 'search', 'find', 'open search', 'magic', 'ah', 'chudi'],
      action: () => {
         // এটি SecretVault.tsx এ সিগন্যাল পাঠাবে
         window.dispatchEvent(new Event('open-secret-search'));
      },
      message: "ছিঃ! 🫣 এই সার্চ হিস্ট্রি কিন্তু আমি তোর বাপেক পাঠাবো! 📞👨‍🦰"
    },
  ];

  useEffect(() => {
    // ব্রাউজার সাপোর্ট চেক
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const toggleListen = () => {
    if (!isSupported) {
      // যদি DynamicIsland না থাকে তবে সাধারণ অ্যালার্ট
      if (typeof triggerIsland === 'function') {
         triggerIsland("Voice Control not supported ❌", "info");
      } else {
         alert("Voice Control not supported in this browser ❌");
      }
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      if (typeof triggerIsland === 'function') {
        triggerIsland("হ হ শুনোছি, তুই কতে থাক! 👂🐸", "info");
      }
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

  const handleSmartCommand = (transcript: string) => {
    const matchedCommand = COMMANDS.find(cmd => 
      cmd.keywords.some(keyword => transcript.includes(keyword))
    );

    if (matchedCommand) {
      matchedCommand.action(); 
      if (typeof triggerIsland === 'function') {
        triggerIsland(matchedCommand.message, "success");
      }
    } else {
      if (typeof triggerIsland === 'function') {
        triggerIsland(`Did not catch that: "${transcript}" 🤷‍♂️`, "info");
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (typeof triggerIsland === 'function') {
        triggerIsland(`Section #${id} not found!`, "info");
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="relative flex items-center justify-center">
      {/* 🔥 আপডেট: বাটনটি এখন ট্রান্সপারেন্ট (bg-transparent)। 
         শুধুমাত্র লিসেনিং অবস্থায় লাল গ্লো হবে।
         টুলটিপটি এখান থেকে সরিয়ে দেওয়া হয়েছে কারণ FloatingDock নিজেই টুলটিপ দেখায়।
      */}
      <button
        onClick={toggleListen}
        className={`relative z-10 flex items-center justify-center transition-all duration-300 rounded-full outline-none
          ${isListening 
            ? 'bg-red-500/90 text-white p-3 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse' 
            : 'bg-transparent text-current p-0 hover:scale-105 active:scale-95' // 🔥 ফিক্স: text-white সরিয়ে text-current করা হয়েছে
          }
        `}
      >
        {isListening ? <Mic size={22} className="animate-spin" /> : <MicOff size={22} />}
      </button>

      {/* Listening Animation Waves (Only when listening) */}
      {isListening && (
        <>
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-red-400/30"></span>
          <span className="absolute inline-flex w-[120%] h-[120%] rounded-full opacity-50 animate-pulse bg-red-500/20"></span>
        </>
      )}
    </div>
  );
};

export default VoiceControl;