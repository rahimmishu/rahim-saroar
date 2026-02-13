// 📱 LiteNavbar.tsx – Mobile Lite Version
// backdrop-blur সরানো হয়েছে (GPU killer on mobile)
// Profile navigation button added for mobile menu
// User avatar image display fixed

import React, { useState, useEffect } from 'react';
import {
  Menu, X, Camera, Wrench, Sparkles, Home, Briefcase,
  BookOpen, User, Mail, Lock, LogOut, LogIn, ArrowRight,
  UserCircle, Settings,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenTools: () => void;
  onOpenGallery: () => void;
}

const LiteNavbar: React.FC<NavbarProps> = ({
  isDarkMode, toggleTheme, onOpenTools, onOpenGallery,
}) => {
  const [isOpen, setIsOpen]         = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const { user, logout }            = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const navigate                    = useNavigate();

  const navLinks = [
    { label: 'Home',      href: '#home',      icon: <Home size={18} /> },
    { label: 'Projects',  href: '#projects',  icon: <Briefcase size={18} /> },
    { label: 'Resources', href: '#resources', isSpecial: true, icon: <BookOpen size={18} /> },
    { label: 'About',     href: '#about',     icon: <User size={18} /> },
    { label: 'Contact',   href: '#contact',   icon: <Mail size={18} /> },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const triggerSecretVault = () => {
    setIsOpen(false);
    setTimeout(() => window.dispatchEvent(new Event('open-secret-search')), 200);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(href.replace('#', ''));
    if (el) {
      setTimeout(() => {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: 'smooth',
        });
      }, 300);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // ✅ FIX: Navigate to profile page
  const handleGoToProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  // 🎨 Lite Navbar bg – solid semi-transparent, no backdrop-blur
  const navBg = scrolled
    ? isDarkMode
      ? 'bg-[#0a0a0a]/97 border-white/8'
      : 'bg-white/97 border-slate-200/60'
    : isDarkMode
    ? 'bg-[#0d0d0d]/90 border-white/5'
    : 'bg-white/90 border-slate-200/40';

  // ✅ FIX: Get user avatar for display
  const userAvatar   = user?.photoURL || null;
  const userInitial  = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email?.charAt(0)?.toUpperCase() || 'U';

  /* ─── Avatar mini component (navbar + mobile menu) ─── */
  const UserAvatarBubble = ({ size = 36, textSize = 'text-sm' }: { size?: number; textSize?: string }) => (
    <div
      className="flex-shrink-0 overflow-hidden bg-white rounded-full"
      style={{
        width: size, height: size,
        border: '2px solid rgba(99,102,241,.5)',
        boxShadow: '0 0 12px rgba(99,102,241,.25)',
      }}
    >
      {userAvatar ? (
        <img
          src={userAvatar}
          alt={user?.displayName || 'User'}
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback to initials if image fails
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center ${textSize} font-black text-white`}
          style={{ background: 'linear-gradient(135deg, #6d28d9, #2563eb)' }}
        >
          {userInitial}
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-[50] transition-all duration-500 ease-in-out
          ${scrolled ? 'top-3 w-[96%] md:w-[86%]' : 'top-5 w-[98%] md:w-[90%]'}`}
      >
        {/* Border wrapper – static gradient (no animation) */}
        <div
          className="rounded-[28px] p-[1px] shadow-xl"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.4), rgba(139,92,246,.3), rgba(236,72,153,.3))' }}
        >
          {/* Main container – solid bg instead of backdrop-blur */}
          <div className={`rounded-[27px] border transition-all duration-500 ${navBg}`}>
            <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-2.5 px-4 md:px-6' : 'py-3 px-4 md:px-6'}`}>

              {/* Logo */}
              <a
                href="#home"
                onClick={(e) => handleLinkClick(e, '#home')}
                className="flex items-center gap-2 shrink-0 group"
              >
                <div
                  className="flex items-center justify-center shadow-md w-9 h-9 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #6d28d9, #2563eb)' }}
                >
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="flex-col hidden leading-none sm:flex">
                  <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">Rahim</span>
                  <span className="text-[9px] font-semibold text-purple-500 uppercase tracking-widest">Portfolio</span>
                </div>
              </a>

              {/* Desktop Nav Links */}
              <div className="items-center hidden gap-1 lg:flex">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95
                      ${link.isSpecial
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                {/* Desktop: Auth / Profile / Logout */}
                {user ? (
                  <div className="items-center hidden gap-2 lg:flex">
                    {/* ✅ Profile button (desktop) */}
                    <button
                      onClick={handleGoToProfile}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-300 rounded-xl hover:bg-white/8 transition-all duration-200 active:scale-95"
                    >
                      <UserAvatarBubble size={28} textSize="text-xs" />
                      <span className="max-w-[90px] truncate">
                        {user.displayName || 'Profile'}
                      </span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-500 transition-all duration-200 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="items-center hidden gap-2 px-4 py-2 text-sm font-bold text-white transition-all duration-200 lg:flex rounded-xl active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #6d28d9, #2563eb)' }}
                  >
                    <LogIn size={15} />
                    <span>Sign In</span>
                  </button>
                )}

                {/* Mobile: avatar bubble (when logged in) or menu button */}
                <div className="flex items-center gap-2 lg:hidden">
                  {/* ✅ FIX: Show profile avatar on mobile navbar */}
                  {user && (
                    <button
                      onClick={handleGoToProfile}
                      className="flex items-center transition-transform active:scale-90"
                      aria-label="Go to Profile"
                    >
                      <UserAvatarBubble size={32} textSize="text-xs" />
                    </button>
                  )}

                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200 active:scale-90"
                    aria-label="Toggle menu"
                  >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* ═══════ MOBILE MENU ═══════ */}
      <div
        className={`fixed inset-0 z-[49] transition-all duration-300 lg:hidden
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsOpen(false)}
        />

        {/* Slide-in Panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 rounded-t-[32px] p-6 pb-10 transition-transform duration-300 ease-out
            ${isDarkMode ? 'bg-[#0d0d0d] border-t border-white/10' : 'bg-white border-t border-slate-200/60'}
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          {/* Handle */}
          <div className="flex justify-center mb-5">
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* ── User info / auth ───────────────────────── */}
          <div className="mb-5">
            {user ? (
              <div className="overflow-hidden border rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/8">
                {/* User info row */}
                <div className="flex items-center gap-3 p-4">
                  {/* ✅ FIX: Show avatar image instead of just initials */}
                  <UserAvatarBubble size={44} textSize="text-base" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-slate-900 dark:text-white">
                      {user.displayName || 'User'}
                    </div>
                    <div className="text-xs truncate text-slate-500">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex-shrink-0 p-2 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl active:scale-90"
                    aria-label="Logout"
                  >
                    <LogOut size={17} />
                  </button>
                </div>

                {/* ✅ NEW: Profile & Settings buttons row */}
                <div className="grid grid-cols-2 gap-0 border-t border-slate-100 dark:border-white/8">
                  <button
                    onClick={handleGoToProfile}
                    className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-blue-600 transition-all border-r dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 active:scale-95 border-slate-100 dark:border-white/8"
                  >
                    <Settings size={15} />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={handleGoToProfile}
                    className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-purple-600 transition-all dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 active:scale-95"
                  >
                    <UserCircle size={15} />
                    <span>Dashboard</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setIsOpen(false); setAuthModalOpen(true); }}
                className="flex items-center justify-center w-full gap-2 py-4 font-bold text-white transition-all rounded-2xl active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6d28d9, #2563eb)' }}
              >
                <LogIn size={18} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

          {/* ── Nav Links ─────────────────────────────── */}
          <div className="flex flex-col gap-2 mb-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`flex items-center gap-4 p-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95
                  ${link.isSpecial
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40'
                    : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-white/8 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
              >
                <span className={`p-2 rounded-xl ${link.isSpecial ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-white dark:bg-slate-800'} shadow-sm`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
                <ArrowRight size={16} className="ml-auto opacity-30" />
              </a>
            ))}
          </div>

          {/* ── Action Buttons Grid ────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { onOpenGallery(); setIsOpen(false); }}
              className="flex flex-col items-center gap-2 p-4 text-purple-600 transition-all border rounded-2xl bg-purple-50 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/40 dark:text-purple-400 active:scale-95"
            >
              <Camera size={22} />
              <span className="text-sm font-semibold">Gallery</span>
            </button>

            <button
              onClick={() => { onOpenTools(); setIsOpen(false); }}
              className="flex flex-col items-center gap-2 p-4 text-blue-600 transition-all border rounded-2xl bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/40 dark:text-blue-400 active:scale-95"
            >
              <Wrench size={22} />
              <span className="text-sm font-semibold">Tools</span>
            </button>

            <button
              onClick={triggerSecretVault}
              className="flex items-center col-span-2 gap-3 p-4 text-white transition-all border rounded-2xl bg-slate-900 dark:bg-black border-slate-700/50 active:scale-95"
            >
              <Lock size={18} className="text-pink-400" />
              <span className="font-semibold">Secret Vault</span>
              <div className="w-2 h-2 ml-auto bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      )}
    </>
  );
};

export default LiteNavbar;