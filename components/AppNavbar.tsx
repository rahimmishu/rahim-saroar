import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Moon, Sun, Wrench, Sparkles, Camera, Lock, Home, User, Briefcase, Mail, Award, BookOpen } from 'lucide-react';

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
    { label: 'Home', href: '#home', icon: <Home size={20} /> },
    { label: 'Projects', href: '#projects', icon: <Briefcase size={20} /> },
    { label: 'Resources', href: '#resources', isSpecial: true, icon: <BookOpen size={20} /> }, 
    { label: 'Certifications', href: '#certifications', icon: <Award size={20} /> },
    { label: 'About Me', href: '#about', icon: <User size={20} /> },
    { label: 'Contact', href: '#contact', icon: <Mail size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // বডি স্ক্রল লক হ্যান্ডলিং
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  // 🔥 সিক্রেট ভল্ট ট্রিগার
  const triggerSecretVault = () => {
    setIsOpen(false);
    setTimeout(() => {
        window.dispatchEvent(new Event('open-secret-search'));
    }, 200);
  };

  // 🔥 নতুন স্ক্রল হ্যান্ডলার (এটাই সমস্যার সমাধান করবে)
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); // ডিফল্ট জাম্প বন্ধ করা
    setIsOpen(false);   // মেনু বন্ধ করা
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // একটু সময় দেওয়া যাতে মেনু ক্লোজ এনিমেশন শেষ হয়
      setTimeout(() => {
        const offset = 85; // Navbar এর উচ্চতা বাদ দেওয়া
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }, 300); // ৩০০ms ডিলে
    }
  };

  return (
    <>
      <nav className={`fixed w-full z-[50] transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg py-3 border-b border-white/10' 
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            
            {/* LOGO */}
            <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="group flex items-center gap-2 relative z-[60]">
               <div className="relative">
                  <Sparkles className="text-purple-500 animate-pulse" size={24} />
                  <div className="absolute inset-0 bg-purple-500/40 blur-lg rounded-full opacity-50 animate-ping duration-1000"></div>
               </div>
               <span className="text-2xl font-bold font-signature bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 dark:from-white dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Rahim Saroar Mishu
               </span>
            </a>

            {/* DESKTOP MENU (PC) */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center gap-4">
                 <button onClick={onOpenGallery} className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-purple-500/20">
                    <Camera size={18} /> Photos
                 </button>

                 {navLinks.map((link) => (
                    <a 
                      key={link.label} 
                      href={link.href} 
                      onClick={(e) => handleLinkClick(e, link.href)} // Desktop এও স্মুথ স্ক্রল অ্যাড করা হলো
                      className={`
                       ${link.isSpecial 
                         ? 'px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-400/10 border border-blue-600/20 text-blue-700 dark:text-cyan-400 font-bold hover:shadow-lg hover:-translate-y-0.5' 
                         : 'font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 relative group'}
                       flex items-center gap-2 transition-all duration-300
                    `}>
                       {link.isSpecial && <Sparkles size={16} className="animate-spin-slow" />}
                       {link.label}
                       {!link.isSpecial && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>}
                    </a>
                 ))}

                 <button onClick={onOpenTools} className="font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors">
                    <Wrench size={18} /> Tools
                 </button>
              </div>
              
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                 <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:rotate-12">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                 </button>
                 <a href="/resume.pdf" target="_blank" download className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300">
                    Resume
                 </a>
              </div>
            </div>

            {/* MOBILE TOGGLE BUTTON */}
            <div className="lg:hidden flex items-center gap-3 z-[60]">
               <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-600 dark:text-slate-300 transition-transform active:scale-90">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-800 dark:text-white transition-transform active:scale-90">
                 <div className="relative w-7 h-7 flex flex-col justify-center items-center gap-1.5">
                    <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                 </div>
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= 🔥 ULTRA PREMIUM MOBILE OVERLAY 🔥 ================= */}
      <div 
        className={`fixed inset-0 z-[55] bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-3xl transition-all duration-500 lg:hidden flex flex-col px-6 overflow-y-auto no-scrollbar pb-10
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ paddingTop: '100px' }}
      >
          {/* Animated Background Blobs */}
          <div className={`absolute top-[-10%] right-[-10%] w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}></div>
          <div className={`absolute bottom-[10%] left-[-10%] w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}></div>

          {/* Navigation Links List (Fixed Click Handler) */}
          <div className="flex flex-col gap-3 w-full max-w-md mx-auto relative z-10">
            {navLinks.map((link, idx) => (
              <a 
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)} // 🔥 এই লাইনটিই ফিক্স
                className={`group flex items-center gap-4 text-xl font-bold p-4 rounded-2xl transition-all duration-500 ease-out active:scale-95 border
                  ${link.isSpecial 
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/50 dark:border-blue-500/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'}
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                `}
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <span className={`p-2 rounded-xl transition-colors ${link.isSpecial ? 'bg-blue-500/20 text-blue-600' : 'bg-slate-200/50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-purple-500/20 group-hover:text-purple-500'}`}>
                    {link.icon}
                </span>
                {link.label}
              </a>
            ))}
          </div>

          {/* 🔥 WIDGET GRID 🔥 */}
          <div className={`grid grid-cols-2 gap-4 mt-6 w-full max-w-md mx-auto relative z-10 transition-all duration-700 delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
             
             {/* Gallery Widget */}
             <button onClick={() => { onOpenGallery(); setIsOpen(false); }} className="relative overflow-hidden flex flex-col items-start justify-between h-32 p-5 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[2rem] border border-purple-100 dark:border-slate-700 active:scale-95 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                <div className="p-2.5 bg-white dark:bg-slate-950 rounded-2xl text-purple-600 shadow-sm group-hover:rotate-12 transition-transform"><Camera size={24} /></div>
                <div>
                    <span className="block font-bold text-lg text-slate-800 dark:text-slate-200">Gallery</span>
                    <span className="text-xs text-slate-500 font-medium">View Photos</span>
                </div>
             </button>

             {/* Tools Widget */}
             <button onClick={() => { onOpenTools(); setIsOpen(false); }} className="relative overflow-hidden flex flex-col items-start justify-between h-32 p-5 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[2rem] border border-blue-100 dark:border-slate-700 active:scale-95 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                <div className="p-2.5 bg-white dark:bg-slate-950 rounded-2xl text-blue-600 shadow-sm group-hover:rotate-12 transition-transform"><Wrench size={24} /></div>
                <div>
                    <span className="block font-bold text-lg text-slate-800 dark:text-slate-200">Tools</span>
                    <span className="text-xs text-slate-500 font-medium">My Stack</span>
                </div>
             </button>

             {/* Secret Vault Widget */}
             <button onClick={triggerSecretVault} className="col-span-2 relative overflow-hidden flex items-center justify-between p-6 bg-slate-900 dark:bg-black rounded-[2rem] active:scale-95 transition-all duration-300 shadow-2xl shadow-slate-400/20 dark:shadow-black/50 group border border-slate-700/50">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-slate-800 rounded-2xl text-pink-500 group-hover:text-white group-hover:bg-pink-500 transition-colors"><Lock size={22} /></div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-bold text-white text-lg">Secret Vault</span>
                    <span className="text-xs text-slate-400 group-hover:text-pink-200 transition-colors">Tap to unlock hidden features</span>
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">LOCKED</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
             </button>

             {/* Resume Button */}
             <a href="/resume.pdf" download className="col-span-2 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/30 active:scale-95 transition-transform hover:scale-[1.02]">
                Download Resume
             </a>
          </div>
          
          <div className="h-10"></div> {/* Bottom Spacer */}
      </div>
    </>
  );
};

export default AppNavbar;