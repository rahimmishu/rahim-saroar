import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Components Imports
import AppNavbar from './components/AppNavbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import Projects from './components/Projects';
// Achievements & Certifications রিমুভ করা হয়েছে
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
import NoiseOverlay from './components/NoiseOverlay';
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

import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
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

  return (
    <AuthProvider>
      <main className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        
        <SecretVault />
        <MobilePremiumFeatures />
        <DynamicIsland />

        <DynamicTitle />
        <NetworkStatus />
        <ContextMenu />
        <NoiseOverlay />
        <BatteryOptimizer isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <FeedbackSlider onSubmit={handleNewFeedback} />

        {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

        <div 
          className={`transition-opacity duration-1000 ease-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ position: 'relative', zIndex: 10 }}
        >
          
          <AppNavbar
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            onOpenTools={() => setIsToolsOpen(true)}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
          
          <Hero />
          <TechMarquee />
          
          <RevealOnScroll>
            <section id="about">
              <About />
            </section>
          </RevealOnScroll>
          
          <RevealOnScroll delay={0.1}>
            <section id="projects">
              <Projects />
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section id="resources">
              <Resources />
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <FacebookFeed />
          </RevealOnScroll>
          
          {/* ❌ Achievements & Certifications সেকশন এখান থেকে মুছে ফেলা হয়েছে */}

          <RevealOnScroll>
            <section id="journey">
              <Journey />
            </section>
          </RevealOnScroll>

          <div id="feedback">
             <FeedbackList />
          </div>

          <RevealOnScroll>
            <section id="contact">
              <Contact />
            </section>
          </RevealOnScroll>


          <Footer />

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
            <div className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
              <button onClick={() => setIsToolsOpen(false)} className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:rotate-90">
                <X size={28} />
              </button>
              <div className="relative min-h-screen"><Tools /></div>
            </div>
          )}
        </div>
      </main>
    </AuthProvider>
  );
};

export default App;