import React, { useState, useEffect, useRef } from 'react';
import { triggerIsland } from './DynamicIsland';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      triggerIsland("Back Online! Connection Restored 🟢", "success");
      hasTriggeredRef.current = false; 
    };

    const handleOffline = () => {
      setIsOnline(false);
      triggerIsland("You are Offline! Check internet 🔴", "error");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    // 🔥 FIX: ফাংশনটি if ব্লকের বাইরে নিয়ে আসা হয়েছে
    const updateConnectionStatus = () => {
      if (!connection) return;

      const type = connection.effectiveType; 
      
      if ((type === '2g' || type === 'slow-2g') && !hasTriggeredRef.current && navigator.onLine) {
        triggerIsland(`Network is slow (${type ? type.toUpperCase() : 'Slow'}). Loading Lite Mode 🐢`, "info");
        hasTriggeredRef.current = true;
      }

      if (connection.saveData && !hasTriggeredRef.current) {
          triggerIsland("Data Saver Mode Detected 📉", "info");
          hasTriggeredRef.current = true;
      }
    };

    let statusTimeoutId: NodeJS.Timeout | null = null;
    
    if (connection) {
      statusTimeoutId = setTimeout(updateConnectionStatus, 5000);
      connection.addEventListener('change', updateConnectionStatus);
    }

    return () => {
      // ✅ Ensure all cleanup is performed
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (statusTimeoutId) {
        clearTimeout(statusTimeoutId);
      }
      
      if (connection) {
        connection.removeEventListener('change', updateConnectionStatus); 
      }
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <section className="fixed inset-0 z-[99999] bg-white flex items-center justify-center w-full h-screen overflow-hidden font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Arvo');
        .font-arvo { font-family: 'Arvo', serif; }
        .four_zero_four_bg {
          background-image: url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif');
          height: 400px;
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>

      <div className="container px-4 mx-auto text-center font-arvo">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl four_zero_four_bg">
            <h1 className="text-[80px] font-bold text-center text-slate-800 mt-10">404</h1>
          </div>
          <div className="-mt-12">
            <h3 className="text-[40px] md:text-[60px] font-bold text-slate-800 mb-2">
              Look like you're lost
            </h3>
            <p className="mb-8 text-xl text-slate-600">
              Check your internet connection! You are currently offline.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-block px-8 py-3 bg-[#39ac31] text-white font-bold rounded hover:bg-[#2d8a26] transition-colors shadow-lg cursor-pointer active:scale-95 duration-200"
            >
              Try to Reconnect
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkStatus;