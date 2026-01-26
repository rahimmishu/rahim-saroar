import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onFinish: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // ১. মাত্র ২.৫ সেকেন্ড পর জুম শুরু হবে (আগে ৪ সেকেন্ড ছিল)
    const animationTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // ২. মোট ৩.৫ সেকেন্ড পর লোডার সরে যাবে
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none">
      
      {/* ব্যাকগ্রাউন্ড ফেড আউট */}
      <div 
        className={`absolute inset-0 bg-[#050505] transition-opacity duration-[800ms] ease-out delay-100
        ${isExiting ? 'opacity-0' : 'opacity-100'}`}
      ></div>

      {/* মেইন কন্টেন্ট (জুম কন্টেইনার) */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center transform-gpu will-change-transform
        transition-transform duration-[1000ms] ease-[cubic-bezier(0.7,0,0.3,1)]
        ${isExiting ? 'scale-[100]' : 'scale-100'}`}
      >
        
        <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-56 md:h-56">
          {/* ডায়মন্ড শেপ */}
          <path 
            className="stroke-animate"
            fill="transparent"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 100 20 L 180 100 L 100 180 L 20 100 Z" 
          />
          {/* রিং */}
          <circle 
            cx="100" cy="100" r="35" 
            fill="none" 
            stroke="white" 
            strokeWidth="1" 
            strokeDasharray="8 8"
            className={`origin-center animate-[spin_3s_linear_infinite] opacity-70 ${isExiting ? 'opacity-0 duration-200' : ''}`}
          />
          {/* কোর */}
          <rect 
            x="94" y="94" width="12" height="12" 
            fill="white"
            transform="rotate(45 100 100)"
            className="animate-pulse"
          />
        </svg>

        {/* লোডিং বার */}
        <div className={`absolute -bottom-24 transition-opacity duration-200 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-24 h-[1px] bg-slate-800 overflow-hidden relative">
                {/* প্রোগ্রেস বারও ফাস্ট করে দিয়েছি (২.২ সেকেন্ড) */}
                <div className="absolute inset-0 bg-white w-full origin-left animate-[progress_2.2s_ease-out_forwards]"></div>
            </div>
        </div>

      </div>

      <style>{`
        .stroke-animate {
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          /* ড্রয়িং স্পিড ফাস্ট করা হয়েছে (২ সেকেন্ড) */
          animation: draw 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes progress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
      `}</style>
    </div>
  );
};

export default Preloader;