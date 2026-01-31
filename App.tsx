import React, { useState, useEffect } from 'react';
import { X, Quote } from 'lucide-react';

// Components Imports
import AppNavbar from './components/AppNavbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import About from './components/About';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Tools from './components/Tools';
import FacebookFeed from './components/FacebookFeed';
import Resources from './components/Resources';
import PhotoGallery from './components/PhotoGallery';
import FeedbackSlider from './components/FeedbackSlider';

// 🔥 Animation Component Import
import RevealOnScroll from './components/RevealOnScroll';

// Special & Utility Components
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

// ফিডব্যাক টাইপ ডিফিনিশন
interface Feedback {
  name: string;
  rating: number;
  label: string;
  date: string;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // 🔥 ফিডব্যাক স্টেট
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // ডার্ক মোড এবং ফিডব্যাক লোড করা
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

    // 📥 লোড ফিডব্যাক ফ্রম লোকাল স্টোরেজ
    const savedFeedbacks = localStorage.getItem('user_feedbacks');
    if (savedFeedbacks) {
      try {
        setFeedbacks(JSON.parse(savedFeedbacks));
      } catch (error) {
        console.error("Failed to parse feedbacks:", error);
      }
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // 💾 নতুন ফিডব্যাক সেভ করার ফাংশন
  const handleNewFeedback = (data: { name: string; rating: number; label: string }) => {
    const newFeedback: Feedback = {
      ...data,
      date: new Date().toLocaleDateString()
    };
    
    const updatedList = [newFeedback, ...feedbacks]; // নতুনটা সবার উপরে
    setFeedbacks(updatedList);
    localStorage.setItem('user_feedbacks', JSON.stringify(updatedList));
  };

  // Keyboard Shortcuts Handler
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
  }, []); // removed toggleTheme dependency to avoid re-binding

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      
      {/* 🔥 Secret Vault */}
      <SecretVault />

      {/* Utilities */}
      <DynamicTitle />
      <NetworkStatus />
      <ContextMenu />
      <NoiseOverlay />
      
      {/* 🔥 পপ-আপ ফিডব্যাক স্লাইডার */}
      <FeedbackSlider onSubmit={handleNewFeedback} />

      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

      {/* মেইন কন্টেন্ট র‍্যাপারে z-index দেওয়া হলো যাতে টিউবগুলো নিচে থাকে */}
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
        
        {/* 🔥 SCROLL ANIMATIONS START HERE */}
        
        <RevealOnScroll>
          <About />
        </RevealOnScroll>
        
        <RevealOnScroll delay={0.1}>
          <section id="projects">
            <Projects />
          </section>
        </RevealOnScroll>

        <RevealOnScroll>
          <Resources />
        </RevealOnScroll>

        <RevealOnScroll>
          <FacebookFeed />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <Achievements />
        </RevealOnScroll>

        <RevealOnScroll>
          <Certifications />
        </RevealOnScroll>

        <RevealOnScroll>
          <Journey />
        </RevealOnScroll>

        <RevealOnScroll>
          <Contact />
        </RevealOnScroll>

        {/* 🔥 SAVED FEEDBACKS SECTION (ANIMATED) */}
        {feedbacks.length > 0 && (
          <RevealOnScroll>
            <section className="py-16 border-t bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800">
              <div className="max-w-6xl px-4 mx-auto">
                <div className="mb-10 text-center">
                  <h2 className="mb-3 text-3xl font-bold">Community Love 💖</h2>
                  <p className="text-slate-500">What visitors are saying about this portfolio</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {feedbacks.map((fb, idx) => (
                    <div key={idx} className="p-6 transition-transform bg-white border shadow-sm dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700 hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 text-blue-500 rounded-full bg-blue-50 dark:bg-slate-700">
                          <Quote size={20} />
                        </div>
                        <span className="font-mono text-xs text-slate-400">{fb.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold">{fb.rating === 5 ? '🤩' : fb.rating === 4 ? '😄' : '🙂'}</span>
                        <span className="text-lg font-bold">{fb.label}</span>
                      </div>
                      
                      <div className="w-full h-1 mb-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(fb.rating / 5) * 100}%` }}
                        ></div>
                      </div>

                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        — {fb.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </RevealOnScroll>
        )}

        <Footer />

        {/* Floating Elements */}
        <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        <MusicPlayer isPlaying={isMusicPlaying} togglePlay={() => setIsMusicPlaying(!isMusicPlaying)} />
        <ScrollProgressBtn />
        <FloatingDock toggleChat={() => setIsChatOpen(!isChatOpen)} toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)} />
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
  );
};

export default App;