import React from 'react';

const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Blob 1 - Purple */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] rounded-full bg-purple-500/20 blur-[100px] animate-blob mix-blend-screen dark:mix-blend-overlay"></div>
      
      {/* Blob 2 - Blue */}
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[50%] rounded-full bg-blue-500/20 blur-[100px] animate-blob animation-delay-2000 mix-blend-screen dark:mix-blend-overlay"></div>
      
      {/* Blob 3 - Pink */}
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] rounded-full bg-pink-500/20 blur-[100px] animate-blob animation-delay-4000 mix-blend-screen dark:mix-blend-overlay"></div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AuroraBackground; // 🔥 এই লাইনটি অবশ্যই থাকতে হবে