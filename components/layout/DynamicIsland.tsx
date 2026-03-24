import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, BellRing, X } from 'lucide-react';

// 🔥 Safe Haptic Helper
const vibratePhone = (type: 'success' | 'info' | 'error') => {
  // ব্রাউজার যদি পারমিশন দেয় এবং ইউজার ইন্টার‍্যাক্ট করে থাকে তবেই ভাইব্রেট হবে
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      // সেফটি চেক: পেজ লোড হওয়ার সাথে সাথে ভাইব্রেট করলে ব্রাউজার এরর দেয়, তাই আমরা এটা চেক করব
      // @ts-ignore (TypeScript এর জন্য ইগনোর ফ্ল্যাগ, কারণ সব ব্রাউজারে এটি থাকে না)
      const canVibrate = navigator.userActivation ? navigator.userActivation.hasBeenActive : true;

      if (canVibrate) {
        if (type === 'success') navigator.vibrate([30, 50, 30]);
        else if (type === 'error') navigator.vibrate([50, 50, 100]);
        else navigator.vibrate(15);
      }
    } catch (e) {
      // সাইলেন্টলি ফেইল করবে, কনসোলে লাল এরর দেখাবে না
    }
  }
};

export const triggerIsland = (
  msg: string,
  type: 'success' | 'info' | 'error' = 'success',
  duration = 7000
) => {
  vibratePhone(type);
  const event = new CustomEvent('dynamic-island', { detail: { msg, type, duration } });
  window.dispatchEvent(event);
};

const DynamicIsland: React.FC = () => {
  const [active, setActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'info' | 'error'>('success');

  // 🔥 স্টাইল ইনজেকশন (ডুপ্লিকেট রোধ করার জন্য ID ব্যবহার করা হয়েছে)
  useEffect(() => {
    const styleId = 'dynamic-island-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const handleEvent = (e: any) => {
      setMessage(e.detail.msg);
      setType(e.detail.type);
      setActive(true);

      // open animation
      setTimeout(() => setIsExpanded(true), 100);

      // custom duration — default 7s
      const closeDuration = e.detail.duration ?? 7000;
      const closeTimer = setTimeout(() => {
        setIsExpanded(false);
        setTimeout(() => setActive(false), 500);
      }, closeDuration);

      return () => clearTimeout(closeTimer);
    };

    window.addEventListener('dynamic-island', handleEvent);
    return () => window.removeEventListener('dynamic-island', handleEvent);
  }, []);

  return (
    // 🔥 Navbar এর নিচে রাখার জন্য 'top-24' ব্যবহার করা হয়েছে
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100000] flex justify-center items-start w-full pointer-events-none">
      <div 
        className={`
          pointer-events-auto relative flex items-center justify-center gap-4 overflow-hidden 
          bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10
          shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] 
          transition-all duration-[600ms] cubic-bezier(0.16, 1, 0.3, 1)
          
          /* 🔥 Auto-Resize Logic */
          ${active 
            ? (isExpanded 
                ? 'w-fit min-w-[320px] max-w-[90vw] h-auto min-h-[58px] py-3 px-5 rounded-[32px] opacity-100 translate-y-0 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'w-[50px] h-[14px] rounded-full px-0 opacity-0 -translate-y-6') 
            : 'w-[0px] h-[0px] opacity-0'}
        `}
      >
        {/* Shimmer Effect */}
        {isExpanded && (
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0"></div>
        )}

        {/* Content Container */}
        <div className={`relative z-10 flex items-center gap-4 w-full transition-all duration-500 delay-100 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          
          {/* Icon Box */}
          <div className="relative shrink-0">
             <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
             <div className={`relative p-2 rounded-full ${
               type === 'success' ? 'bg-gradient-to-b from-green-500/20 to-green-900/20 text-green-400' : 
               type === 'error' ? 'bg-gradient-to-b from-red-500/20 to-red-900/20 text-red-400' :
               'bg-gradient-to-b from-blue-500/20 to-blue-900/20 text-blue-400'
             }`}>
               {type === 'success' ? <CheckCircle size={20} /> : type === 'error' ? <X size={20} /> : <BellRing size={20} className="animate-wiggle" />}
             </div>
          </div>

          {/* Message Text Area */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
              System
            </span>
            {/* 🔥 Text wrapping fix */}
            <span className="font-sans text-sm font-medium leading-snug break-words whitespace-normal text-white/95">
              {message}
            </span>
          </div>

          {/* Close Button */}
          <button onClick={() => setIsExpanded(false)} className="shrink-0 p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicIsland;