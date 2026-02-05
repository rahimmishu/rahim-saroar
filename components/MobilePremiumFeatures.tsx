import React, { useEffect } from 'react';

const MobilePremiumFeatures: React.FC = () => {
  
  // 🔥 1. CSS স্টাইল ইনজেকশন (JSX এরর ফিক্স করার জন্য)
  useEffect(() => {
    const styleId = 'mobile-premium-styles';
    // ডুপ্লিকেট স্টাইল যাতে না হয়
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* 💧 Ripple Animation CSS */
        .touch-ripple {
          position: fixed;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(1);
          pointer-events: none;
          animation: rippleAnim 0.6s linear;
          z-index: 99999;
        }

        @keyframes rippleAnim {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(15); opacity: 0; }
        }

        /* 🚫 Hide Scrollbar (Clean App Look) */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
          display: none;
        }
        
        /* Smooth Scrolling for Mobile */
        html {
          scroll-behavior: smooth;
          -webkit-tap-highlight-color: transparent;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // 🔥 2. Haptic Feedback & Ripple Logic
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 📳 Haptic Feedback (Vibration) - সেফটি চেক সহ
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
           // ইউজার ইন্টার‍্যাকশনের ভেতরে থাকায় এটি কাজ করবে
           navigator.vibrate(10);
        } catch (err) {
           // ভাইব্রেশন ব্লক হলে এরর ইগনোর করবে
        }
      }

      // 💧 Ripple Effect
      const ripple = document.createElement('div');
      ripple.className = 'touch-ripple';
      
      // রিপল পজিশন সেট করা
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      
      document.body.appendChild(ripple);

      // অ্যানিমেশন শেষে রিমুভ করা
      setTimeout(() => {
        if (document.body.contains(ripple)) {
          document.body.removeChild(ripple);
        }
      }, 600);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // কোনো HTML রেন্ডার করার প্রয়োজন নেই, এটি শুধু লজিক এবং স্টাইল হ্যান্ডেল করবে
  return null;
};

export default MobilePremiumFeatures;