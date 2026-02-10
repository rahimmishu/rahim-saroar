import React, { useState, useEffect } from 'react';
import { Menu, X, Camera, Wrench, Sparkles, Home, Briefcase, BookOpen, User, Mail, Lock, LogOut, LogIn, ChevronDown, ArrowRight, UserCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext'; 
import AuthModal from './AuthModal'; 
import { RainbowButton } from './ui/rainbow-button'; 
import { GitHubStarButton } from './ui/github-star'; 
// ✅ নতুন ইমপোর্ট
import { PremiumSignInButton } from './ui/premium-signin-button';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenTools: () => void;
  onOpenGallery: () => void;
}

const AppNavbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, onOpenTools, onOpenGallery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', href: '#home', icon: <Home size={18} /> },
    { label: 'Projects', href: '#projects', icon: <Briefcase size={18} /> },
    { label: 'Resources', href: '#resources', isSpecial: true, icon: <BookOpen size={18} /> }, 
    { label: 'About', href: '#about', icon: <User size={18} /> },
    { label: 'Contact', href: '#contact', icon: <Mail size={18} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const triggerSecretVault = () => {
    setIsOpen(false);
    setTimeout(() => {
        window.dispatchEvent(new Event('open-secret-search'));
    }, 200);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
            const targetId = href.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
        return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      setTimeout(() => {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }, 300);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const goToProfile = () => {
    navigate('/profile');
    setIsProfileMenuOpen(false);
    setIsOpen(false);
  };

  // 🔥 টুলস পেজে যাওয়ার ফাংশন
  const goToTools = () => {
    navigate('/tools');
    setIsOpen(false);
  };

  return (
    <>
      {/* ✨ PREMIUM NAVBAR WITH ENHANCED GLASS MORPHISM */}
      <nav 
        className={`fixed left-1/2 -translate-x-1/2 z-[50] transition-all duration-700 ease-in-out
        ${scrolled
          ? 'top-3 w-[96%] md:w-[86%] lg:w-[76%]' 
          : 'top-6 w-[98%] md:w-[90%] lg:w-[85%]'
          }`}
      >
        {/* 🌟 Gradient Border Wrapper */}
        <div className={`relative rounded-[32px] p-[1.5px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-pink-400/20 shadow-2xl transition-all duration-700
          ${scrolled ? 'shadow-purple-500/10 dark:shadow-purple-400/5' : 'shadow-blue-500/5'}`}
        >
          {/* 💎 Glass Morphism Container */}
          <div className={`relative rounded-[30px] overflow-hidden backdrop-blur-2xl transition-all duration-700
            ${scrolled 
              ? 'bg-white/85 dark:bg-black/85 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] dark:shadow-[0_8px_32px_0_rgba(139,92,246,0.08)]' 
              : 'bg-white/60 dark:bg-black/50 shadow-[0_4px_24px_0_rgba(99,102,241,0.08)]'
            }`}
          >
            {/* 🎨 Animated Gradient Overlay */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-x"></div>
            
            {/* 🔷 Main Content */}
            <div className={`relative flex items-center justify-between transition-all duration-500
              ${scrolled ? 'py-2.5 px-5 md:px-7' : 'py-3.5 px-5 md:px-7'}`}
            >
              {/* ✨ PREMIUM LOGO */}
              <a 
                href="#home" 
                onClick={(e) => handleLinkClick(e, '#home')} 
                className="relative flex items-center gap-2.5 group shrink-0 z-10"
              >
                {/* 🌀 Rotating Glow Effect */}
                <div className="absolute transition-opacity duration-500 rounded-full opacity-0 -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl group-hover:opacity-100 animate-pulse"></div>
                
                <div className="relative p-1.5 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                  <Sparkles className="text-purple-500 transition-all duration-700 dark:text-purple-400 group-hover:rotate-180 group-hover:scale-110" size={22} />
                </div>
                
                <span className="relative pb-1 text-sm font-bold md:text-xl font-signature whitespace-nowrap">
                  <span className="relative z-10 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text animate-gradient-x bg-[length:200%_auto]">
                    Rahim Saroar <span className="hidden sm:inline">Mishu</span>
                  </span>
                  {/* ✨ Subtle glow under text */}
                  <span className="absolute inset-0 text-transparent opacity-50 blur-sm bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text"></span>
                </span>
              </a>

              {/* 💎 PREMIUM DESKTOP MENU */}
              <div className="items-center hidden gap-2 lg:flex">
                {/* 📸 Gallery Button - Premium Style */}
                <button 
                  onClick={onOpenGallery} 
                  className="group relative p-2.5 text-purple-600 dark:text-purple-400 transition-all duration-300 rounded-2xl hover:bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 active:scale-95 hover:shadow-lg hover:shadow-purple-500/20" 
                  title="Photos"
                >
                  <Camera size={18} className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                  {/* Hover glow */}
                  <div className="absolute inset-0 transition-all duration-300 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10"></div>
                </button>

                {/* ✨ Elegant Divider */}
                <div className="w-px h-5 mx-2 bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-700"></div>

                {/* 🔗 Navigation Links */}
                {navLinks.map((link) => {
                  if (link.label === 'Resources') {
                    return (
                      <a 
                        key={link.label} 
                        href={link.href} 
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="mx-1"
                      >
                        <div className="relative flex items-center justify-center p-0 group">
                          {/* ✨ Rainbow glow on hover */}
                          <div className="absolute inset-0 transition-opacity duration-500 rounded-full opacity-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 group-hover:opacity-20 blur-xl"></div>
                          <RainbowButton className="relative px-5 text-xs font-bold transition-all duration-300 shadow-lg h-9 group hover:shadow-xl hover:shadow-purple-500/30">
                            {link.label}
                            <ArrowRight className="w-4 h-4 ml-2 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                          </RainbowButton>
                        </div>
                      </a>
                    );
                  }

                  return (
                    <a 
                      key={link.label} 
                      href={link.href} 
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 group text-slate-600 dark:text-slate-300 rounded-2xl whitespace-nowrap hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 active:scale-95 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      <span className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">{link.icon}</span>
                      {link.label}
                      {/* ✨ Underline effect */}
                      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-3/4 group-hover:left-[12.5%] transition-all duration-300"></span>
                    </a>
                  );
                })}

                {/* ✨ Premium Divider */}
                <div className="w-px h-5 mx-2 bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-700"></div>

                {/* 🔥 Tools Button - Premium Style (FIXED) */}
                <button 
                  onClick={goToTools} 
                  className="group relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 rounded-2xl hover:bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 active:scale-95 hover:shadow-lg hover:shadow-purple-500/20" 
                  title="Tools"
                >
                  <Wrench size={18} className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  {/* Hover glow */}
                  <div className="absolute inset-0 transition-all duration-300 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10"></div>
                </button>

                {/* 🎨 Theme Toggle */}
                <div className="relative ml-1 group">
                  {/* Glow effect */}
                  <div className="absolute transition-all duration-500 -inset-1 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 rounded-2xl blur-lg"></div>
                  <div className="relative">
                    <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                  </div>
                </div>
                
                {/* 👤 USER PROFILE / AUTH - PREMIUM STYLE */}
                {user ? (
                  <div className="relative hidden ml-2 sm:block">
                    <button 
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="group relative flex items-center gap-2.5 px-4 py-2 bg-gradient-to-br from-slate-100/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 backdrop-blur-sm active:scale-95"
                    >
                      {/* ✨ Avatar with gradient ring */}
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-opacity"></div>
                        <div className="relative flex items-center justify-center text-xs font-bold text-white rounded-full shadow-lg w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                        </div>
                      </div>
                      
                      <span className="max-w-[90px] truncate text-xs font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                        {user.displayName?.split(' ')[0] || "User"}
                      </span>
                      
                      <ChevronDown 
                        size={14} 
                        className={`text-slate-400 transition-all duration-300 ${isProfileMenuOpen ? 'rotate-180 text-purple-500' : ''}`} 
                      />
                    </button>

                    {/* 💎 Premium Dropdown Menu */}
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-3 overflow-hidden duration-300 border shadow-2xl w-60 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-purple-500/20 dark:shadow-purple-400/10 rounded-3xl animate-in fade-in slide-in-from-top-3">
                        {/* 🎨 Gradient header */}
                        <div className="relative px-5 py-4 border-b border-slate-100/50 dark:border-slate-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
                          <p className="text-sm font-bold truncate text-slate-800 dark:text-white">{user.displayName || "User"}</p>
                          <p className="text-xs truncate text-slate-500 dark:text-slate-400">{user.email}</p>
                          {/* ✨ Decorative element */}
                          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-2xl"></div>
                        </div>
                        
                        {/* 🔷 Menu Items */}
                        <div className="p-2">
                          <button 
                            onClick={goToProfile} 
                            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-left transition-all duration-300 group text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl active:scale-95"
                          >
                            <div className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                              <UserCircle size={16} />
                            </div>
                            My Profile
                          </button>

                          <button 
                            onClick={handleLogout} 
                            className="flex items-center w-full gap-3 px-4 py-3 mt-1 text-sm font-medium text-left text-red-500 transition-all duration-300 group hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl active:scale-95"
                          >
                            <div className="p-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                              <LogOut size={16} />
                            </div>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // ✅ এখানে আপনার নতুন Premium Sign In Button বসানো হয়েছে
                  <div className="ml-2">
                    <PremiumSignInButton onClick={() => setAuthModalOpen(true)} />
                  </div>
                )}

                {/* 🌟 GitHub Button - Premium */}
                <div className="relative hidden ml-2 group md:block">
                  <div className="absolute transition-all duration-500 -inset-1 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 rounded-2xl blur-lg"></div>
                  <GitHubStarButton 
                    owner="rahimmishu" 
                    repo="rahim-saroar" 
                    stars={1870} 
                    className="relative px-4 text-xs transition-all duration-300 shadow-lg h-9 hover:shadow-xl"
                  />
                </div>

                {/* 🍔 Mobile Menu Toggle - Premium */}
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="group relative p-2.5 transition-all duration-300 lg:hidden text-slate-800 dark:text-white active:scale-90 rounded-2xl hover:bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 ml-2"
                >
                  <div className="absolute inset-0 transition-all duration-300 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10"></div>
                  {isOpen ? 
                    <X size={20} className="relative z-10 transition-all duration-300 rotate-0 group-hover:rotate-90" /> : 
                    <Menu size={20} className="relative z-10 transition-all duration-300" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* 🌟 PREMIUM MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 z-[40] transition-all duration-700 lg:hidden flex flex-col px-6 overflow-y-auto no-scrollbar pb-24
        ${isOpen ? 'opacity-100 visible backdrop-blur-3xl' : 'opacity-0 invisible backdrop-blur-none'}`}
        style={{ paddingTop: '110px' }}
      >
        {/* 🎨 Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-black dark:via-purple-950/30 dark:to-pink-950/30 transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* 🌀 Floating orbs */}
        <div className={`absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute bottom-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse transition-opacity duration-1000 delay-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="relative z-10">
          {/* 👤 User Section - Premium */}
          {user ? (
            <div className="flex flex-col gap-3 mb-8 duration-500 animate-in slide-in-from-top-5">
              {/* 💎 User Info Card */}
              <div className="relative p-5 overflow-hidden border shadow-2xl bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-zinc-900/90 dark:to-black/90 backdrop-blur-xl rounded-3xl border-white/20 dark:border-zinc-800/50 shadow-purple-500/10">
                {/* ✨ Gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar with animated ring */}
                    <div className="relative">
                      <div className="absolute rounded-full -inset-1 bg-gradient-to-br from-purple-500 to-blue-500 animate-spin-slow"></div>
                      <div className="relative flex items-center justify-center text-xl font-bold text-white rounded-full shadow-xl w-14 h-14 bg-gradient-to-tr from-purple-500 to-blue-500">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </div>
                    </div>
                    
                    <div className="overflow-hidden">
                      <div className="text-lg font-bold truncate text-slate-800 dark:text-white">{user.displayName || "User"}</div>
                      <div className="text-xs truncate text-slate-500 dark:text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="relative p-3 text-red-500 transition-all duration-300 bg-white shadow-lg group dark:bg-slate-900 rounded-2xl hover:shadow-xl hover:shadow-red-500/20 active:scale-90"
                  >
                    <div className="absolute inset-0 transition-all duration-300 rounded-2xl bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/20"></div>
                    <LogOut size={20} className="relative z-10" />
                  </button>
                </div>
              </div>

              {/* 🔷 Profile Button */}
              <button 
                onClick={goToProfile} 
                className="group relative flex items-center justify-center w-full gap-3 p-4 font-bold text-white transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl active:scale-95 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x bg-[length:200%_auto]"></div>
                <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/30 group-hover:via-purple-400/30 group-hover:to-pink-400/30"></div>
                <UserCircle size={20} className="relative z-10 transition-transform group-hover:scale-110" />
                <span className="relative z-10">View My Dashboard</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setIsOpen(false); setAuthModalOpen(true); }}
              className="group relative flex items-center justify-center w-full gap-3 py-5 mb-8 font-bold text-white duration-500 shadow-2xl rounded-3xl animate-in slide-in-from-top-5 overflow-hidden hover:scale-[1.02] active:scale-95 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x bg-[length:200%_auto]"></div>
              <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/30 group-hover:via-purple-400/30 group-hover:to-pink-400/30"></div>
              <LogIn size={22} className="relative z-10" />
              <span className="relative z-10 text-lg">Sign In / Register</span>
            </button>
          )}

          {/* 🔗 Navigation Links - Premium Cards */}
          <div className="relative z-10 flex flex-col w-full max-w-md gap-3 mx-auto mb-6">
            {navLinks.map((link, idx) => (
              <a 
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)} 
                className={`group relative overflow-hidden flex items-center gap-4 text-lg font-bold p-4 rounded-3xl border transition-all duration-500 shadow-lg hover:shadow-2xl active:scale-95
                  ${link.isSpecial 
                    ? 'bg-gradient-to-br from-blue-50/90 to-purple-50/90 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:shadow-blue-500/20' 
                    : 'bg-white/90 dark:bg-zinc-900/90 border-white/20 dark:border-zinc-800/50 text-slate-700 dark:text-slate-300 hover:shadow-purple-500/10 backdrop-blur-xl'}
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
                `}
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                {/* ✨ Hover gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${link.isSpecial ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-r from-purple-500/5 to-pink-500/5'}`}></div>
                
                <span className={`relative p-3 rounded-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${link.isSpecial ? 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900' : 'bg-white dark:bg-slate-900'}`}>
                  {link.icon}
                </span>
                
                <span className="relative">{link.label}</span>
                
                {/* ✨ Arrow indicator */}
                <ArrowRight className="relative ml-auto transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1" size={18} />
              </a>
            ))}
          </div>

          {/* 🎨 Action Cards Grid - Premium */}
          <div className={`grid grid-cols-2 gap-4 w-full max-w-md mx-auto relative z-10 transition-all duration-700 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* 📸 Gallery Card */}
            <button 
              onClick={() => { onOpenGallery(); setIsOpen(false); }} 
              className="relative flex flex-col items-center justify-center p-5 overflow-hidden transition-all duration-300 border group bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-zinc-900/90 dark:to-purple-900/30 border-purple-200/50 dark:border-zinc-800/50 rounded-3xl active:scale-95 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-xl"
            >
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
              <div className="relative p-4 mb-3 text-purple-600 transition-all duration-300 bg-white shadow-lg dark:bg-slate-900 rounded-2xl group-hover:scale-110 group-hover:rotate-6">
                <Camera size={22} />
              </div>
              <span className="relative text-sm font-bold text-slate-700 dark:text-slate-200">Gallery</span>
            </button>

            {/* 🔧 Tools Card (Fixed) */}
            <button 
              onClick={goToTools} 
              className="relative flex flex-col items-center justify-center p-5 overflow-hidden transition-all duration-300 border group bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:from-zinc-900/90 dark:to-blue-900/30 border-blue-200/50 dark:border-zinc-800/50 rounded-3xl active:scale-95 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-xl"
            >
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
              <div className="relative p-4 mb-3 text-blue-600 transition-all duration-300 bg-white shadow-lg dark:bg-slate-900 rounded-2xl group-hover:scale-110 group-hover:rotate-6">
                <Wrench size={22} />
              </div>
              <span className="relative text-sm font-bold text-slate-700 dark:text-slate-200">Tools</span>
            </button>

            {/* 🔒 Secret Vault - Premium */}
            <button 
              onClick={triggerSecretVault} 
              className="relative flex items-center justify-between col-span-2 p-5 overflow-hidden transition-all duration-300 border group bg-gradient-to-br from-slate-900/95 to-black/95 dark:from-black/95 dark:to-slate-950/95 border-slate-700/50 rounded-3xl active:scale-95 hover:shadow-2xl hover:shadow-pink-500/30 backdrop-blur-xl"
            >
              {/* ✨ Animated gradient overlay */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-gradient-x bg-[length:200%_auto] transition-opacity"></div>
              
              <div className="relative flex items-center gap-4">
                <div className="p-3 text-pink-500 transition-all duration-300 shadow-lg rounded-2xl bg-slate-800 group-hover:text-white group-hover:bg-gradient-to-br from-pink-500 to-purple-500 group-hover:scale-110 group-hover:rotate-6">
                  <Lock size={20} />
                </div>
                <div className="text-left">
                  <div className="text-base font-bold text-white">Secret Vault</div>
                  <div className="text-[11px] text-slate-400">Tap to unlock mysteries</div>
                </div>
              </div>
              
              <div className="relative flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                <ArrowRight className="text-white transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1" size={18} />
              </div>
            </button>

            {/* 🌟 GitHub Button */}
            <div className="flex justify-center col-span-2 py-4">
              <div className="relative w-full group">
                <div className="absolute transition-all duration-700 -inset-1 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-purple-500/20 rounded-3xl blur-xl"></div>
                <GitHubStarButton 
                  owner="rahimmishu" 
                  repo="rahim-saroar" 
                  stars={1870} 
                  className="relative justify-center w-full py-4 text-sm font-bold transition-all duration-300 shadow-xl hover:shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppNavbar;