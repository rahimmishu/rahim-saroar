import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, PlayCircle, Github, Facebook, Linkedin, Mail } from 'lucide-react';

const Hero: React.FC = () => {
  // --- Typing Effect Logic (আপনার কোড থেকে) ---
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const toRotate = ["Web Developer", "AI Enthusiast", "Content Creator"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % toRotate.length;
      const fullText = toRotate[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); 
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Background Shapes (Decoration) */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* --- Left Content: Text & Buttons --- */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left z-10">
            
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-200 dark:border-blue-800 animate-fade-in-up mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="flex items-center gap-1">
                 <Sparkles size={14} /> Future Tech Leader
              </span>
            </div>

            {/* Headline with Typing Effect */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 dark:text-white font-sans min-h-[3.5em] lg:min-h-[auto]">
              I am a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 inline-block">
                {text}
                <span className="animate-cursor border-r-4 border-purple-500 ml-1 h-full align-middle">&nbsp;</span>
              </span>
            </h1>

            {/* Bangla Subtitle */}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-300 font-bengali">
               প্রযুক্তির সাথে, স্বপ্নের পথে
            </h2>
            
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed">
              Turning ideas into reality with Python, AI, and Creative Coding.
            </p>

            {/* Buttons Area */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              
              {/* Projects Button */}
              <a href="#projects" className="group px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                View My Projects <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              
              {/* Movie Button (Red) */}
              <a 
                href="https://movie-dekhbi.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white border border-red-500/50 rounded-full font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-center font-bengali"
              >
                <PlayCircle size={20} className="animate-pulse" />
                 মুভি দেখবি?
              </a>
            </div>

            {/* Social Icons (New Addition) */}
            <div className="flex items-center justify-center lg:justify-start gap-6 text-slate-400 pt-6">
              <a href="https://github.com/rahimmishu" target="_blank" className="hover:text-slate-900 dark:hover:text-white transition-colors hover:scale-110 transform duration-200"><Github size={24} /></a>
              <a href="https://www.facebook.com/rahimsaroar" target="_blank" className="hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"><Facebook size={24} /></a>
              <a href="https://linkedin.com" target="_blank" className="hover:text-blue-500 transition-colors hover:scale-110 transform duration-200"><Linkedin size={24} /></a>
              <a href="mailto:rahim@example.com" className="hover:text-red-500 transition-colors hover:scale-110 transform duration-200"><Mail size={24} /></a>
            </div>
          </div>

          {/* --- Right Content: Professional 3D Image --- */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end z-10">
            
            {/* 1. Animated Blob Behind Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

            {/* 2. Image Container with 3D Effect */}
            <div className="relative w-72 md:w-96 aspect-[4/5] rounded-3xl rotate-3 hover:rotate-0 transition-all duration-700 ease-out group perspective-1000">
              
              {/* Border Gradient Frame */}
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[26px] opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
              
              {/* Main Image */}
              <div className="relative h-full w-full bg-slate-900 rounded-3xl overflow-hidden border-[6px] border-white dark:border-slate-800 shadow-2xl">
                 <img 
                  // আপনার পাবলিক ফোল্ডারের সঠিক ছবির নাম ব্যবহার করা হয়েছে
                  src="/1.jpg" 
                  alt="Rahim Saroar Mishu" 
                  className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating Badge on Image */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce delay-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Status</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Open to Work</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;