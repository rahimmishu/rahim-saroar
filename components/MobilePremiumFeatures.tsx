import React, { useEffect } from 'react';

const MobilePremiumFeatures: React.FC = () => {
  
  // 🔥 1. CSS স্টাইল ইনজেকশন
  useEffect(() => {
    const styleId = 'mobile-premium-styles';
    // ডুপ্লিকেট স্টাইল যাতে না হয়
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
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

  // 🔥 2. Haptic Feedback Only (Ripple Removed)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 📳 Haptic Feedback (Vibration) - এটি রেখে দেওয়া হলো যাতে ক্লিক করলে হালকা ভাইব্রেশন হয়
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
           navigator.vibrate(10);
        } catch (err) {
           // ভাইব্রেশন ব্লক হলে এরর ইগনোর করবে
        }
      }

      // ❌ Ripple Effect (ঢেউ) এর কোড এখান থেকে ডিলিট করা হয়েছে
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return null;
};

export default MobilePremiumFeatures;