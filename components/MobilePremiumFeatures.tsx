import React, { useEffect } from 'react';

const MobilePremiumFeatures: React.FC = () => {
  
  useEffect(() => {
    // 1. Haptic Feedback & Ripple Effect Logic
    const handleClick = (e: MouseEvent) => {
      // 📳 Haptic Feedback (Vibration)
      if (navigator.vibrate) {
        navigator.vibrate(10); // 10ms হালকা ভাইব্রেশন
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
        ripple.remove();
      }, 600);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <style jsx global>{`
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
        -webkit-tap-highlight-color: transparent; /* ব্লু হাইলাইট বন্ধ করা */
      }
    `}</style>
  );
};

export default MobilePremiumFeatures;