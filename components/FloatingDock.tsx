import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Music, Bot, ArrowUp, 
  Home 
} from 'lucide-react';
import VoiceControl from './VoiceControl'; // 🔥 ভয়েস কন্ট্রোল ইমপোর্ট

interface FloatingDockProps {
  toggleChat: () => void;
  toggleMusic: () => void;
  toggleTheme: () => void;
}

const FloatingDock: React.FC<FloatingDockProps> = ({ toggleChat, toggleMusic, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      // স্ক্রল ১০০ পিক্সেলের বেশি হলে ডক দেখাবে
      if (window.scrollY > 100) { 
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔥 "Call Me" বাটনটি এখান থেকে সরিয়ে দেওয়া হয়েছে
  const dockItems = [
    {
      label: "Home",
      icon: <Home size={22} />,
      color: "hover:text-sky-400",
      bgGlow: "group-hover:bg-sky-500/20",
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    {
      label: "AI Chat",
      icon: <Bot size={22} />,
      color: "hover:text-purple-400",
      bgGlow: "group-hover:bg-purple-500/20",
      action: toggleChat
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle size={22} />,
      color: "hover:text-green-400",
      bgGlow: "group-hover:bg-green-500/20",
      action: () => window.open("https://wa.me/8801749896809", "_blank")
    },
    {
      label: "Music",
      icon: <Music size={22} />,
      color: "hover:text-pink-400",
      bgGlow: "group-hover:bg-pink-500/20",
      action: toggleMusic
    }
  ];

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-700 ease-out 
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}
    >
      {/* Glass Container */}
      <div className="flex items-center gap-1 px-4 py-3 border shadow-2xl sm:gap-2 bg-slate-900/80 dark:bg-black/60 backdrop-blur-2xl border-white/10 rounded-2xl shadow-black/50 ring-1 ring-white/5">
        
        {/* Dock Items Loop */}
        {dockItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`group relative p-3 rounded-xl transition-all duration-300 ease-out 
              ${item.color} ${hoveredIndex === index ? 'scale-125 -translate-y-2 mx-1' : 'scale-100'}
            `}
          >
            {/* Hover Glow */}
            <span className={`absolute inset-0 rounded-xl blur-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${item.bgGlow}`}></span>
            
            {/* Icon */}
            <span className="relative z-10 drop-shadow-lg">{item.icon}</span>

            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold tracking-wider text-white bg-slate-800/90 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-xl border border-white/10 whitespace-nowrap pointer-events-none">
              {item.label}
              <span className="absolute w-2 h-2 rotate-45 -translate-x-1/2 -bottom-1 left-1/2 bg-slate-800/90"></span>
            </span>
            
            {/* WhatsApp Active Dot */}
            {item.label === "WhatsApp" && (
              <span className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            )}
          </button>
        ))}

       {/* 🔥 Voice Control Update: toggleChat ও toggleMusic পাস করা হয়েছে */}
        <div className="mx-1 scale-90 sm:scale-100 transition-transform duration-300 hover:scale-110">
           <VoiceControl
            toggleTheme={toggleTheme} 
            toggleChat={toggleChat} 
            toggleMusic={toggleMusic}
            />
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-1 sm:mx-2"></div>

        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className="relative p-3 transition-all duration-300 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 group"
        >
          <ArrowUp size={22} className="group-hover:animate-bounce" />
          
           {/* Tooltip */}
           <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold text-white bg-slate-800/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
             Top
           </span>
        </button>

      </div>
    </div>
  );
};

export default FloatingDock;