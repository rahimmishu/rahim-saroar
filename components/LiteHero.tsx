// 📱 LiteHero.tsx — Mobile Lite Version
// Heavy effects সরানো হয়েছে: Tilt3D, spinning borders, orbit dots, pulsing rings, blob animations
// কিন্তু same visual identity রাখা হয়েছে

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Github, Facebook, Linkedin, Mail, Coffee } from 'lucide-react';

const LiteHero: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const toRotate = ["Web Developer", "AI Enthusiast", "Content Creator"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % toRotate.length;
      const fullText = toRotate[i];
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
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
    <section
      id="home"
      className="relative flex items-center min-h-screen pt-24 pb-12 overflow-hidden transition-colors duration-300 bg-white dark:bg-black"
    >
      <style>{`
        @keyframes lite-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .lite-cursor { animation: lite-cursor 0.75s step-end infinite; }

        @keyframes lite-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lite-fade-1 { animation: lite-fade-up 0.6s ease-out 0.1s both; }
        .lite-fade-2 { animation: lite-fade-up 0.6s ease-out 0.25s both; }
        .lite-fade-3 { animation: lite-fade-up 0.6s ease-out 0.4s both; }
        .lite-fade-4 { animation: lite-fade-up 0.6s ease-out 0.55s both; }

        .lite-photo-wrap:hover .lite-photo { transform: scale(1.04); }
        .lite-photo { transition: transform 0.5s ease; }
      `}</style>

      {/* Static gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full opacity-20 dark:opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, #3b82f6 60%, transparent 80%)' }}
        />
        <div
          className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full opacity-15 dark:opacity-10"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, #8b5cf6 60%, transparent 80%)' }}
        />
      </div>

      <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">

          {/* LEFT: Text Content */}
          <div className="flex flex-col items-center w-full text-center lg:w-1/2 lg:items-start lg:text-left">

            <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-purple-700 border rounded-full lite-fade-1 border-purple-300/40 dark:border-purple-700/40 bg-purple-50/80 dark:bg-purple-950/40 dark:text-purple-300">
              <Sparkles size={14} className="text-purple-500" />
              <span>Open to Opportunities</span>
            </div>

            <div className="lite-fade-2">
              <h1 className="mb-1 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
                Hi, I'm{' '}
              </h1>
              <h1
                className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Rahim Saroar
              </h1>
            </div>

            <div className="lite-fade-3 flex items-center gap-2 mt-4 mb-4 text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 min-h-[36px]">
              <span>{text}</span>
              <span className="text-purple-500 lite-cursor">|</span>
            </div>

            <p className="max-w-lg mb-8 text-base leading-relaxed lite-fade-3 sm:text-lg text-slate-500 dark:text-slate-400">
              A passionate developer from Bangladesh, building creative digital experiences with{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">Python</span>,{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">React</span>, and AI.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8 lite-fade-4">
              <a
                href="#projects"
                className="flex items-center gap-2 px-6 py-3 font-bold text-white transition-all duration-200 group rounded-2xl active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6d28d9, #2563eb)' }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>View Projects</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="https://www.buymeacoffee.com/rahimsaroar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 font-bold transition-all duration-200 border-2 group rounded-2xl active:scale-95 bg-amber-50 dark:bg-amber-950/40 border-amber-400/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60"
              >
                <Coffee size={18} className="transition-transform group-hover:scale-110" />
                <span>Buy Me a Coffee</span>
              </a>
            </div>

            <div className="flex items-center gap-6 lite-fade-4 text-slate-400">
              <a href="https://github.com/rahimmishu" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-900 dark:hover:text-white active:scale-95">
                <Github size={24} />
              </a>
              <a href="https://www.facebook.com/rahimsaroar" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-blue-600 active:scale-95">
                <Facebook size={24} />
              </a>
              <a href="https://www.linkedin.com/in/rahim-saroar/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-blue-500 active:scale-95">
                <Linkedin size={24} />
              </a>
              <a href="mailto:rahim@example.com" className="transition-colors hover:text-red-500 active:scale-95">
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="relative flex justify-center w-full lite-fade-4 lg:w-1/2 lg:justify-end">

            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[60px] opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(59,130,246,0.4) 50%, transparent 70%)' }}
            />

            <div className="lite-photo-wrap relative z-10 w-64 sm:w-72 lg:w-[340px] xl:w-[380px]">

              <div
                className="p-[3px] rounded-[52px]"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #ec4899)' }}
              >
                <div className="relative rounded-[50px] overflow-hidden shadow-2xl">
                  {/* ✅ FIX: Hero image — mobile-তেও eager load করতে হবে।
                      এটা viewport-এর উপরে থাকে, lazy করলে দেরি হয় */}
                  <img
                    src="/1.jpg"
                    alt="Rahim Saroar Mishu"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="lite-photo w-full aspect-[4/5] object-cover object-top"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
              </div>

              {/* Badges */}
              <div
                className="absolute z-20 flex items-center gap-2 px-3 py-2 border shadow-lg rounded-2xl -top-3 -left-4 border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(30,30,60,0.92), rgba(60,20,90,0.92))' }}
              >
                <span className="text-sm">💻</span>
                <span className="flex flex-col leading-none">
                  <span className="text-[8px] text-white/50 font-semibold uppercase tracking-widest">Role</span>
                  <span className="text-[11px] text-white font-bold">Full Stack Dev</span>
                </span>
              </div>

              <div
                className="absolute z-20 flex items-center gap-2 px-3 py-2 border shadow-lg rounded-2xl -bottom-3 -left-3 border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(20,40,30,0.92), rgba(10,80,50,0.92))' }}
              >
                <span className="text-sm">🇧🇩</span>
                <span className="flex flex-col leading-none">
                  <span className="text-[8px] text-white/50 font-semibold uppercase tracking-widest">Based in</span>
                  <span className="text-[11px] text-white font-bold">Bangladesh</span>
                </span>
              </div>

              <div
                className="absolute z-20 flex items-center gap-2 px-3 py-2 -translate-y-1/2 border shadow-lg rounded-2xl top-1/2 -right-4 border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(40,20,10,0.92), rgba(90,50,10,0.92))' }}
              >
                <span className="text-sm">🤖</span>
                <span className="flex flex-col leading-none">
                  <span className="text-[8px] text-white/50 font-semibold uppercase tracking-widest">Loves</span>
                  <span className="text-[11px] text-white font-bold">AI & Python</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LiteHero;