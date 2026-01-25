import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Moon, Sun, Wrench, Sparkles, Camera } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenTools: () => void;
  onOpenGallery: () => void; // ✅ এটি নিশ্চিত করুন যে এখানে ডিফাইন করা আছে
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
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="text-3xl font-bold text-slate-900 dark:text-white font-signature">
            Rahim Saroar <span className="text-primary">Mishu</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center gap-4">
              
              {/* ✅ Photos Button (Desktop) - এখানে onClick ফাংশনটি বসানো হয়েছে */}
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
                    className="font-medium transition-colors text-base text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 dark:bg-cyan-400 transition-all group-hover:w-full"></span>
                  </a>
                )
              ))}
              
              <button
                onClick={onOpenTools}
                className="font-medium transition-colors text-base text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary flex items-center gap-1"
              >
                <Wrench size={18} /> Tools
              </button>
            </div>
            
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
          <div className="lg:hidden flex items-center gap-4">
            
            {/* ✅ Photos Button (Mobile Top Bar) */}
            <button 
              onClick={onOpenGallery} 
              className="p-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-full"
            >
                <Camera size={20} />
            </button>

            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 dark:text-white p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border-t border-gray-100 dark:border-slate-800 py-6 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
            
            {/* ✅ Photos Button (Mobile Menu List) */}
            <button 
              onClick={() => { onOpenGallery(); setIsOpen(false); }} 
              className="text-left text-purple-600 font-bold py-2 border-b border-gray-50 dark:border-slate-800 flex items-center gap-2"
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
              className="text-left text-slate-600 dark:text-slate-300 hover:text-primary font-medium py-2 flex items-center gap-2"
            >
              <Wrench size={18} /> Tools
            </button>
            <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <a 
                href="/resume.pdf"
                target="_blank"
                download
                className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2"
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