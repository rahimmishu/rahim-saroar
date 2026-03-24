import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const RedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const targetUrl = searchParams.get('url');
  const platform = searchParams.get('platform') || 'External Site';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!targetUrl) return;

    // ৫ সেকেন্ডের কাউন্টডাউন
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl; // অটো রিডাইরেক্ট
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  // যদি লিংকে কোনো URL না থাকে
  if (!targetUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <h1 className="text-2xl font-bold text-red-500">Invalid Link Provide করা হয়েছে!</h1>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-950">
      {/* Background Glow Effects (তোমার ওয়েবসাইটের থিমের সাথে ম্যাচ করে) */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl top-[-10%] left-[-10%] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl bottom-[-10%] right-[-10%] animate-pulse delay-500"></div>

      <div className="relative z-10 w-full max-w-md p-8 mx-4 text-center border shadow-2xl bg-white/10 dark:bg-black/40 backdrop-blur-2xl border-white/10 rounded-3xl">
        
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          <span className="text-2xl animate-bounce">🚀</span>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
          Taking you to {platform}
        </h1>
        
        <p className="mb-8 text-sm text-slate-400">
          You are leaving our website. We are redirecting you securely in <span className="font-bold text-white">{countdown}</span> seconds...
        </p>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-105 active:scale-95 shadow-purple-500/30"
        >
          Open {platform} Now
        </a>
      </div>
    </div>
  );
};

export default RedirectPage;