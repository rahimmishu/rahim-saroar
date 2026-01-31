import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Moon, Sun, Wrench, Sparkles, Camera, Lock } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenTools: () => void;
  onOpenGallery: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, onOpenTools, onOpenGallery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Projects', href: '#projects' },
    { label: 'Resources', href: '#resources', isSpecial: true }, 
    { label: 'Certifications', href: '#certifications' },
    { label: 'About Me', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg py-4' 
        : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6'
    }`}>
      <div className="container px-4 mx-auto md:px-8">
        <div className="flex items-center justify-between">
          
          {/* 🔥 PREMIUM ANIMATED LOGO/NAME START 🔥 */}
          <a href="#home" className="relative flex items-center gap-2 group">
            
            {/* আইকন এবং এনিমেশন */}
            <div className="relative hidden xs:block">
               <Sparkles className="text-purple-500 transition-transform duration-500 group-hover:animate-spin-slow" size={24} />
               <div className="absolute inset-0 transition-opacity duration-500 rounded-full opacity-0 bg-purple-500/20 blur-xl group-hover:opacity-100"></div>
            </div>

            {/* নামের টেক্সট এবং গ্রেডিয়েন্ট এনিমেশন */}
            <span className="relative overflow-hidden text-2xl font-bold md:text-3xl font-signature">
              <span className="bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Rahim Saroar Mishu
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500 ease-out"></span>
            </span>
          </a>
          {/* 🔥 PREMIUM ANIMATED LOGO END 🔥 */}

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-8 lg:flex">
            <div className="flex items-center gap-4">
              
              {/* Photos Button */}
              <button 
                onClick={onOpenGallery}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-bold hover:bg-purple-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Camera size={18} /> Photos
              </button>

              {/* Links */}
              {navLinks.map((link) => (
                link.isSpecial ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-full
                      bg-gradient-to-r from-blue-600/10 to-cyan-400/10 hover:from-blue-600/20 hover:to-cyan-400/20
                      border border-blue-600/20 dark:border-cyan-400/20
                      text-blue-700 dark:text-cyan-400 font-bold
                      transition-all duration-300 
                      hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:-translate-y-0.5
                    "
                  >
                    <Sparkles size={16} className="animate-pulse" />
                    {link.label}
                  </a>
                ) : (
                  <a 
                    key={link.label}
                    href={link.href} 
                    className="relative text-base font-medium transition-colors text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 dark:bg-cyan-400 transition-all group-hover:w-full"></span>
                  </a>
                )
              ))}
              
              <button
                onClick={onOpenTools}
                className="flex items-center gap-1 text-base font-medium transition-colors text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
              >
                <Wrench size={18} /> Tools
              </button>
            </div>
            
            <div className="flex items-center pl-4 space-x-4 border-l border-slate-200 dark:border-slate-800">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 transition-colors rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <a 
                href="/resume.pdf" 
                target="_blank" 
                download
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                <Download size={18} />
                Download Resume
              </a>
            </div>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            
            {/* Photos Button (Mobile Top Bar) */}
            <button 
              onClick={onOpenGallery} 
              className="p-2 text-purple-600 rounded-full dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
            >
              <Camera size={20} />
            </button>

            <button 
                onClick={toggleTheme}
                className="p-2 transition-colors rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-800 dark:text-white"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute left-0 flex flex-col w-full px-4 py-6 space-y-4 border-t border-gray-100 shadow-xl lg:hidden top-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md dark:border-slate-800 animate-in slide-in-from-top-5">
            
            {/* Photos Button (Mobile Menu List) */}
            <button 
              onClick={() => { onOpenGallery(); setIsOpen(false); }} 
              className="flex items-center gap-2 py-2 font-bold text-left text-purple-600 border-b border-gray-50 dark:border-slate-800"
            >
              <Camera size={18} /> Open Photo Gallery
            </button>

            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className={`${link.isSpecial ? 'text-cyan-500 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-slate-800/50 pl-4 border-l-4 border-cyan-400' : 'text-slate-600 dark:text-slate-300 font-medium'} hover:text-primary py-2 transition-all`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-2">
                  {link.isSpecial && <Sparkles size={16} />}
                  {link.label}
                </span>
              </a>
            ))}
            
            <button
              onClick={() => {
                onOpenTools();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 py-2 font-medium text-left text-slate-600 dark:text-slate-300 hover:text-primary"
            >
              <Wrench size={18} /> Tools
            </button>

            {/* 🔥 SECRET VAULT BUTTON ADDED HERE 🔥 */}
            <button 
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new Event('open-secret-search'));
              }}
              className="flex items-center w-full py-2 font-medium text-left transition-colors text-slate-600 dark:text-slate-300 hover:text-pink-500"
            >
              <Lock size={18} className="mr-2" />
              Secret Vault
            </button>

            <div className="flex flex-col pt-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
              <a 
                href="/resume.pdf"
                target="_blank"
                download
                className="flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold text-white rounded-lg shadow-lg bg-primary hover:bg-blue-700 shadow-blue-500/30"
              >
                <Download size={18} />
                Download Resume
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;