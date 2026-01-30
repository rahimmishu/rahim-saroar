import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 

// Components Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import About from './components/About';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CreativeWork from './components/CreativeWork';
import ScienceSimulation from './components/ScienceSimulation';
import Tools from './components/Tools';
import FacebookFeed from './components/FacebookFeed';
import Resources from './components/Resources';
import PhotoGallery from './components/PhotoGallery';

// Special & Utility Components
import Preloader from './components/Preloader';
import ContextMenu from './components/ContextMenu';
import NoiseOverlay from './components/NoiseOverlay';

// 🔥 ফ্লোটিং কম্পোনেন্টস (FloatingWhatsApp বাদ দেওয়া হয়েছে কারণ এটি Dock-এ আছে)
import FloatingDock from './components/FloatingDock';
import Chatbot from './components/Chatbot';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  // ১. লোডিং স্টেট
  const [isLoading, setIsLoading] = useState(true);

  // টুলস এবং গ্যালারির জন্য স্টেট
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); 
  
  // 🔥 চ্যাট এবং মিউজিক প্লেয়ারের স্টেট
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // ডার্ক মোড স্টেট ইনিশিয়ালাইজেশন
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // SSR সেফটি চেক
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // থিম ইফেক্ট হ্যান্ডলার
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200">
      
      {/* 🔥 গ্লোবাল ইউটিলিটি কম্পোনেন্টস */}
      <ContextMenu />
      <NoiseOverlay />
      
      {/* 🔥 প্রি-লোডার: জুম এনিমেশন শেষ হলে মেইন কন্টেন্ট দেখাবে */}
      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

      {/* ৩. মেইন কন্টেন্ট র‍্যাপার (স্মুথ ফেড-ইন এনিমেশন সহ) */}
      <div className={`transition-opacity duration-1000 ease-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Navbar */}
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onOpenTools={() => setIsToolsOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)} 
        />
        
        {/* --- মূল সেকশনগুলো --- */}
        <Hero />
        <TechMarquee />
        
        <About />
        
        <Projects />
        <Resources />
        
        <FacebookFeed />
        
        <CreativeWork />
        <ScienceSimulation />
        
        <Achievements />
        <Certifications />
        
        <Journey />
        <Contact />
        
        <Footer />

        {/* --- ফ্লোটিং এলিমেন্টস কানেকশন --- */}
        
        {/* 🔥 চ্যাটবট কম্পোনেন্ট */}
        <Chatbot 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
        
        {/* 🔥 অডিও প্লেয়ার কম্পোনেন্ট */}
        <AudioPlayer 
          isPlaying={isMusicPlaying} 
          togglePlay={() => setIsMusicPlaying(!isMusicPlaying)} 
        />

        {/* ❌ FloatingWhatsApp এখান থেকে সরিয়ে দেওয়া হয়েছে (Clean Look) */}

        {/* 🔥 শুধু Floating Dock থাকবে (এর ভেতরেই WhatsApp, Chat, Music সব আছে) */}
        <FloatingDock 
          toggleChat={() => setIsChatOpen(!isChatOpen)}
          toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
        />
        
        {/* PHOTO GALLERY POPUP */}
        <PhotoGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

        {/* TOOLS POPUP MODAL */}
        {isToolsOpen && (
          <div className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
            
            {/* ক্লোজ বাটন */}
            <button 
              onClick={() => setIsToolsOpen(false)}
              className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:rotate-90"
            >
              <X size={28} />
            </button>

            {/* টুলস কন্টেন্ট */}
            <div className="relative min-h-screen">
                <Tools />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;