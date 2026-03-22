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
    <section
      id="home"
      className="relative flex items-center min-h-screen pt-24 pb-12 overflow-hidden transition-colors duration-300 bg-white dark:bg-black"
      // ✅ SEO: Section-level Person microdata — Google Knowledge Panel এর জন্য
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Hidden microdata — Google কে explicitly জানানো */}
      <meta itemProp="name"        content="Rahim Saroar Mishu" />
      <meta itemProp="alternateName" content="Rahim Saroar" />
      <meta itemProp="jobTitle"    content="Full Stack Developer, AI Enthusiast, Content Creator" />
      <meta itemProp="url"         content="https://rahim-saroar.vercel.app" />
      <link itemProp="sameAs"      href="https://www.facebook.com/rahimsaroar" />
      <link itemProp="sameAs"      href="https://www.linkedin.com/in/rahim-saroar/" />
      <link itemProp="sameAs"      href="https://github.com/rahimmishu" />
      
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
        .gradient-text {
          background: linear-gradient(270deg, #8b5cf6, #3b82f6, #ec4899, #8b5cf6);
          background-size: 300% 300%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes photo-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-8px) rotate(0.5deg); }
          66%      { transform: translateY(-4px) rotate(-0.3deg); }
        }
        .photo-float { animation: photo-float 6s ease-in-out infinite; }

        @keyframes spin-border {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-border         { animation: spin-border 3s linear infinite; }
        .spin-border-reverse { animation: spin-border 5s linear infinite reverse; }

        @keyframes ring-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
          50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 0.3; }
        }
        .ring-pulse-1 { animation: ring-pulse 3s ease-in-out infinite 0s; }
        .ring-pulse-2 { animation: ring-pulse 3s ease-in-out infinite 1s; }
        .ring-pulse-3 { animation: ring-pulse 3s ease-in-out infinite 2s; }

        @keyframes orbit {
          0%   { transform: rotate(0deg)   translateX(145px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(145px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          0%   { transform: rotate(120deg) translateX(160px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateX(160px) rotate(-480deg); }
        }
        @keyframes orbit-r {
          0%   { transform: rotate(240deg) translateX(130px) rotate(-240deg); }
          100% { transform: rotate(-120deg) translateX(130px) rotate(120deg); }
        }
        .orbit-dot   { animation: orbit   7s linear infinite; }
        .orbit-dot-2 { animation: orbit2  9s linear infinite; }
        .orbit-dot-r { animation: orbit-r 5s linear infinite reverse; }

        @keyframes corner-spark {
          0%, 100% { transform: scale(1) rotate(0deg);   opacity: 0.9; }
          50%      { transform: scale(1.4) rotate(20deg); opacity: 0.5; }
        }
        .corner-spark { animation: corner-spark 2.5s ease-in-out infinite; }

        @keyframes badge-float-1 {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes badge-float-2 {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes badge-float-3 {
          0%, 100% { transform: translateY(-50%) translateX(0px); }
          50%      { transform: translateY(-50%) translateX(5px); }
        }
        .badge-float-1 { animation: badge-float-1 4s ease-in-out infinite; }
        .badge-float-2 { animation: badge-float-2 4s ease-in-out infinite 1.5s; }
        .badge-float-3 { animation: badge-float-3 4s ease-in-out infinite 0.8s; }

        @keyframes photo-shimmer {
          0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(220%)  skewX(-15deg); opacity: 0; }
        }
        .photo-shimmer { animation: photo-shimmer 4s ease-in-out infinite 2s; }
      `}</style>

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full w-96 h-96 -top-40 -right-40 bg-purple-500/10 animate-blob blur-3xl" />
        <div className="absolute rounded-full w-96 h-96 top-40 -left-40 bg-blue-500/10 animate-blob animation-delay-2000 blur-3xl" />
        <div className="absolute rounded-full w-80 h-80 bottom-20 right-20 bg-pink-500/8 animate-blob animation-delay-4000 blur-3xl" />
      </div>

      <div className="container relative z-10 px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          
          {/* Left Content */}
          <div className="flex flex-col items-center w-full gap-6 text-center lg:w-1/2 lg:items-start lg:text-left">

            {/* Badge */}
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 border border-purple-200 rounded-full dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
              <Sparkles size={16} className="text-purple-500" />
              <span>Available for new projects</span>
            </div>

            {/* Main Heading — ✅ SEO: h1 এ নাম explicitly আছে */}
            <div>
              <p className="mb-2 text-base font-medium tracking-widest uppercase text-slate-500 dark:text-neutral-400">
                Hello, I'm
              </p>
              <h1 className="text-5xl font-black leading-tight md:text-6xl xl:text-7xl text-slate-900 dark:text-white font-signature">
                Rahim Saroar
                <span className="block gradient-text">Mishu</span>
              </h1>
            </div>

            {/* Typewriter */}
            <div className="flex items-center h-10 gap-3 text-xl font-bold md:text-2xl text-slate-700 dark:text-neutral-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{text}</span>
              <span className="w-0.5 h-7 bg-purple-500 animate-cursor" />
            </div>

            {/* Description */}
            <p className="max-w-lg text-base leading-relaxed md:text-lg text-slate-600 dark:text-neutral-400">
              A passionate <strong>Full Stack Developer</strong> & <strong>AI Enthusiast</strong> from{' '}
              <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span itemProp="addressLocality">Joypurhat</span>,{' '}
                <span itemProp="addressCountry">Bangladesh</span>
              </span>. Building the future, one line of code at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                ref={projectsRef}
                href="#projects"
                onClick={handleProjectsClick}
                className="relative flex items-center gap-2 px-8 py-4 overflow-hidden font-bold text-white transition-all rounded-full shadow-lg group bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/25 hover:scale-105"
              >
                {projectRipples.map(r => (
                  <span key={r.id} className="absolute z-20 rounded-full pointer-events-none ripple-circle bg-white/40"
                    style={{ width: 40, height: 40, left: r.x - 20, top: r.y - 20 }} />
                ))}
                <span className="relative z-10">View My Work</span>
                <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </a>

              {/* Buy Me a Coffee — unchanged */}
              <a
                ref={coffeeRef}
                href="https://www.buymeacoffee.com/rahimsaroar"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCoffeeClick}
                className="relative flex items-center gap-2 px-6 py-4 overflow-hidden font-bold transition-all rounded-full group gold-glow hover:scale-105"
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
              <a href="https://github.com/rahimmishu" target="_blank" rel="noopener noreferrer" aria-label="Rahim Saroar Mishu on GitHub" className="transition-all hover:text-slate-900 dark:hover:text-white hover:scale-110"><Github size={24} /></a>
              <a href="https://www.facebook.com/rahimsaroar" target="_blank" rel="noopener noreferrer" aria-label="Rahim Saroar Mishu on Facebook" className="transition-all hover:text-blue-600 hover:scale-110"><Facebook size={24} /></a>
              <a href="https://www.linkedin.com/in/rahim-saroar/" target="_blank" rel="noopener noreferrer" aria-label="Rahim Saroar Mishu on LinkedIn" className="transition-all hover:text-blue-500 hover:scale-110"><Linkedin size={24} /></a>
              <a href="mailto:rahim@example.com" aria-label="Email Rahim Saroar Mishu" className="transition-all hover:text-red-500 hover:scale-110"><Mail size={24} /></a>
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

                  {/* ✅ SEO FIXES:
                      - title="..." added → Google Images এ hover text হিসেবে দেখায়
                      - itemProp="image" → Person schema র সাথে link হয়
                      - width/height → CLS (layout shift) ঠেকায়, Core Web Vitals ভালো হয় */}
                  <img
                    src="/1.jpg"
                    alt="Rahim Saroar Mishu – Full Stack Developer & AI Enthusiast from Joypurhat, Bangladesh"
                    title="Rahim Saroar Mishu – Full Stack Developer, AI Enthusiast & Content Creator from Bangladesh"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    itemProp="image"
                    width={800}
                    height={1000}
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