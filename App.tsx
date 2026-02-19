import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 🚀 Hidden Performance Optimizer (background এ চলবে)
import { usePerformanceOptimizer } from './hooks/usePerformanceOptimizer';
import { registerServiceWorker } from './lib/registerSW';

// Register Service Worker for caching (hidden, automatic)
registerServiceWorker();

// ============================================================
// 📱 Mobile Lite Version Detection
// ============================================================
import useMobileDetect from './hooks/useMobileDetect';
import LiteHero from './components/LiteHero';
import LiteNavbar from './components/LiteNavbar';
import LiteAbout from './components/LiteAbout';
import { Analytics } from "@vercel/analytics/next"

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
import FacebookFeed from './components/FacebookFeed';
import Resources from './components/Resources';
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
import PerformanceDebug from './components/PerformanceDebug';

// Heavy effects — desktop only (mobile lite তে skip)
import { SunlightSpotlight } from './components/ui/sunlight-spotlight';
import DynamicIsland from './components/DynamicIsland';

import { AuthProvider } from './context/AuthContext';

// ── Pages ────────────────────────────────────────────────────────────────────
import UserProfile from './pages/UserProfile';
import ToolsPage   from './pages/ToolsPage';    // 🆕 /tools
import GalleryPage from './pages/GalleryPage';  // 🆕 /gallery
import VaultPage   from './pages/VaultPage';    // 🆕 /vault
// ❌ সরানো হয়েছে: import Tools, import PhotoGallery (এখন আলাদা page)

// ============================================================
// Scroll to top on route change
// ============================================================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ============================================================
// 📱 Lite Mobile RevealOnScroll — simpler, no heavy spring
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
  // 🚀 Hidden Performance Optimizer (completely silent, zero UI impact)
  const perfStatus = usePerformanceOptimizer();
  
  const [isLoading, setIsLoading]           = useState(true);
  const [showBanner, setShowBanner]         = useState(false);
  // ❌ isToolsOpen সরানো হয়েছে — এখন /tools route
  // ❌ isGalleryOpen সরানো হয়েছে — এখন /gallery route
  const [isChatOpen, setIsChatOpen]         = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // 📱 Mobile lite mode detection
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

    // Click vibration — only on desktop (mobile lite তে CPU save)
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

  // Keyboard shortcuts — only desktop
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

  // 📱 Reveal wrapper — lite vs full
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

      {/* Heavy effects — desktop only */}
      {!isMobileLite && <SunlightSpotlight className="z-[50]" />}
      {!isMobileLite && <DynamicIsland />}

      <Analytics/>
      <ScrollToTop />

      {/* সব device এ চলে (lightweight) */}
      <SecretVault />
      <DynamicTitle />
      <NetworkStatus />

      {/* Desktop only */}
      {!isMobileLite && <ContextMenu />}
      {!isMobileLite && <BatteryOptimizer isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}

      {/* Mobile only */}
      <MobilePremiumFeatures />

      {/* 🔍 Hidden Performance Debug (Dev mode only - Shift+P) */}
      <PerformanceDebug status={perfStatus} />

      {/* ══════════════════════════════════════════════════════
           Routes — প্রতিটা page আলাদা route
         ══════════════════════════════════════════════════════ */}
      <Routes>

        {/* ── Home Page ── */}
        <Route
          path="/"
          element={
            <>
              {/* Preloader — শুধু home page এ */}
              {isLoading && (
                <Preloader
                  onFinish={() => {
                    setIsLoading(false);
                    setShowBanner(true);
                  }}
                />
              )}

              {/* ══ Welcome Banner (Image Modal) ══ */}
              {showBanner && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.35)',
                    backdropFilter: 'blur(10px) brightness(0.7)',
                    WebkitBackdropFilter: 'blur(10px) brightness(0.7)',
                    animation: 'bannerFadeIn 0.4s ease both',
                    padding: '16px',
                  }}
                >
                  {/* Image Container */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: '1280px',
                      aspectRatio: '16/9',
                      animation: 'bannerScaleIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  >
                    {/* Banner Image */}
                    <img
                      src="/banner.jpg"
                      alt="Welcome Banner"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />

                    {/* X Close Button — top-right corner */}
                    <button
                      onClick={() => setShowBanner(false)}
                      aria-label="Close banner"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(255,255,255,0.5)',
                        background: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        fontSize: '18px',
                        lineHeight: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s, transform 0.2s, border-color 0.2s',
                        backdropFilter: 'blur(8px)',
                        zIndex: 10,
                      }}
                      onMouseEnter={e => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        btn.style.background = 'rgba(220,38,38,0.85)';
                        btn.style.borderColor = 'rgba(255,255,255,0.8)';
                        btn.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={e => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        btn.style.background = 'rgba(0,0,0,0.55)';
                        btn.style.borderColor = 'rgba(255,255,255,0.5)';
                        btn.style.transform = 'scale(1)';
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div
                className={`transition-opacity duration-700 ease-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                style={{ position: 'relative', zIndex: 10 }}
              >
                {/* ===== NAVBAR — Lite vs Full ===== */}
                {/* ✅ onOpenTools / onOpenGallery props সরানো হয়েছে */}
                {isMobileLite ? (
                  <LiteNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                ) : (
                  <AppNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                )}

                {/* ===== HERO — Lite vs Full ===== */}
                {isMobileLite ? <LiteHero /> : <Hero />}

                <TechMarquee />

                {/* ===== ABOUT — Lite vs Full ===== */}
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

                <Footer />

                {/* ===== Global Widgets ===== */}
                <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                <MusicPlayer
                  isPlaying={isMusicPlaying}
                  togglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
                />
                <FloatingDock
                  toggleChat={() => setIsChatOpen(!isChatOpen)}
                  toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
                  toggleTheme={toggleTheme}
                />

                {/* ❌ PhotoGallery modal সরানো হয়েছে → /gallery route */}
                {/* ❌ Tools overlay div সরানো হয়েছে → /tools route */}
              </div>
            </>
          }
        />

        {/* ── Profile Page (আগে থেকে ছিল) ── */}
        <Route path="/profile" element={<UserProfile />} />

        {/* ── নতুন Dedicated Pages ── */}
        <Route path="/tools"   element={<ToolsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/vault"   element={<VaultPage />} />

      </Routes>
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