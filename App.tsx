import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 🚀 Performance hooks (lightweight — eagerly load করা ঠিক আছে)
import { usePerformanceOptimizer } from './hooks/usePerformanceOptimizer';
import { registerServiceWorker } from './lib/registerSW';
registerServiceWorker();

// 📱 Mobile detection (lightweight)
import useMobileDetect from './hooks/useMobileDetect';

// ============================================================
// ✅ EAGER LOADS — এগুলো above-fold বা structurally critical
// ============================================================
import AppNavbar    from './components/AppNavbar';
import LiteNavbar   from './components/LiteNavbar';
import Hero         from './components/Hero';
import LiteHero     from './components/LiteHero';
import TechMarquee  from './components/TechMarquee';
import Preloader    from './components/Preloader';
import RevealOnScroll from './components/RevealOnScroll';
import DynamicTitle from './components/DynamicTitle';
import NetworkStatus from './components/NetworkStatus';
import FloatingDock from './components/FloatingDock';
import { AuthProvider } from './context/AuthContext';

// ============================================================
// 🦥 LAZY LOADS — below-fold sections (scroll করলে তখন load হবে)
// ============================================================

// Main page sections
const About          = lazy(() => import('./components/About'));
const LiteAbout      = lazy(() => import('./components/LiteAbout'));
const Projects       = lazy(() => import('./components/Projects'));
const Resources      = lazy(() => import('./components/Resources'));
const FacebookFeed   = lazy(() => import('./components/FacebookFeed'));
const Journey        = lazy(() => import('./components/Journey'));
const FeedbackList   = lazy(() => import('./components/FeedbackList'));
const FeedbackSlider = lazy(() => import('./components/FeedbackSlider'));
const Contact        = lazy(() => import('./components/Contact'));
const Footer         = lazy(() => import('./components/Footer'));

// Optional / on-demand widgets
const Chatbot              = lazy(() => import('./components/Chatbot'));
const MusicPlayer          = lazy(() => import('./components/MusicPlayer'));
const ContextMenu          = lazy(() => import('./components/ContextMenu'));
const SecretVault          = lazy(() => import('./components/SecretVault'));
const BatteryOptimizer     = lazy(() => import('./components/BatteryOptimizer'));
const PerformanceDebug     = lazy(() => import('./components/PerformanceDebug'));
const MobilePremiumFeatures = lazy(() => import('./components/MobilePremiumFeatures'));

// Heavy desktop-only effects
const SunlightSpotlight = lazy(() =>
  import('./components/ui/sunlight-spotlight').then(m => ({ default: m.SunlightSpotlight }))
);
const DynamicIsland = lazy(() => import('./components/DynamicIsland'));

// ── Pages (separate routes — always lazy) ────────────────────
const UserProfile = lazy(() => import('./pages/UserProfile'));
const ToolsPage   = lazy(() => import('./pages/ToolsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const VaultPage   = lazy(() => import('./pages/VaultPage'));

// ============================================================
// Suspense fallbacks
// ============================================================

// Section loader — below-fold sections-এর জন্য
const SectionFallback = () => (
  <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '3px solid rgba(139,92,246,0.2)',
        borderTopColor: '#8b5cf6',
        animation: 'spin 0.7s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Page loader — full route change-এর জন্য
const PageFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      border: '4px solid rgba(139,92,246,0.2)',
      borderTopColor: '#8b5cf6',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Invisible fallback — widget গুলোর জন্য (UI-তে কিছু দেখাবে না)
const NullFallback = () => null;

// ============================================================
// Scroll to top on route change
// ============================================================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ============================================================
// 📱 Lite Mobile RevealOnScroll
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
  const perfStatus = usePerformanceOptimizer();
  
  const [isLoading, setIsLoading]       = useState(true);
  const [showBanner, setShowBanner]     = useState(false);
  const [isChatOpen, setIsChatOpen]     = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const isMobileLite = useMobileDetect();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      if (tg.colorScheme === 'dark') { setIsDarkMode(true); }
    }
  }, []);

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

      {/* Heavy effects — desktop only, lazy loaded */}
      {!isMobileLite && (
        <Suspense fallback={<NullFallback />}>
          <SunlightSpotlight className="z-[50]" />
          <DynamicIsland />
        </Suspense>
      )}

      <ScrollToTop />

      {/* Lightweight utilities */}
      <Suspense fallback={<NullFallback />}>
        <SecretVault />
      </Suspense>
      <DynamicTitle />
      <NetworkStatus />

      {/* Desktop only */}
      {!isMobileLite && (
        <Suspense fallback={<NullFallback />}>
          <ContextMenu />
          <BatteryOptimizer isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </Suspense>
      )}

      {/* Mobile only */}
      <Suspense fallback={<NullFallback />}>
        <MobilePremiumFeatures />
      </Suspense>

      <Suspense fallback={<NullFallback />}>
        <PerformanceDebug status={perfStatus} />
      </Suspense>

      {/* ══════════════════════════════════════════════════════
           Routes
         ══════════════════════════════════════════════════════ */}
      <Routes>

        {/* ── Home Page ── */}
        <Route
          path="/"
          element={
            <>
              {isLoading && (
                <Preloader
                  onFinish={() => {
                    setIsLoading(false);
                    setShowBanner(true);
                  }}
                />
              )}

              {/* Welcome Banner */}
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
                    {/* ✅ banner.jpg — loading="lazy" কারণ এটা modal, সাথে সাথে দেখা যাচ্ছে না */}
                    <img
                      src="/banner.jpg"
                      alt="Welcome Banner"
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />

                    <button
                      onClick={() => setShowBanner(false)}
                      aria-label="Close banner"
                      style={{
                        position: 'absolute', top: '12px', right: '12px',
                        width: '36px', height: '36px', borderRadius: '50%',
                        border: '1.5px solid rgba(255,255,255,0.5)',
                        background: 'rgba(0,0,0,0.55)', color: '#fff',
                        fontSize: '18px', lineHeight: 1, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s, transform 0.2s, border-color 0.2s',
                        backdropFilter: 'blur(8px)', zIndex: 10,
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
                {/* NAVBAR — above fold, eagerly loaded */}
                {isMobileLite ? (
                  <LiteNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                ) : (
                  <AppNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                )}

                {/* HERO — above fold, eagerly loaded */}
                {isMobileLite ? <LiteHero /> : <Hero />}

                <TechMarquee />

                {/* ── Below-fold sections — সব Suspense-এ wrap করা ── */}

                <Reveal delay={0.1}>
                  <section id="about">
                    <Suspense fallback={<SectionFallback />}>
                      {isMobileLite ? <LiteAbout /> : <About />}
                    </Suspense>
                  </section>
                </Reveal>

                <Reveal delay={0.1}>
                  <section id="projects">
                    <Suspense fallback={<SectionFallback />}>
                      <Projects />
                    </Suspense>
                  </section>
                </Reveal>

                <Reveal>
                  <section id="resources">
                    <Suspense fallback={<SectionFallback />}>
                      <Resources />
                    </Suspense>
                  </section>
                </Reveal>

                <Reveal>
                  <Suspense fallback={<SectionFallback />}>
                    <FacebookFeed />
                  </Suspense>
                </Reveal>

                <Reveal>
                  <section id="journey">
                    <Suspense fallback={<SectionFallback />}>
                      <Journey />
                    </Suspense>
                  </section>
                </Reveal>

                <div id="feedback">
                  <Suspense fallback={<SectionFallback />}>
                    <FeedbackList />
                  </Suspense>
                </div>

                <Reveal>
                  <section id="contact">
                    <Suspense fallback={<SectionFallback />}>
                      <Contact />
                    </Suspense>
                  </section>
                </Reveal>

                <Suspense fallback={<NullFallback />}>
                  <FeedbackSlider onSubmit={handleNewFeedback} />
                </Suspense>

                <Suspense fallback={<NullFallback />}>
                  <Footer />
                </Suspense>

                {/* Global Widgets — lazy loaded, only mount when needed */}
                <Suspense fallback={<NullFallback />}>
                  <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                </Suspense>

                <Suspense fallback={<NullFallback />}>
                  <MusicPlayer
                    isPlaying={isMusicPlaying}
                    togglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
                  />
                </Suspense>

                <FloatingDock
                  toggleChat={() => setIsChatOpen(!isChatOpen)}
                  toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
                  toggleTheme={toggleTheme}
                />
              </div>
            </>
          }
        />

        {/* ── Other Pages — সব lazy loaded ── */}
        <Route path="/profile" element={
          <Suspense fallback={<PageFallback />}><UserProfile /></Suspense>
        } />
        <Route path="/tools" element={
          <Suspense fallback={<PageFallback />}><ToolsPage /></Suspense>
        } />
        <Route path="/gallery" element={
          <Suspense fallback={<PageFallback />}><GalleryPage /></Suspense>
        } />
        <Route path="/vault" element={
          <Suspense fallback={<PageFallback />}><VaultPage /></Suspense>
        } />

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