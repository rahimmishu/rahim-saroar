import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollProgressBtn: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    // মোট স্ক্রল হাইট ক্যালকুলেশন
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;

    // কত শতাংশ স্ক্রল হয়েছে
    const progress = (scrollPosition / totalHeight) * 100;
    setScrollProgress(progress);

    // ৩০০ পিক্সেলের বেশি নামলে বাটন দেখাবে
    if (scrollPosition > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // সার্কেল এনিমেশন ক্যালকুলেশন
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-8 right-8 z-[90] transition-all duration-500 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="relative flex items-center justify-center w-12 h-12 transition-all bg-white rounded-full shadow-lg group dark:bg-slate-800 hover:shadow-xl hover:-translate-y-1"
      >
        {/* প্রোগ্রেস রিং (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 48 48"
        >
          {/* ব্যাকগ্রাউন্ড রিং */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-gray-200 dark:text-slate-700"
          />
          {/* ফিল রিং (এনিমেটেড) */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-blue-600 transition-all duration-100 dark:text-blue-400"
          />
        </svg>

        {/* অ্যারো আইকন */}
        <ArrowUp
          size={20}
          className="text-blue-600 transition-transform dark:text-blue-400 group-hover:scale-110"
        />
      </button>
    </div>
  );
};

export default ScrollProgressBtn;