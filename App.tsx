import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 🚀 Performance hooks (lightweight — eagerly load করা ঠিক আছে)
import { usePerformanceOptimizer } from './hooks/usePerformanceOptimizer';
import { registerServiceWorker } from './lib/registerSW';
registerServiceWorker();

// 🛡️ Error Boundary (prevents component crashes from breaking entire app)
import ErrorBoundary from './components/ui/ErrorBoundary';

// 📱 Mobile detection (lightweight)
import useMobileDetect from './hooks/useMobileDetect';

// ============================================================
// ✅ EAGER LOADS — এগুলো above-fold বা structurally critical
// ============================================================
import AppNavbar    from './components/layout/AppNavbar';
import LiteNavbar   from './components/layout/LiteNavbar';
import Hero         from './components/sections/Hero';
import LiteHero     from './components/sections/LiteHero';
import TechMarquee  from './components/sections/TechMarquee';
import Preloader    from './components/layout/Preloader';
import RevealOnScroll from './components/ui/RevealOnScroll';
import DynamicTitle from './components/layout/DynamicTitle';
import NetworkStatus from './components/layout/NetworkStatus';
import FloatingDock from './components/layout/FloatingDock';
import { AuthProvider } from './context/AuthContext';
import BoltoAssistant from './pages/BoltoAssistant';

// ============================================================
// 🦥 LAZY LOADS — below-fold sections (scroll করলে তখন load হবে)
// ============================================================

// Main page sections
const About          = lazy(() => import('./components/sections/About'));
const LiteAbout      = lazy(() => import('./components/sections/LiteAbout'));
const Projects       = lazy(() => import('./components/sections/Projects'));
const Resources      = lazy(() => import('./components/sections/Resources'));
const FacebookFeed   = lazy(() => import('./components/sections/FacebookFeed'));
const Journey        = lazy(() => import('./components/sections/Journey'));
const FeedbackList   = lazy(() => import('./components/sections/FeedbackList'));
const FeedbackSlider = lazy(() => import('./components/sections/FeedbackSlider'));
const Contact        = lazy(() => import('./components/sections/Contact'));
const Footer         = lazy(() => import('./components/layout/Footer'));

// Optional / on-demand widgets
const Chatbot              = lazy(() => import('./components/tools/Chatbot'));
const MusicPlayer          = lazy(() => import('./components/tools/MusicPlayer'));
const ContextMenu          = lazy(() => import('./components/modals/ContextMenu'));
const SecretVault          = lazy(() => import('./components/modals/SecretVault'));
const BatteryOptimizer     = lazy(() => import('./components/tools/BatteryOptimizer'));
const PerformanceDebug     = lazy(() => import('./components/ui/PerformanceDebug'));
const MobilePremiumFeatures = lazy(() => import('./components/modals/MobilePremiumFeatures'));

// Heavy desktop-only effects
const SunlightSpotlight = lazy(() =>
  import('./components/ui/sunlight-spotlight').then(m => ({ default: m.SunlightSpotlight }))
);
const DynamicIsland    = lazy(() => import('./components/layout/DynamicIsland'));
const WelcomeGreeting  = lazy(() => import('./components/sections/WelcomeGreeting'));

// ── Pages (separate routes — always lazy) ────────────────────
const UserProfile = lazy(() => import('./pages/UserProfile'));
const ToolsPage   = lazy(() => import('./pages/ToolsPage'));
const AdminPage   = lazy(() => import('./pages/AdminPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const VaultPage   = lazy(() => import('./pages/VaultPage'));
const RedirectPage = lazy(() => import('./pages/RedirectPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const SupportPage = lazy(() => import('./pages/SupportPage')); // [cite: 14, 15]
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions')); // [cite: 14, 16]

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

  // ✅ Theme management (separate concern)
  useEffect(() => {
    const html = document.documentElement;
    isDarkMode ? html.classList.add('dark') : html.classList.remove('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // ✅ FIXED: Click listener with proper cleanup (outside conditional)
  useEffect(() => {
    if (isMobileLite) return;
    
    const handleClick = () => navigator.vibrate?.(5);
    document.addEventListener('click', handleClick);
    
    // ✅ Cleanup runs ALWAYS when dependency changes or component unmounts
    return () => document.removeEventListener('click', handleClick);
  }, [isMobileLite]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleNewFeedback = (data: { name: string; rating: number; label: string }) => {
    console.log('New Feedback Submitted:', data);
  };

  // ✅ FIXED: Keydown listener with proper cleanup and all dependencies
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
    
    // ✅ Proper cleanup: always removes listener
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileLite, toggleTheme]);

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
          <WelcomeGreeting ready={!isLoading} />
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
                <ErrorBoundary level="section">
                  {isMobileLite ? (
                    <LiteNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                  ) : (
                    <AppNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                  )}
                </ErrorBoundary>

                {/* HERO — above fold, eagerly loaded */}
                <ErrorBoundary level="section">
                  {isMobileLite ? <LiteHero /> : <Hero />}
                </ErrorBoundary>

                <ErrorBoundary level="section">
                  <TechMarquee />
                </ErrorBoundary>

                {/* ── Below-fold sections — সব Suspense-এ wrap করা ── */}

                <Reveal delay={0.1}>
                  <section id="about">
                    <ErrorBoundary level="section">
                      <Suspense fallback={<SectionFallback />}>
                        {isMobileLite ? <LiteAbout /> : <About />}
                      </Suspense>
                    </ErrorBoundary>
                  </section>
                </Reveal>

                <Reveal delay={0.1}>
                  <section id="projects">
                    <ErrorBoundary level="section">
                      <Suspense fallback={<SectionFallback />}>
                        <Projects />
                      </Suspense>
                    </ErrorBoundary>
                  </section>
                </Reveal>

                <Reveal>
                  <section id="resources">
                    <ErrorBoundary level="section">
                      <Suspense fallback={<SectionFallback />}>
                        <Resources />
                      </Suspense>
                    </ErrorBoundary>
                  </section>
                </Reveal>

                <Reveal>
                  <ErrorBoundary level="section">
                    <Suspense fallback={<SectionFallback />}>
                      <FacebookFeed />
                    </Suspense>
                  </ErrorBoundary>
                </Reveal>

                <Reveal>
                  <section id="journey">
                    <ErrorBoundary level="section">
                      <Suspense fallback={<SectionFallback />}>
                        <Journey />
                      </Suspense>
                    </ErrorBoundary>
                  </section>
                </Reveal>

                <div id="feedback">
                  <ErrorBoundary level="section">
                    <Suspense fallback={<SectionFallback />}>
                      <FeedbackList />
                    </Suspense>
                  </ErrorBoundary>
                </div>

                <Reveal>
                  <section id="contact">
                    <ErrorBoundary level="section">
                      <Suspense fallback={<SectionFallback />}>
                        <Contact />
                      </Suspense>
                    </ErrorBoundary>
                  </section>
                </Reveal>

                <ErrorBoundary level="widget">
                  <Suspense fallback={<NullFallback />}>
                    <FeedbackSlider onSubmit={handleNewFeedback} />
                  </Suspense>
                </ErrorBoundary>

                <ErrorBoundary level="widget">
                  <Suspense fallback={<NullFallback />}>
                    <Footer />
                  </Suspense>
                </ErrorBoundary>

                {/* Global Widgets — lazy loaded, only mount when needed */}
                <ErrorBoundary level="widget">
                  <Suspense fallback={<NullFallback />}>
                    <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                  </Suspense>
                </ErrorBoundary>

                <ErrorBoundary level="widget">
                  <Suspense fallback={<NullFallback />}>
                    <MusicPlayer
                      isPlaying={isMusicPlaying}
                      togglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
                    />
                  </Suspense>
                </ErrorBoundary>

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
        <Route path="/admin" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><AdminPage /></Suspense>
          </ErrorBoundary>
        } />
        <Route path="/profile" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><UserProfile /></Suspense>
          </ErrorBoundary>
        } />
        <Route path="/tools" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><ToolsPage /></Suspense>
          </ErrorBoundary>
        } />
        <Route path="/gallery" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><GalleryPage /></Suspense>
          </ErrorBoundary>
        } />
        <Route path="/assistant" element={
          <ErrorBoundary level="page">
            <BoltoAssistant />
          </ErrorBoundary>
        } />
        <Route path="/vault" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><VaultPage /></Suspense>
          </ErrorBoundary>
        } />
        <Route path="/link" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><RedirectPage /></Suspense>
          </ErrorBoundary>
        } />
        <Route path="/privacy" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><PrivacyPage /></Suspense>
          </ErrorBoundary>
        } />
        {/* Support Page Route */}
        <Route path="/support" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><SupportPage /></Suspense>
          </ErrorBoundary>
        } /> // 

        {/* Terms and Conditions Route */}
        <Route path="/terms" element={
          <ErrorBoundary level="page">
            <Suspense fallback={<PageFallback />}><TermsAndConditions /></Suspense>
          </ErrorBoundary>
        } /> //

      </Routes>
    </main>
  );
};

// ============================================================
// Root App
// ============================================================
const App: React.FC = () => (
  <ErrorBoundary level="app" onError={(error, errorInfo) => {
    // Send to error tracking service (Sentry, LogRocket, etc.) if needed
    if (process.env.NODE_ENV === 'production') {
      console.error('🔴 App Error:', error.message);
      // Example: Sentry.captureException(error);
    }
  }}>
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  </ErrorBoundary>
);

export default App;