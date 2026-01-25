import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, PlayCircle } from 'lucide-react';

const Hero: React.FC = () => {
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
    <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-slate-800 text-primary rounded-full text-sm font-bold border border-blue-100 dark:border-slate-700 mx-auto lg:mx-0">
              <Sparkles size={16} />
              <span>Future Tech Leader</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight min-h-[3.5em] lg:min-h-[auto]">
              I am a <br />
              <span className="text-primary inline-block">
                {text}
                <span className="animate-cursor border-r-4 border-primary ml-1 h-full align-middle">&nbsp;</span>
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-300 font-bengali">
              প্রযুক্তির সাথে, স্বপ্নের পথে
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Turning ideas into reality with Python, AI, and Creative Coding.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              
              {/* View Projects Button */}
              <a 
                href="#projects" 
                className="
                  group relative 
                  px-8 py-4 
                  bg-gradient-to-r from-blue-600 to-blue-500 
                  hover:from-blue-500 hover:to-blue-400
                  text-white 
                  rounded-xl 
                  font-bold 
                  transition-all duration-300 
                  transform hover:scale-105 
                  shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40
                  flex items-center gap-2 w-full sm:w-auto justify-center
                "
              >
                View My Projects
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              {/* ✅ Movie Button (Font Fixed) */}
              <a 
                href="https://movie-dekhbi.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="
                  group relative
                  px-8 py-4 
                  bg-red-600 
                  hover:bg-red-700 
                  text-white 
                  rounded-xl 
                  font-bold 
                  transition-all duration-300 
                  transform hover:scale-105 
                  shadow-lg shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/50
                  flex items-center gap-2 w-full sm:w-auto justify-center
                  border border-red-500/50
                  font-bengali text-lg tracking-wide
                "
              >
                {/* font-bengali ক্লাসটি যুক্ত করা হয়েছে */}
                <PlayCircle size={22} className="animate-pulse" />
                মুভি দেখবি?
              </a>

            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-black/50 border-8 border-white dark:border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="./1.jpg" 
                alt="Rahim Saroar Mishu" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50 -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;