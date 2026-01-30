import React, { useState, useEffect } from 'react';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // বর্তমান স্ট্যাটাস চেক করা
    setIsOnline(navigator.onLine);

    // ইভেন্ট লিসেনার যোগ করা
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // ক্লিনআপ
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // যদি ইউজার অনলাইনে থাকে, তবে কিছুই দেখাবে না (রিটার্ন নাল)
  if (isOnline) {
    return null;
  }

  // যদি অফলাইনে থাকে, তবে আপনার ডিজাইন দেখাবে
  return (
    <section className="fixed inset-0 z-[99999] bg-white flex items-center justify-center w-full h-screen overflow-hidden font-serif">
      
      {/* Google Font Import (Arvo) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Arvo');
        .font-arvo { font-family: 'Arvo', serif; }
        .four_zero_four_bg {
          background-image: url('/bg.gif');
          height: 400px;
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>

      <div className="container px-4 mx-auto text-center font-arvo">
        <div className="flex flex-col items-center justify-center">
          
          {/* GIF Background Area */}
          <div className="w-full max-w-3xl four_zero_four_bg">
            <h1 className="text-[80px] font-bold text-center text-slate-800 mt-10">404</h1>
          </div>

          {/* Content Box */}
          <div className="-mt-12">
            <h3 className="text-[40px] md:text-[60px] font-bold text-slate-800 mb-2">
              Look like you're lost
            </h3>

            <p className="mb-8 text-xl text-slate-600">
              Check your internet connection! You are currently offline.
            </p>

            <button 
              onClick={() => window.location.reload()} 
              className="inline-block px-8 py-3 bg-[#39ac31] text-white font-bold rounded hover:bg-[#2d8a26] transition-colors shadow-lg cursor-pointer"
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