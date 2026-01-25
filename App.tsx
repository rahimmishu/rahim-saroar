import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import About from './components/About';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Chatbot from './components/Chatbot';
import CreativeWork from './components/CreativeWork';
import ScienceSimulation from './components/ScienceSimulation';
import Tools from './components/Tools';
import FacebookFeed from './components/FacebookFeed';
import Resources from './components/Resources';
import PhotoGallery from './components/PhotoGallery'; // ✅ ইমপোর্ট নিশ্চিত করুন

const App: React.FC = () => {
  // ১. টুলস এবং গ্যালারির জন্য স্টেট
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); 
  
  // ডার্ক মোড স্টেট ইনিশিয়ালাইজেশন
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* ২. Navbar-এ প্রপস পাঠানো হচ্ছে */}
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onOpenTools={() => setIsToolsOpen(true)}
        onOpenGallery={() => setIsGalleryOpen(true)} // 🔥 বাটন ক্লিকের সিগন্যাল
      />
      
      {/* মেইন সেকশনগুলো */}
      <Hero />
      <TechMarquee />
      <FacebookFeed />
      <Projects />
      <Resources />
      <CreativeWork />
      <ScienceSimulation />
      <Achievements />
      <Certifications />
      <About />
      <Journey />
      <Contact />
      <Footer />

      {/* ফ্লোটিং আইটেমস */}
      <BackToTop />
      <FloatingWhatsApp />
      <Chatbot />
      
      {/* ৩. PHOTO GALLERY POPUP */}
      {/* isOpen প্রপসটি PhotoGallery এর ভেতরে রিসিভ করা হবে */}
      <PhotoGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

      {/* ৪. TOOLS POPUP MODAL */}
      {isToolsOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
          
          {/* ক্লোজ বাটন */}
          <button 
            onClick={() => setIsToolsOpen(false)}
            className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:rotate-90"
          >
            <X size={28} />
          </button>

          {/* টুলস কন্টেন্ট */}
          <div className="relative min-h-screen">
             <Tools />
          </div>
        </div>
      )}
    </main>
  );
};

export default App;