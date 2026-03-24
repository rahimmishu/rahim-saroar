import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Github, Facebook, Linkedin, Mail, Coffee } from 'lucide-react';
import Tilt3D from './Tilt3D'; 
import { triggerIsland } from './DynamicIsland'; 

const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const coffeeRef = useRef<HTMLAnchorElement>(null);

  const handleCoffeeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = coffeeRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
  };

  const [projectRipples, setProjectRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const projectsRef = useRef<HTMLAnchorElement>(null);

  const handleProjectsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = projectsRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setProjectRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setProjectRipples(prev => prev.filter(r => r.id !== id)), 700);
  };

  const toRotate = ["Web Developer", "AI Enthusiast", "Content Creator"];

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerIsland("Entering Digital Workspace... ⚡", "success");
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

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
    <section id="home" className="relative flex items-center min-h-screen pt-24 pb-12 overflow-hidden transition-colors duration-300 bg-white dark:bg-black">
      
      {/* 🔥 CSS Animations */}
      <style>{`
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -50px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes steam {
          0%   { transform: translateY(0px) translateX(0px) scaleX(1);    opacity: 0.7; }
          25%  { transform: translateY(-5px)  translateX(3px)  scaleX(1.1); opacity: 0.5; }
          50%  { transform: translateY(-10px) translateX(-3px) scaleX(0.9); opacity: 0.3; }
          75%  { transform: translateY(-14px) translateX(2px)  scaleX(1.1); opacity: 0.15; }
          100% { transform: translateY(-18px) translateX(0px)  scaleX(0.7); opacity: 0; }
        }
        .steam-1 { animation: steam 1.6s ease-in-out infinite 0.0s; }
        .steam-2 { animation: steam 1.6s ease-in-out infinite 0.4s; }
        .steam-3 { animation: steam 1.6s ease-in-out infinite 0.8s; }

        @keyframes rotate-border {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .rotate-border { animation: rotate-border 3s linear infinite; }

        @keyframes coffee-shimmer {
          0%   { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(220%)  skewX(-20deg); opacity: 0; }
        }
        .coffee-shimmer { animation: coffee-shimmer 2.2s ease-in-out infinite; }

        @keyframes gold-glow {
          0%,100% { box-shadow: 0 0 15px 2px rgba(251,191,36,0.5), 0 0 35px 6px rgba(245,158,11,0.25), 0 4px 20px rgba(249,115,22,0.3); }
          50%     { box-shadow: 0 0 28px 6px rgba(251,191,36,0.8), 0 0 60px 12px rgba(245,158,11,0.45), 0 4px 30px rgba(249,115,22,0.5); }
        }
        .gold-glow { animation: gold-glow 1.8s ease-in-out infinite; }

        @keyframes cup-bounce {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          25%     { transform: translateY(-3px) rotate(-6deg); }
          75%     { transform: translateY(-3px) rotate(6deg); }
        }
        .cup-bounce { animation: cup-bounce 2s ease-in-out infinite; }

        @keyframes float-star {
          0%   { transform: translateY(0px)  scale(0) rotate(0deg);   opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(-28px) scale(1.2) rotate(180deg); opacity: 0; }
        }
        .star-1 { animation: float-star 2.4s ease-in-out infinite 0.0s; }
        .star-2 { animation: float-star 2.4s ease-in-out infinite 0.6s; }
        .star-3 { animation: float-star 2.4s ease-in-out infinite 1.2s; }
        .star-4 { animation: float-star 2.4s ease-in-out infinite 1.8s; }

        @keyframes ripple-out {
          0%   { transform: scale(0);   opacity: 0.6; }
          100% { transform: scale(4);   opacity: 0; }
        }
        .ripple-circle { animation: ripple-out 0.7s ease-out forwards; }

        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes blue-glow {
          0%,100% { box-shadow: 0 0 15px 2px rgba(59,130,246,0.5), 0 0 35px 6px rgba(99,102,241,0.25), 0 4px 20px rgba(139,92,246,0.3); }
          50%     { box-shadow: 0 0 28px 6px rgba(59,130,246,0.8), 0 0 60px 12px rgba(99,102,241,0.45), 0 4px 30px rgba(139,92,246,0.5); }
        }
        .blue-glow { animation: blue-glow 1.8s ease-in-out infinite; }

        @keyframes rotate-border-blue {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .rotate-border-blue { animation: rotate-border-blue 3s linear infinite; }

        @keyframes blue-shimmer {
          0%   { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(220%) skewX(-20deg); opacity: 0; }
        }
        .blue-shimmer { animation: blue-shimmer 2.2s ease-in-out infinite; }

        @keyframes arrow-float {
          0%,100% { transform: translateX(0px); }
          50%     { transform: translateX(5px); }
        }
        .arrow-float { animation: arrow-float 1.2s ease-in-out infinite; }

        @keyframes spin-border {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-border { animation: spin-border 4s linear infinite; }
        .spin-border-reverse { animation: spin-border 6s linear infinite reverse; }

        @keyframes photo-float {
          0%,100% { transform: translateY(0px) rotate(2deg); }
          50%     { transform: translateY(-18px) rotate(-1deg); }
        }
        .photo-float { animation: photo-float 5s ease-in-out infinite; }

        @keyframes orbit {
          0%   { transform: rotate(0deg) translateX(170px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(170px) rotate(-360deg); }
        }
        @keyframes orbit-reverse {
          0%   { transform: rotate(0deg) translateX(195px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(195px) rotate(360deg); }
        }
        .orbit-dot   { animation: orbit 6s linear infinite; }
        .orbit-dot-2 { animation: orbit 6s linear infinite 2s; }
        .orbit-dot-r { animation: orbit-reverse 9s linear infinite; }

        @keyframes badge-float {
          0%,100% { transform: translateY(0px) scale(1); }
          50%     { transform: translateY(-8px) scale(1.04); }
        }
        .badge-float-1 { animation: badge-float 3.5s ease-in-out infinite 0s; }
        .badge-float-2 { animation: badge-float 3.5s ease-in-out infinite 1.2s; }
        .badge-float-3 { animation: badge-float 3.5s ease-in-out infinite 2.4s; }

        @keyframes corner-spark {
          0%,100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); }
          50%     { opacity: 1;   transform: scale(1.3) rotate(180deg); }
        }
        .corner-spark { animation: corner-spark 2s ease-in-out infinite; }

        @keyframes photo-shimmer {
          0%   { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(220%)  skewX(-15deg); }
        }
        .photo-shimmer { animation: photo-shimmer 3.5s ease-in-out infinite; }

        @keyframes ring-pulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0;   }
        }
        .ring-pulse-1 { animation: ring-pulse 2.5s ease-out infinite 0s; }
        .ring-pulse-2 { animation: ring-pulse 2.5s ease-out infinite 0.8s; }
        .ring-pulse-3 { animation: ring-pulse 2.5s ease-out infinite 1.6s; }
      `}</style>

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-50 dark:opacity-40 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-50 dark:opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-50 dark:opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-20 animate-pulse"></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto md:px-8">
        <div className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:gap-20">
          
          {/* Left Content */}
          <div className="w-full space-y-8 text-center lg:w-1/2 lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 mx-auto text-sm font-semibold text-blue-600 bg-blue-100 border border-blue-200 rounded-full dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 animate-fade-in-up lg:mx-0">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-blue-500 rounded-full"></span>
              </span>
              <span className="flex items-center gap-1">
                <Sparkles size={14} /> Future Tech Leader
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 dark:text-white font-sans min-h-[3.5em] lg:min-h-[auto]">
              I am a <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {text}
                <span className="h-full ml-1 align-middle border-r-4 border-purple-500 animate-cursor">&nbsp;</span>
              </span>
            </h1>

            <h2 className="text-2xl font-bold md:text-3xl text-slate-700 dark:text-slate-300 font-bengali">
              প্রযুক্তির সাথে, স্বপ্নের পথে
            </h2>
            
            <p className="max-w-lg mx-auto text-lg leading-relaxed text-slate-500 dark:text-slate-400 lg:mx-0">
              Turning ideas into reality with Python, AI, and Creative Coding.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
              
              {/* View Projects Button */}
              <a
                ref={projectsRef}
                href="#projects"
                onClick={handleProjectsClick}
                className="blue-glow relative flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 overflow-hidden font-bold rounded-full transition-all duration-300 hover:-translate-y-[6px] hover:scale-[1.05] active:scale-95 select-none group"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #6366f1, #8b5cf6, #2563eb)',
                  color: '#ffffff',
                  border: '2px solid rgba(99,102,241,0.7)',
                }}
              >
                <span className="pointer-events-none absolute -inset-[2px] rounded-full overflow-hidden z-0">
                  <span className="absolute rounded-full rotate-border-blue -inset-4"
                    style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(147,197,253,0.9) 80%, transparent 100%)' }}
                  />
                </span>
                <span className="blue-shimmer pointer-events-none absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent z-10 rounded-full" />
                {projectRipples.map(r => (
                  <span key={r.id} className="absolute z-20 rounded-full pointer-events-none ripple-circle bg-white/40"
                    style={{ width: 40, height: 40, left: r.x - 20, top: r.y - 20 }} />
                ))}
                <span className="absolute inset-0 z-10 overflow-hidden rounded-full pointer-events-none">
                  <span className="star-1 absolute left-[18%] bottom-3 text-blue-200 text-[9px]">★</span>
                  <span className="star-2 absolute left-[38%] bottom-2 text-white text-[7px]">✦</span>
                  <span className="star-3 absolute left-[60%] bottom-3 text-indigo-200 text-[9px]">★</span>
                  <span className="star-4 absolute left-[78%] bottom-2 text-white text-[7px]">✦</span>
                </span>
                <span className="relative z-30 flex items-center gap-3">
                  <span className="text-lg leading-none cup-bounce">🚀</span>
                  <span className="flex flex-col items-start leading-none gap-[2px]">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/60">Explore Work</span>
                    <span className="text-[15px] font-black tracking-wide text-white">View My Projects</span>
                  </span>
                  <ArrowRight size={20} className="arrow-float text-white/90" />
                </span>
              </a>

              {/* Buy Me a Coffee Button */}
              <a
                ref={coffeeRef}
                href="https://www.buymeacoffee.com/rahimsaroar"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCoffeeClick}
                className="gold-glow relative flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 overflow-hidden font-bold rounded-full transition-all duration-300 hover:-translate-y-[6px] hover:scale-[1.05] active:scale-95 select-none group"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #fb923c, #f59e0b)',
                  color: '#1a0a00',
                  border: '2px solid rgba(251,191,36,0.7)',
                }}
              >
                <span className="pointer-events-none absolute -inset-[2px] rounded-full overflow-hidden z-0">
                  <span className="absolute rounded-full rotate-border -inset-4"
                    style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(255,220,80,0.9) 80%, transparent 100%)' }}
                  />
                </span>
                <span className="coffee-shimmer pointer-events-none absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 rounded-full" />
                {ripples.map(r => (
                  <span key={r.id} className="absolute z-20 rounded-full pointer-events-none ripple-circle bg-white/40"
                    style={{ width: 40, height: 40, left: r.x - 20, top: r.y - 20 }} />
                ))}
                <span className="absolute inset-0 z-10 overflow-hidden rounded-full pointer-events-none">
                  <span className="star-1 absolute left-[18%] bottom-3 text-yellow-200 text-[9px]">★</span>
                  <span className="star-2 absolute left-[38%] bottom-2 text-white text-[7px]">✦</span>
                  <span className="star-3 absolute left-[60%] bottom-3 text-yellow-100 text-[9px]">★</span>
                  <span className="star-4 absolute left-[78%] bottom-2 text-white text-[7px]">✦</span>
                </span>
                <span className="relative z-30 flex items-center gap-3">
                  <span className="relative flex items-end justify-center w-7">
                    <span className="absolute -top-5 left-0 flex gap-[4px] items-end">
                      <span className="steam-1 w-[3px] h-4 rounded-full bg-amber-950/50" />
                      <span className="steam-2 w-[3px] h-5 rounded-full bg-amber-950/50" />
                      <span className="steam-3 w-[3px] h-4 rounded-full bg-amber-950/50" />
                    </span>
                    <Coffee size={22} className="cup-bounce text-amber-950 drop-shadow-md" />
                  </span>
                  <span className="flex flex-col items-start leading-none gap-[2px]">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-amber-950/60">Support My Work</span>
                    <span className="text-[15px] font-black tracking-wide text-amber-950">Buy Me a Coffee</span>
                  </span>
                  <span className="text-lg leading-none group-hover:animate-bounce">☕</span>
                </span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-6 pt-6 lg:justify-start text-slate-400">
              <a href="https://github.com/rahimmishu" target="_blank" className="transition-all hover:text-slate-900 dark:hover:text-white hover:scale-110"><Github size={24} /></a>
              <a href="https://www.facebook.com/rahimsaroar" target="_blank" className="transition-all hover:text-blue-600 hover:scale-110"><Facebook size={24} /></a>
              <a href="https://www.linkedin.com/in/rahim-saroar/" target="_blank" className="transition-all hover:text-blue-500 hover:scale-110"><Linkedin size={24} /></a>
              <a href="mailto:rahim@example.com" className="transition-all hover:text-red-500 hover:scale-110"><Mail size={24} /></a>
            </div>
          </div>

          {/* Right Content: Image */}
          <div className="relative z-10 flex justify-center w-full lg:w-1/2 lg:justify-end">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full blur-[90px] opacity-50"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(59,130,246,0.5) 50%, transparent 70%)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full blur-[60px] opacity-40 animate-pulse"
              style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, rgba(99,102,241,0.4) 60%, transparent 80%)' }} />

            <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">
              <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 border rounded-full ring-pulse-1 md:w-80 md:h-80 border-purple-400/40" />
              <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 border rounded-full ring-pulse-2 md:w-80 md:h-80 border-blue-400/30" />
              <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 border rounded-full ring-pulse-3 md:w-80 md:h-80 border-pink-400/20" />
            </div>

            <div className="absolute hidden pointer-events-none top-1/2 left-1/2 md:block">
              <span className="orbit-dot absolute w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
              <span className="orbit-dot-2 absolute w-2 h-2 -mt-1 -ml-1 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 shadow-[0_0_6px_rgba(236,72,153,0.9)]" />
              <span className="orbit-dot-r absolute w-2.5 h-2.5 -mt-1.5 -ml-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
            </div>

            <div className="relative z-20 photo-float">
              <Tilt3D className="relative w-64 md:w-80 lg:w-[400px] xl:w-[450px] aspect-[4/5] group">

                <span className="pointer-events-none absolute -inset-[3px] rounded-[64px] overflow-hidden z-0">
                  <span className="absolute rounded-full spin-border -inset-5"
                    style={{ background: 'conic-gradient(from 0deg, transparent 40%, rgba(139,92,246,1) 55%, rgba(59,130,246,1) 65%, transparent 80%)' }} />
                </span>
                <span className="pointer-events-none absolute -inset-[3px] rounded-[64px] overflow-hidden z-0">
                  <span className="absolute rounded-full spin-border-reverse -inset-5"
                    style={{ background: 'conic-gradient(from 90deg, transparent 50%, rgba(236,72,153,0.8) 65%, rgba(251,191,36,0.6) 75%, transparent 85%)' }} />
                </span>

                <div className="relative h-full w-full rounded-[60px] overflow-hidden border-[5px] border-white/10 shadow-[0_0_60px_rgba(139,92,246,0.4),0_30px_60px_rgba(0,0,0,0.5)] z-10">
                  <span className="photo-shimmer pointer-events-none absolute inset-0 w-[30%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

                  {/* ✅ FIX: Hero image — eager load করতে হবে, এটা LCP element!
                      loading="lazy" ছিল আগে — সেটাই lag-এর কারণ ছিল */}
                  <img
                    src="/1.jpg"
                    alt="Rahim Saroar Mishu"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="object-cover w-full h-full transition-transform duration-700 scale-105 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute z-20 text-xl text-yellow-300 corner-spark top-4 right-5 drop-shadow-lg">✦</span>
                  <span className="absolute z-20 text-xs text-blue-300 corner-spark top-8 right-10 drop-shadow" style={{ animationDelay: '0.7s' }}>★</span>
                </div>
              </Tilt3D>

              {/* Floating Badges */}
              <div className="absolute z-30 flex items-center gap-2 px-3 py-2 border shadow-xl badge-float-1 -top-4 -left-6 rounded-2xl backdrop-blur-md border-white/20"
                style={{ background: 'linear-gradient(135deg, rgba(30,30,60,0.85), rgba(60,20,90,0.85))' }}>
                <span className="text-base">💻</span>
                <span className="flex flex-col leading-none">
                  <span className="text-[9px] text-white/50 font-semibold uppercase tracking-widest">Role</span>
                  <span className="text-[12px] text-white font-bold">Full Stack Dev</span>
                </span>
              </div>

              <div className="absolute z-30 flex items-center gap-2 px-3 py-2 border shadow-xl badge-float-2 -bottom-4 -left-4 rounded-2xl backdrop-blur-md border-white/20"
                style={{ background: 'linear-gradient(135deg, rgba(20,40,30,0.85), rgba(10,80,50,0.85))' }}>
                <span className="text-base">🇧🇩</span>
                <span className="flex flex-col leading-none">
                  <span className="text-[9px] text-white/50 font-semibold uppercase tracking-widest">Based in</span>
                  <span className="text-[12px] text-white font-bold">Bangladesh</span>
                </span>
              </div>

              <div className="absolute z-30 flex items-center gap-2 px-3 py-2 -translate-y-1/2 border shadow-xl badge-float-3 top-1/2 -right-6 rounded-2xl backdrop-blur-md border-white/20"
                style={{ background: 'linear-gradient(135deg, rgba(40,20,10,0.85), rgba(90,50,10,0.85))' }}>
                <span className="text-base">🤖</span>
                <span className="flex flex-col leading-none">
                  <span className="text-[9px] text-white/50 font-semibold uppercase tracking-widest">Loves</span>
                  <span className="text-[12px] text-white font-bold">AI & Python</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;