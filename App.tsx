import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
// 🔥 ১. রাউটিং ইমপোর্ট করা হলো
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components Imports
import AppNavbar from './components/AppNavbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import Projects from './components/Projects';
import About from './components/About';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Tools from './components/Tools';
import FacebookFeed from './components/FacebookFeed';
import Resources from './components/Resources';
import PhotoGallery from './components/PhotoGallery';
import FeedbackSlider from './components/FeedbackSlider';
import FeedbackList from './components/FeedbackList';

import RevealOnScroll from './components/RevealOnScroll';

// Utilities
import Preloader from './components/Preloader';
import ContextMenu from './components/ContextMenu';
import FloatingDock from './components/FloatingDock';
import Chatbot from './components/Chatbot';
import MusicPlayer from './components/MusicPlayer';
import DynamicTitle from './components/DynamicTitle';
import ScrollProgressBtn from './components/ScrollProgressBtn';
import NetworkStatus from './components/NetworkStatus';
import SecretVault from './components/SecretVault';
import MobilePremiumFeatures from './components/MobilePremiumFeatures';
import DynamicIsland from './components/DynamicIsland';
import BatteryOptimizer from './components/BatteryOptimizer';

// ✅ Sunlight Spotlight Import
import { SunlightSpotlight } from './components/ui/sunlight-spotlight';

import { AuthProvider } from './context/AuthContext';
// 🔥 ২. নতুন পেজ ইমপোর্ট (নিশ্চিত করুন পাথ সঠিক আছে)
import UserProfile from './pages/UserProfile'; 

// 🔥 ৩. স্ক্রল টু টপ কম্পোনেন্ট (রাউট চেঞ্জ হলে পেজের শুরুতে নিয়ে যাবে)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 🔥 ৪. মেইন অ্যাপ কন্টেন্ট (যা সব পেজে কমন থাকবে বা লজিক হ্যান্ডেল করবে)
const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
   
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    const handleGlobalClick = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(5);
        }
      };
    
      document.addEventListener('click', handleGlobalClick);
      return () => {
        document.removeEventListener('click', handleGlobalClick);
      };

  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleNewFeedback = (data: { name: string; rating: number; label: string }) => {
    console.log("New Feedback Submitted:", data);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
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
  }, []); 

  // রাউটের লোকেশন পাওয়ার জন্য
  const location = useLocation();
  // প্রোফাইল পেজে থাকলে কিছু গ্লোবাল কম্পোনেন্ট হাইড করার জন্য (অপশনাল)
  const isProfilePage = location.pathname === '/profile';

  return (
      // 👇 পরিবর্তন: dark:bg-[#000000] ব্যবহার করা হয়েছে Pure Black এর জন্য
      <main className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300 bg-white dark:bg-[#000000] text-slate-900 dark:text-white">
        
        <Toaster 
           position="top-center" 
           reverseOrder={false} 
           toastOptions={{
             style: {
               background: '#333',
               color: '#fff',
               borderRadius: '10px',
               border: '1px solid #444',
             },
             success: {
               iconTheme: {
                 primary: '#10B981',
                 secondary: 'white',
               },
             },
           }}
        />
        
        <SunlightSpotlight className="z-[50]" />
        <ScrollToTop />

        {/* এই ফিচারগুলো সব পেজেই থাকবে */}
        <SecretVault />
        <MobilePremiumFeatures />
        <DynamicIsland />
        <DynamicTitle />
        <NetworkStatus />
        <ContextMenu />
        <BatteryOptimizer isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        {/* হোম পেজে লোডার দেখাবো, অন্য পেজে অপশনাল */}
        {isLoading && location.pathname === '/' && <Preloader onFinish={() => setIsLoading(false)} />}

        <div 
          className={`transition-opacity duration-1000 ease-out ${(isLoading && location.pathname === '/') ? 'opacity-0' : 'opacity-100'}`}
          style={{ position: 'relative', zIndex: 10 }}
        >
          
          <AppNavbar
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            onOpenTools={() => setIsToolsOpen(true)}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
          
          {/* 🔥 ৫. রাউটিং সেটআপ */}
          <Routes>
            {/* হোম পেজ (আগের সব সেকশন) */}
            <Route path="/" element={
              <>
                <Hero />
                <TechMarquee />
                <RevealOnScroll><section id="about"><About /></section></RevealOnScroll>
                <RevealOnScroll delay={0.1}><section id="projects"><Projects /></section></RevealOnScroll>
                <RevealOnScroll><section id="resources"><Resources /></section></RevealOnScroll>
                <RevealOnScroll><FacebookFeed /></RevealOnScroll>
                <RevealOnScroll><section id="journey"><Journey /></section></RevealOnScroll>
                <div id="feedback"><FeedbackList /></div>
                <RevealOnScroll><section id="contact"><Contact /></section></RevealOnScroll>
                <FeedbackSlider onSubmit={handleNewFeedback} />
              </>
            } />

            {/* 🔥 নতুন প্রোফাইল রাউট */}
            <Route path="/profile" element={<UserProfile />} />
          </Routes>

          {/* ফুটার সব পেজে থাকবে */}
          <Footer />

          {/* গ্লোবাল উইজেটগুলো সব পেজে থাকবে */}
          <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          <MusicPlayer isPlaying={isMusicPlaying} togglePlay={() => setIsMusicPlaying(!isMusicPlaying)} />
          <ScrollProgressBtn />
          
          <FloatingDock 
            toggleChat={() => setIsChatOpen(!isChatOpen)} 
            toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
            toggleTheme={toggleTheme} 
          />
          
          <PhotoGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

          {isToolsOpen && (
            <div className="fixed inset-0 z-[100] bg-black overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
              <button onClick={() => setIsToolsOpen(false)} className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:rotate-90">
                <X size={28} />
              </button>
              <div className="relative min-h-screen"><Tools /></div>
            </div>
          )}
        </div>
      </main>
  );
};

// 🔥 ৬. মেইন অ্যাপ র‍্যাপার
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;