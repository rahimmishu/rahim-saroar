import React, { useEffect, useState } from 'react';
import './Preloader.css';

// onFinish প্রপস গ্রহণ করার জন্য ইন্টারফেস ডিফাইন করা হলো
interface PreloaderProps {
  onFinish: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ৪.৫ সেকেন্ড পর ফেইড আউট শুরু হবে
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // ফেইড আউট এনিমেশন (০.৮ সেকেন্ড) শেষ হওয়ার পর প্যারেন্টকে জানাবে
      setTimeout(() => {
        onFinish(); 
      }, 900); // ৮০০ms এর একটু বেশি সময় দেওয়া হলো সেফটির জন্য

    }, 4500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`preloader-overlay ${!isLoading ? 'preloader-hidden' : ''}`}>
      {/* Circle Loader */}
      <div className="loader">
        <svg viewBox="0 0 80 80">
          <circle id="test" cx="40" cy="40" r="32"></circle>
        </svg>
      </div>

      {/* Triangle Loader */}
      <div className="loader triangle">
        <svg viewBox="0 0 86 80">
          <polygon points="43 8 79 72 7 72"></polygon>
        </svg>
      </div>

      {/* Rect Loader */}
      <div className="loader">
        <svg viewBox="0 0 80 80">
          <rect x="8" y="8" width="64" height="64"></rect>
        </svg>
      </div>
    </div>
  );
};

export default Preloader;