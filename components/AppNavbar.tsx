import React, { useState, useEffect } from 'react';
import { Menu, X, Camera, Wrench, Sparkles, Home, Briefcase, BookOpen, Award, User, Mail, Lock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenTools: () => void;
  onOpenGallery: () => void;
}

const AppNavbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, onOpenTools, onOpenGallery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home', icon: <Home size={18} /> },
    { label: 'Projects', href: '#projects', icon: <Briefcase size={18} /> },
    { label: 'Resources', href: '#resources', isSpecial: true, icon: <BookOpen size={18} /> }, 
    { label: 'Certifications', href: '#certifications', icon: <Award size={18} /> },
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

  return (
    <>
      {/* 🔥 Floating Premium Navbar */}
      <nav 
        className={`fixed left-1/2 -translate-x-1/2 z-[50] transition-all duration-500 ease-out border border-white/10 rounded-full flex items-center justify-between
        ${scrolled 
          ? 'top-4 w-[95%] md:w-[85%] lg:w-[75%] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl py-2 px-6' 
          : 'top-6 w-[98%] md:w-[90%] lg:w-[85%] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-3 px-6'
        }`}
      >
          {/* LOGO with Glowing Animation */}
          <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="relative flex items-center gap-2 group shrink-0">
             <div className="relative">
                {/* 🔥 Icon Updated with Glow Shadow */}
                <Sparkles className="text-fuchsia-500 animate-spin-slow filter drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]" size={20} />
             </div>
             
             {/* 🔥 Animated Name Logic (Updated with Vibrant Colors) */}
             <span className="hidden pb-1 text-lg font-bold text-transparent md:text-xl font-signature bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-500 dark:from-cyan-400 dark:via-fuchsia-400 dark:to-yellow-300 bg-clip-text sm:block whitespace-nowrap animate-text-flow">
                Rahim Saroar Mishu
             </span>
          </a>

          {/* DESKTOP MENU */}
          <div className="items-center hidden gap-1 lg:flex">
            <button onClick={onOpenGallery} className="p-2 text-purple-600 transition-all rounded-full dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30" title="Photos">
              <Camera size={18} />
            </button>

            <div className="w-px h-4 mx-2 bg-slate-300 dark:bg-slate-700"></div>

            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`
                  ${link.isSpecial 
                    ? 'px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-400/10 border border-blue-600/20 text-blue-700 dark:text-cyan-400 font-bold text-xs' 
                    : 'text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all'}
                  flex items-center gap-1.5 whitespace-nowrap
              `}>
                  {link.label}
              </a>
            ))}

            <div className="w-px h-4 mx-2 bg-slate-300 dark:bg-slate-700"></div>

            <button onClick={onOpenTools} className="p-2 transition-all rounded-full text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Tools">
              <Wrench size={18} />
            </button>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
              <div className="origin-right scale-90">
                <ThemeToggle isDark={isDarkMode} toggleTheme={toggleTheme} />
              </div>
              
              <a href="/resume.pdf" target="_blank" download className="hidden sm:block px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap">
                Resume
              </a>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 transition-transform lg:hidden text-slate-800 dark:text-white active:scale-90">
               {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
          </div>
      </nav>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-[40] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-3xl transition-all duration-500 lg:hidden flex flex-col px-6 overflow-y-auto no-scrollbar pb-20
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ paddingTop: '100px' }}
      >
          <div className="relative z-10 flex flex-col w-full max-w-md gap-3 mx-auto">
            {navLinks.map((link, idx) => (
              <a 
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)} 
                className={`group flex items-center gap-4 text-lg font-bold p-3 rounded-xl border transition-all duration-300
                  ${link.isSpecial 
                    ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' 
                    : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <span className="p-2 bg-white rounded-full shadow-sm dark:bg-slate-900">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>

          {/* Widget Grid */}
          <div className={`grid grid-cols-2 gap-3 mt-6 w-full max-w-md mx-auto relative z-10 transition-all duration-500 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              
              <button onClick={() => { onOpenGallery(); setIsOpen(false); }} className="flex flex-col items-center justify-center p-4 transition-all border border-purple-100 bg-purple-50 dark:bg-slate-800 dark:border-slate-700 rounded-2xl active:scale-95">
                <div className="p-3 mb-2 text-purple-600 bg-white rounded-full shadow-sm dark:bg-slate-900"><Camera size={20} /></div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Gallery</span>
              </button>

              <button onClick={() => { onOpenTools(); setIsOpen(false); }} className="flex flex-col items-center justify-center p-4 transition-all border border-blue-100 bg-blue-50 dark:bg-slate-800 dark:border-slate-700 rounded-2xl active:scale-95">
                <div className="p-3 mb-2 text-blue-600 bg-white rounded-full shadow-sm dark:bg-slate-900"><Wrench size={20} /></div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Tools</span>
              </button>

              <button onClick={triggerSecretVault} className="flex items-center justify-between col-span-2 p-4 transition-all border shadow-lg bg-slate-900 dark:bg-black border-slate-700 rounded-2xl active:scale-95 group">
                 <div className="flex items-center gap-3">
                    <div className="p-2 text-pink-500 transition-colors rounded-lg bg-slate-800 group-hover:text-white group-hover:bg-pink-500"><Lock size={18} /></div>
                    <div className="text-left">
                        <div className="text-sm font-bold text-white">Secret Vault</div>
                        <div className="text-[10px] text-slate-400">Tap to unlock</div>
                    </div>
                 </div>
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button>

              <a href="/resume.pdf" download className="col-span-2 py-3 font-bold text-center text-white transition-transform shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl active:scale-95">
                  Download Resume
              </a>
          </div>
      </div>
    </>
  );
};

export default AppNavbar;