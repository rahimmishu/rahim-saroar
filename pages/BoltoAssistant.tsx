import React, { useEffect } from 'react';

const BoltoAssistant: React.FC = () => {
  // অ্যাসিস্ট্যান্ট পেজে ঢোকার পর পোর্টফোলিওর ডিফল্ট স্ক্রলবার বন্ধ করে দেওয়া
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-black">
      <iframe
        src="/bolto/index.html"
        className="w-full h-full border-none outline-none"
        title="B.O.L.T.O Assistant"
        // ক্যামেরা এবং মাইক্রোফোনের পারমিশন দেওয়াটা খুবই জরুরি
        allow="camera; microphone; display-capture; autoplay; fullscreen"
      />
      
      {/* পোর্টফোলিওতে ফিরে যাওয়ার জন্য একটা ছোট্ট ব্যাক বাটন */}
      <button 
        onClick={() => window.history.back()}
        className="absolute top-6 right-6 z-[101] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 text-white transition-all hover:scale-105"
        title="Go Back to Portfolio"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default BoltoAssistant;