import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollVideoIntro from "./components/ScrollVideoIntro";

// ============================================================
// 📱 Mobile Lite Version Detection
// ============================================================
import useMobileDetect from './hooks/useMobileDetect';
import LiteHero from './components/LiteHero';
import LiteNavbar from './components/LiteNavbar';
import LiteAbout from './components/LiteAbout';

// ============================================================
// Full Version Components
// ============================================================
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
import NetworkStatus from './components/NetworkStatus';
import SecretVault from './components/SecretVault';
import MobilePremiumFeatures from './components/MobilePremiumFeatures';
import BatteryOptimizer from './components/BatteryOptimizer';

import { SunlightSpotlight } from './components/ui/sunlight-spotlight';
import DynamicIsland from './components/DynamicIsland';
import BackgroundEffects from './components/BackgroundEffects';

import { AuthProvider } from './context/AuthContext';
import UserProfile from './pages/UserProfile';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ============================================================
// 📱 Lite Mobile RevealOnScroll
// ============================================================
const LiteReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children, delay = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// ============================================================
// Main App Content
// ============================================================
const AppContent: React.FC = () => {
  const [isLoading, setIsLoading]           = useState(true);
  const [isToolsOpen, setIsToolsOpen]       = useState(false);
  const [isGalleryOpen, setIsGalleryOpen]   = useState(false);
  const [isChatOpen, setIsChatOpen]         = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const isMobileLite = useMobileDetect();

  // ============================================================
  // 🎬 Intro State
  // ============================================================
  const [introComplete, setIntroComplete] = useState(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('introSeen') === 'true';
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('introSeen', 'true');
    setIntroComplete(true);
  };

  const [siteVisible, setSiteVisible] = useState(false);
  useEffect(() => {
    if (introComplete) {
      requestAnimationFrame(() => setSiteVisible(true));
    }
  }, [introComplete]);

  // ============================================================
  // Theme
  // ============================================================
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    isDarkMode ? html.classList.add('dark') : html.classList.remove('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    if (!isMobileLite) {
      const handleClick = () => navigator.vibrate?.(5);
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isDarkMode, isMobileLite]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleNewFeedback = (data: { name: string; rating: number; label: string }) => {
    console.log('New Feedback Submitted:', data);
  };

  useEffect(() => {
    if (isMobileLite) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) return;
      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'h': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
          case 'c': setIsChatOpen(prev => !prev); break;
          case 'm': setIsMusicPlaying(prev => !prev); break;
          case 'd': toggleTheme(); break;
          case 'p': document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileLite]);

  const location = useLocation();
  const Reveal = isMobileLite ? LiteReveal : RevealOnScroll;

  const isIntroRunning = !introComplete && !isMobileLite && location.pathname === '/';

  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300 bg-white dark:bg-[#000000] text-slate-900 dark:text-white">

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: { background: '#333', color: '#fff', borderRadius: '10px', border: '1px solid #444' },
          success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
        }}
      />

      {!isMobileLite && <SunlightSpotlight className="z-[50]" />}
      {!isMobileLite && <DynamicIsland />}
      
      {/* ── 🌟 BACKGROUND GLOW EFFECTS (AFTER INTRO) ── */}
      {!isMobileLite && introComplete && <BackgroundEffects />}

      <ScrollToTop />
      <SecretVault />
      <DynamicTitle />
      <NetworkStatus />
      {!isMobileLite && <ContextMenu />}
      {!isMobileLite && <BatteryOptimizer isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      <MobilePremiumFeatures />

      {/* Preloader */}
      {isLoading && location.pathname === '/' && (
        <Preloader onFinish={() => setIsLoading(false)} />
      )}

      {/* ============================================================
          🎬 SCROLL VIDEO INTRO
          ─────────────────────────────────────────────────────────
          এটা <main> এর সরাসরি child, কোনো z-index wrapper নেই।
          ভিডিও overlay z-index: 40।
          Navbar ALSO এখন outside wrapper এ (নিচে দেখো) z-[50]।
          তাই Navbar (50) > Video (40) → Navbar সবসময় উপরে।
      ============================================================ */}
      {isIntroRunning && (
        <ScrollVideoIntro
       onComplete={handleIntroComplete}
       // frameFolder="/frames"  // ✅ যদি আপনার ফ্রেমগুলো 'public/frames' ফোল্ডারে থাকে তবে এই লাইনও লেখার দরকার নেই, ডিফল্ট কাজ করবে।
      />
      )}

      {/* ============================================================
          🔑 KEY FIX: NAVBAR — আগে এটা z-index:10 wrapper এর ভেতরে ছিল।
          সেই wrapper একটা stacking context তৈরি করে, ফলে navbar এর
          z-[50] video এর z-40 এর কাছে হেরে যাচ্ছিল।

          এখন Navbar টা সরাসরি <main> এর child — কোনো stacking
          context নেই — তাই z-[50] সরাসরি root level এ কাজ করে।
          Video (40) < Navbar (50) ✅
      ============================================================ */}
      {isMobileLite ? (
        <LiteNavbar
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onOpenTools={() => setIsToolsOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />
      ) : (
        <AppNavbar
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onOpenTools={() => setIsToolsOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />
      )}

      {/* ============================================================
          MAIN CONTENT WRAPPER
          ─────────────────────────────────────────────────────────
          ⚠️ আগে এখানে zIndex: 10 ছিল — সেটা সরিয়ে দেওয়া হয়েছে।
          zIndex শুধু তখন লাগে যখন overlapping element আছে।
          Preloader এর opacity কাজ করার জন্য position:relative যথেষ্ট।
      ============================================================ */}
      <div
        className={`transition-opacity duration-700 ease-out ${
          isLoading && location.pathname === '/' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ position: 'relative' /* zIndex সরিয়ে দেওয়া হয়েছে */ }}
      >

        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* HERO */}
                {isMobileLite ? (
                  <LiteHero />
                ) : introComplete ? (
                  <div
                    style={{
                      opacity: siteVisible ? 1 : 0,
                      transform: siteVisible ? 'translateY(0)' : 'translateY(14px)',
                      transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                    }}
                  >
                    <Hero />
                  </div>
                ) : null}

                {/* বাকি Sections */}
                {(introComplete || isMobileLite) && (
                  <div
                    style={{
                      opacity: siteVisible || isMobileLite ? 1 : 0,
                      transition: 'opacity 0.5s ease-out 0.3s',
                    }}
                  >
                    <TechMarquee />

                    <Reveal delay={0.1}>
                      <section id="about">
                        {isMobileLite ? <LiteAbout /> : <About />}
                      </section>
                    </Reveal>

                    <Reveal delay={0.1}>
                      <section id="projects"><Projects /></section>
                    </Reveal>

                    <Reveal>
                      <section id="resources"><Resources /></section>
                    </Reveal>

                    <Reveal><FacebookFeed /></Reveal>

                    <Reveal>
                      <section id="journey"><Journey /></section>
                    </Reveal>

                    <div id="feedback"><FeedbackList /></div>

                    <Reveal>
                      <section id="contact"><Contact /></section>
                    </Reveal>

                    <FeedbackSlider onSubmit={handleNewFeedback} />
                  </div>
                )}
              </>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>

        {(introComplete || isMobileLite || location.pathname !== '/') && <Footer />}

        <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        <MusicPlayer
          isPlaying={isMusicPlaying}
          togglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
        />

        {!isIntroRunning && (
          <FloatingDock
            toggleChat={() => setIsChatOpen(!isChatOpen)}
            toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
            toggleTheme={toggleTheme}
          />
        )}

        <PhotoGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

        {isToolsOpen && (
          <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
            <button
              onClick={() => setIsToolsOpen(false)}
              className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-red-600 text-white rounded-full border border-white/20 transition-all shadow-xl hover:rotate-90"
            >
              <X size={28} />
            </button>
            <div className="relative min-h-screen"><Tools /></div>
          </div>
        )}

      </div>
    </main>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;