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

// 🔥 ফ্লোটিং কম্পোনেন্টস
import FloatingDock from './components/FloatingDock';
import Chatbot from './components/Chatbot';
import AudioPlayer from './components/AudioPlayer';
import DynamicTitle from './components/DynamicTitle'; 
import ScrollProgressBtn from './components/ScrollProgressBtn';
import NetworkStatus from './components/NetworkStatus'; 

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

  // 🔥 KEYBOARD SHORTCUTS HANDLER
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.shiftKey) {
        switch(e.key.toLowerCase()) {
          case 'h': 
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          case 'c': 
            setIsChatOpen(prev => !prev);
            break;
          case 'm': 
            setIsMusicPlaying(prev => !prev);
            break;
          case 'd': 
            toggleTheme();
            break;
          case 'p': 
            const projectsSection = document.getElementById('projects');
            if (projectsSection) projectsSection.scrollIntoView({ behavior: 'smooth' });
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDarkMode]); 

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200">
      
      {/* 🔥 গ্লোবাল ইউটিলিটি কম্পোনেন্টস */}
      <DynamicTitle />
      <NetworkStatus /> 
      <ContextMenu />
      <NoiseOverlay />
      
      {/* 🔥 প্রি-লোডার */}
      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

      {/* ৩. মেইন কন্টেন্ট র‍্যাপার */}
      <div className={`transition-opacity duration-1000 ease-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onOpenTools={() => setIsToolsOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)} 
        />
        
        <Hero />
        <TechMarquee />
        <About />

        
        
        <section id="projects">
          <Projects />
        </section>

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
        
        <Chatbot 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
        
        <AudioPlayer 
          isPlaying={isMusicPlaying} 
          togglePlay={() => setIsMusicPlaying(!isMusicPlaying)} 
        />

        <ScrollProgressBtn />

        <FloatingDock 
          toggleChat={() => setIsChatOpen(!isChatOpen)}
          toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
        />
        
        {/* MODALS */}
        <PhotoGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

        {isToolsOpen && (
          <div className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
            <button 
              onClick={() => setIsToolsOpen(false)}
              className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:rotate-90"
            >
              <X size={28} />
            </button>
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