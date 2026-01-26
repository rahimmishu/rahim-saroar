import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, PlayCircle, Github, Facebook, Linkedin, Mail } from 'lucide-react';
import Tilt3D from './Tilt3D'; // ✅ এই ইমপোর্টটি যেমন আছে তেমনই থাকবে

const Hero: React.FC = () => {
  // --- Typing Effect Logic ---
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
    <section id="home" className="relative flex items-center min-h-screen pt-24 pb-12 overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
      
      {/* Background Shapes (Decoration) */}
      <div className="absolute right-0 rounded-full top-20 w-96 h-96 bg-purple-500/10 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 rounded-full w-72 h-72 bg-blue-500/10 blur-3xl -z-10"></div>

      <div className="container px-4 mx-auto md:px-8">
        <div className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:gap-20">
          
          {/* --- Left Content: Text & Buttons --- */}
          <div className="z-10 w-full space-y-8 text-center lg:w-1/2 lg:text-left">
            
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mx-auto text-sm font-semibold text-blue-600 bg-blue-100 border border-blue-200 rounded-full dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 animate-fade-in-up lg:mx-0">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-blue-500 rounded-full"></span>
              </span>
              <span className="flex items-center gap-1">
                 <Sparkles size={14} /> Future Tech Leader
              </span>
            </div>

            {/* Headline with Typing Effect */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 dark:text-white font-sans min-h-[3.5em] lg:min-h-[auto]">
              I am a <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {text}
                <span className="h-full ml-1 align-middle border-r-4 border-purple-500 animate-cursor">&nbsp;</span>
              </span>
            </h1>

            {/* Bangla Subtitle */}
            <h2 className="text-2xl font-bold md:text-3xl text-slate-700 dark:text-slate-300 font-bengali">
               প্রযুক্তির সাথে, স্বপ্নের পথে
            </h2>
            
            <p className="max-w-lg mx-auto text-lg leading-relaxed text-slate-500 dark:text-slate-400 lg:mx-0">
              Turning ideas into reality with Python, AI, and Creative Coding.
            </p>

            {/* Buttons Area */}
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
              
              {/* 🔥 UPDATE: SHIMMER BUTTON (আলোর ঝলকানি ইফেক্ট যোগ করা হয়েছে) 🔥 */}
              <a href="#projects" className="relative flex items-center justify-center w-full gap-2 px-8 py-4 overflow-hidden font-bold text-white transition-all bg-blue-600 rounded-full shadow-lg group shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-1 sm:w-auto">
                
                {/* ✨ Shimmer Effect Layer */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                
                {/* Button Text & Icon */}
                <span className="relative z-20 flex items-center gap-2">
                  View My Projects <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
              
              {/* Movie Button (Red) */}
              <a 
                href="https://movie-dekhbi.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full gap-2 px-8 py-4 font-bold text-white transition-all bg-red-600 border rounded-full shadow-lg group hover:bg-red-700 border-red-500/50 shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 sm:w-auto font-bengali"
              >
                <PlayCircle size={20} className="animate-pulse" />
                 মুভি দেখবি?
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-6 pt-6 lg:justify-start text-slate-400">
              <a href="https://github.com/rahimmishu" target="_blank" className="transition-colors duration-200 transform hover:text-slate-900 dark:hover:text-white hover:scale-110"><Github size={24} /></a>
              <a href="https://www.facebook.com/rahimsaroar" target="_blank" className="transition-colors duration-200 transform hover:text-blue-600 hover:scale-110"><Facebook size={24} /></a>
              <a href="https://www.linkedin.com/in/rahim-saroar/" target="_blank" className="transition-colors duration-200 transform hover:text-blue-500 hover:scale-110"><Linkedin size={24} /></a>
              <a href="mailto:rahim@example.com" className="transition-colors duration-200 transform hover:text-red-500 hover:scale-110"><Mail size={24} /></a>
            </div>
          </div>

          {/* --- Right Content: BIGGER 3D Image --- */}
          <div className="relative z-10 flex justify-center w-full lg:w-1/2 lg:justify-end">
            
            {/* Animated Blob Behind Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

            {/* 🔥 Tilt3D Wrapper (যেমন ছিল তেমনই আছে) 🔥 */}
            <Tilt3D className="relative w-72 md:w-96 lg:w-[480px] xl:w-[550px] aspect-[4/5] rounded-3xl rotate-3 hover:rotate-0 transition-all duration-700 ease-out group perspective-1000">
              
              {/* Border Gradient Frame */}
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[26px] opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
              
              {/* Main Image */}
              <div className="relative h-full w-full bg-slate-900 rounded-3xl overflow-hidden border-[6px] border-white dark:border-slate-800 shadow-2xl">
                 <img 
                  // SEO-এর জন্য সঠিক নাম ব্যবহার করা হয়েছে
                  src="/1.jpg" 
                  alt="Rahim Saroar Mishu" 
                  className="object-cover w-full h-full transition-transform duration-700 transform scale-105 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-100"></div>
              </div>

              {/* Floating Badge on Image */}
              <div className="absolute p-4 delay-700 bg-white border shadow-xl -bottom-6 -left-6 dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Status</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Open to Work</p>
                  </div>
                </div>
              </div>

            </Tilt3D>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;