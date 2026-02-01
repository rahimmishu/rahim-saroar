import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, BellRing, X } from 'lucide-react';

export const triggerIsland = (msg: string, type: 'success' | 'info' = 'success') => {
  const event = new CustomEvent('dynamic-island', { detail: { msg, type } });
  window.dispatchEvent(event);
};

const DynamicIsland: React.FC = () => {
  const [active, setActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'info'>('success');

  useEffect(() => {
    const handleEvent = (e: any) => {
      setMessage(e.detail.msg);
      setType(e.detail.type);
      
      // ১. শুরু (Start)
      setActive(true);

      // ২. ২০০ms পর এক্সপ্যান্ড হবে
      setTimeout(() => {
        setIsExpanded(true);
      }, 200);

      // ৩. 🔥 ফিক্স: ৭ সেকেন্ড পর বন্ধ হবে (আগে ৪ সেকেন্ড ছিল)
      setTimeout(() => {
        setIsExpanded(false);
        setTimeout(() => setActive(false), 500);
      }, 7000);
    };

    window.addEventListener('dynamic-island', handleEvent);
    return () => window.removeEventListener('dynamic-island', handleEvent);
  }, []);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100000] flex justify-center items-start">
      <div 
        className={`
          relative flex items-center justify-center gap-3 overflow-hidden 
          bg-[#0a0a0a] backdrop-blur-3xl border border-white/10
          shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] 
          transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1)
          ${active 
            ? (isExpanded 
                ? 'w-[340px] h-[58px] rounded-[40px] px-2 opacity-100 translate-y-0 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'w-[50px] h-[14px] rounded-full px-0 opacity-0 -translate-y-6') 
            : 'w-[0px] h-[0px] opacity-0'}
        `}
      >
        {/* Shimmer Effect (আলোর ঝিলিক) */}
        {isExpanded && (
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0"></div>
        )}

        {/* Content */}
        <div className={`relative z-10 flex items-center gap-3 w-full px-2 transition-all duration-700 delay-100 ${isExpanded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-95'}`}>
          
          {/* Icon Box with Ring Pulse */}
          <div className="relative">
             <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
             <div className={`relative p-2 rounded-full shrink-0 ${type === 'success' ? 'bg-gradient-to-b from-green-500/20 to-green-900/20 text-green-400' : 'bg-gradient-to-b from-blue-500/20 to-blue-900/20 text-blue-400'}`}>
               {type === 'success' ? <CheckCircle size={18} /> : <BellRing size={18} className="animate-wiggle" />}
             </div>
          </div>

          {/* Message Text */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-0.5">
              Notification
            </span>
            <span className="font-sans text-sm font-semibold tracking-wide truncate text-white/95">
              {message}
            </span>
          </div>

          {/* Close Button (Optional) */}
          <button onClick={() => setIsExpanded(false)} className="p-1 ml-auto text-gray-500 transition-colors hover:text-white">
            <X size={14} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DynamicIsland;