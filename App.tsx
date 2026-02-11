import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ============================================================
// ðŸ“± Mobile Lite Version Detection
// ============================================================
import useMobileDetect from './hooks/useMobileDetect';
import LiteHero from './components/LiteHero';
import LiteNavbar from './components/LiteNavbar';
import LiteAbout from './components/LiteAbout'; // âœ… à¦¨à¦¤à§à¦¨

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
import ScrollProgressBtn from './components/ScrollProgressBtn';
import NetworkStatus from './components/NetworkStatus';
import SecretVault from './components/SecretVault';
import MobilePremiumFeatures from './components/MobilePremiumFeatures';
import BatteryOptimizer from './components/BatteryOptimizer';

// âœ… Heavy effects â€” à¦¶à§à¦§à§ desktop à¦ à¦¦à§‡à¦–à¦¾à¦¬à§‡ (mobile lite à¦¤à§‡ skip)
import { SunlightSpotlight } from './components/ui/sunlight-spotlight';
import DynamicIsland from './components/DynamicIsland';

import { AuthProvider } from './context/AuthContext';
import UserProfile from './pages/UserProfile';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ============================================================
// ðŸ“± Lite Mobile RevealOnScroll â€” simpler, no heavy spring
// ============================================================
const LiteReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
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
  const [isLoading, setIsLoading] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // ðŸ“± Mobile lite mode detection
  const isMobileLite = useMobileDetect();

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

    // Click vibration â€” only on desktop (not needed on mobile lite, saves CPU cycles)
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

  // Keyboard shortcuts â€” only desktop
  useEffect(() => {
    if (isMobileLite) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) return;
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

  // ðŸ“± Reveal wrapper â€” lite vs full
  const Reveal = isMobileLite ? LiteReveal : RevealOnScroll;

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

      {/* âœ… Heavy effects â€” à¦¶à§à¦§à§ desktop à¦ render à¦¹à¦¬à§‡ (mobile lite à¦¤à§‡ skip) */}
      {!isMobileLite && <SunlightSpotlight className="z-[50]" />}
      {!isMobileLite && <DynamicIsland />}

      <ScrollToTop />

      {/* âœ… à¦¸à¦¬ device à¦ à¦¥à¦¾à¦•à¦¬à§‡ à¦à¦—à§à¦²à§‹ (lightweight) */}
      <SecretVault />
      <DynamicTitle />
      <NetworkStatus />

      {/* ContextMenu â€” à¦¶à§à¦§à§ desktop à¦ (mobile à¦¤à§‡ right-click à¦¨à§‡à¦‡) */}
      {!isMobileLite && <ContextMenu />}

      {/* BatteryOptimizer â€” à¦¶à§à¦§à§ desktop à¦ */}
      {!isMobileLite && <BatteryOptimizer isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}

      {/* MobilePremiumFeatures â€” à¦¶à§à¦§à§ mobile à¦ (à¦•à¦¿à¦¨à§à¦¤à§ lite mode handle à¦•à¦°à§‡) */}
      <MobilePremiumFeatures />

      {/* Preloader â€” à¦¶à§à¦§à§ home page à¦ */}
      {isLoading && location.pathname === '/' && <Preloader onFinish={() => setIsLoading(false)} />}

      <div
        className={`transition-opacity duration-700 ease-out ${isLoading && location.pathname === '/' ? 'opacity-0' : 'opacity-100'}`}
        style={{ position: 'relative', zIndex: 10 }}
      >

        {/* ===== NAVBAR â€” Lite vs Full ===== */}
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

        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* ===== HERO â€” Lite vs Full ===== */}
                {isMobileLite ? <LiteHero /> : <Hero />}

                <TechMarquee />

                {/* ===== ABOUT â€” Lite vs Full ===== */}
                <Reveal delay={0.1}>
                  <section id="about">
                    {isMobileLite ? <LiteAbout /> : <About />}
                  </section>
                </Reveal>

                <Reveal delay={0.1}><section id="projects"><Projects /></section></Reveal>
                <Reveal><section id="resources"><Resources /></section></Reveal>
                <Reveal><FacebookFeed /></Reveal>
                <Reveal><section id="journey"><Journey /></section></Reveal>
                <div id="feedback"><FeedbackList /></div>
                <Reveal><section id="contact"><Contact /></section></Reveal>
                <FeedbackSlider onSubmit={handleNewFeedback} />
              </>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>

        <Footer />

        {/* ===== Global Widgets ===== */}
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

// ============================================================
// Root App
// ============================================================
const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;