import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // অনলাইলে আসলে হ্যান্ডেল করা
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      
      // ৩ সেকেন্ড পর টোস্ট লুকিয়ে ফেলা
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    };

    // অফলাইনে গেলে হ্যান্ডেল করা
    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    // ইভেন্ট লিসেনার সেট করা
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // ক্লিনআপ
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // যদি টোস্ট দেখানোর প্রয়োজন না থাকে, তবে কিছুই রেন্ডার করবে না
  if (!showToast) return null;

  return (
    <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-500 ${
      isOnline 
        ? 'bg-green-500/90 text-white animate-in slide-in-from-bottom-5' 
        : 'bg-red-500/90 text-white animate-pulse'
    }`}>
      {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
      <span className="text-sm font-medium">
        {isOnline ? 'Back Online' : 'No Internet Connection'}
      </span>
    </div>
  );
};

export default NetworkStatus;