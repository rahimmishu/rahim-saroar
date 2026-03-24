// 📱 LiteAbout.tsx — Mobile Lite Version of About.tsx
// সরানো হয়েছে: spinning ring, orb-pulse animations, floating badge animations,
//              shimmer-pan (animated gradient), blink dot, CTA shimmer sweep,
//              backdrop-blur-2xl, heavy box-shadows, group-hover scale/rotate effects
// রাখা হয়েছে: same visual identity, static gradient on name, lite fade-up on load,
//              static glows (reduced blur), active:scale-95 touch feedback

import React from 'react';
import { GraduationCap, Code2, Cpu, Sparkles, Brain, Rocket, MapPin, Zap } from 'lucide-react';

const liteAboutStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;900&display=swap');

  #about { font-family: 'Cabinet Grotesk', sans-serif; }

  /* ✅ Static gradient name — no animation, GPU-free */
  .lite-about-name {
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ✅ Lite fade-up — একবারই চলে, continuous নয় */
  @keyframes lite-about-fade {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lab-fade-1 { animation: lite-about-fade 0.55s ease-out 0.05s both; }
  .lab-fade-2 { animation: lite-about-fade 0.55s ease-out 0.15s both; }
  .lab-fade-3 { animation: lite-about-fade 0.55s ease-out 0.25s both; }
  .lab-fade-4 { animation: lite-about-fade 0.55s ease-out 0.35s both; }
  .lab-fade-5 { animation: lite-about-fade 0.55s ease-out 0.45s both; }

  /* ✅ CTA button — শুধু transform, কোনো pseudo-element sweep নেই */
  .lite-about-cta {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .lite-about-cta:active { transform: scale(0.96); }

  /* ✅ Minimal card style — no hover animations on mobile */
  .lite-about-card {
    transition: border-color 0.2s ease;
  }
`;

const techStack = [
  { name: 'Python',     color: '#4B8BBE' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'C++',        color: '#00599C' },
  { name: 'React',      color: '#61DAFB' },
  { name: 'Arduino',    color: '#00979D' },
  { name: 'ESP32',      color: '#E7352C' },
  { name: 'AI / ML',    color: '#a78bfa' },
];

const LiteAbout: React.FC = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: liteAboutStyles }} />

      <section
        id="about"
        className="relative py-20 overflow-hidden transition-colors duration-300 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-black dark:via-zinc-950 dark:to-black"
      >

        {/* 🟣 Background Glows — Static, reduced blur (blur-[50px] vs blur-[130px]) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* 🚫 REMOVED: about-orb-1/2 pulse animation — static opacity এখন */}
          <div
            className="absolute top-10 left-[-10%] w-[400px] h-[400px] rounded-full opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(50px)' }}
          />
          <div
            className="absolute bottom-10 right-[-10%] w-[350px] h-[350px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(50px)' }}
          />
          {/* ✅ Grid lines — pure CSS, no GPU cost */}
          <div
            className="absolute inset-0 opacity-[0.018] dark:opacity-[0.035]"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '70px 70px',
            }}
          />
        </div>

        <div className="container relative z-10 px-4 mx-auto md:px-8">

          {/* ── Section Label ── */}
          {/* 🚫 REMOVED: backdrop-blur-sm, animate-pulse on Sparkles */}
          <div className="flex justify-center mb-8 lab-fade-1">
            <div className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase border border-blue-200/70 dark:border-blue-800/50 rounded-full bg-blue-50/80 dark:bg-blue-900/15">
              <Sparkles size={12} />
              About Me
              <Sparkles size={12} />
            </div>
          </div>

          {/* ── Main Card Container ── */}
          {/* 🚫 REMOVED: backdrop-blur-2xl → background solid করা হয়েছে */}
          {/* 🚫 REMOVED: shadow-2xl heavy shadow → lighter shadow */}
          <div className="flex flex-col lg:flex-row items-center gap-12 p-6 md:p-10 lg:p-14 bg-white/90 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/8 rounded-[2rem] shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)]">

            {/* ═══ Left: Image & Decor ═══ */}
            <div className="relative flex flex-col items-center justify-center w-full lg:w-1/3 lab-fade-2">

              {/* 🚫 REMOVED: about-ring spin-slow animation → static dashed ring */}
              <div className="absolute inset-0 m-auto w-[260px] h-[260px] md:w-[310px] md:h-[310px] rounded-full border border-dashed border-blue-400/20 dark:border-blue-500/15 pointer-events-none" />

              {/* 🚫 REDUCED: blur-3xl → blur-2xl, opacity কমানো */}
              <div
                className="absolute rounded-full pointer-events-none opacity-20 w-44 h-44"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                  filter: 'blur(32px)',
                }}
              />

              <div className="relative">
                {/* Image wrapper — 🚫 REMOVED: group-hover:scale, group-hover:rotate */}
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-[1.75rem] overflow-hidden border-2 border-white/80 dark:border-zinc-800 shadow-xl relative z-10">
                  <img
                    src="./rahim-saroar-pic.png"
                    alt="Rahim Saroar Mishu"
                    loading="lazy"
                    className="object-cover w-full h-full"
                  />
                  {/* Static overlay — সবসময় হালকা visible (hover নেই mobile এ) */}
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-4 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                    <span className="text-[9px] font-bold tracking-[0.25em] text-blue-300 uppercase">Innovator</span>
                    <span className="text-sm font-black leading-tight text-white">Rahim Saroar</span>
                  </div>
                </div>

                {/* Badge 1 — Bottom Right */}
                {/* 🚫 REMOVED: about-badge-a float animation → static */}
                <div className="absolute z-20 -bottom-4 -right-4 flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700/80 rounded-2xl shadow-lg">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                    <Code2 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-medium">Top Skill</p>
                    <p className="text-[11px] font-black text-slate-800 dark:text-white">Full-Stack Dev</p>
                  </div>
                </div>

                {/* Badge 2 — Top Left */}
                {/* 🚫 REMOVED: about-badge-b float animation → static */}
                <div className="absolute z-20 -top-4 -left-4 flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700/80 rounded-2xl shadow-lg">
                  <div className="p-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                    <Brain className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-medium">Passion</p>
                    <p className="text-[11px] font-black text-slate-800 dark:text-white">AI & Robotics</p>
                  </div>
                </div>
              </div>

              {/* Location + Open to Work */}
              {/* 🚫 REMOVED: about-dot blink animation → static green dot */}
              <div className="mt-9 flex items-center gap-2.5 text-xs text-slate-400">
                <MapPin size={12} className="text-blue-500 shrink-0" />
                <span>Bangladesh 🇧🇩</span>
                <span className="w-px h-3 bg-slate-300 dark:bg-zinc-700" />
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-emerald-500 dark:text-emerald-400">Open to Work</span>
              </div>
            </div>

            {/* ═══ Right: Content ═══ */}
            <div className="w-full space-y-5 text-center lg:w-2/3 lg:text-left">

              {/* Name */}
              {/* 🚫 REMOVED: about-shimmer-name shimmer-pan animation → static gradient */}
              <div className="lab-fade-3">
                <h2 className="text-4xl font-black leading-tight md:text-5xl text-slate-900 dark:text-white">
                  Rahim Saroar{' '}
                  <span className="lite-about-name">Mishu</span>
                </h2>
                <p className="flex items-center justify-center gap-2 mt-3 text-base font-medium lg:justify-start text-slate-500 dark:text-slate-400">
                  <Zap size={14} className="text-yellow-400 shrink-0" />
                  11th Grade Science Student & Future Tech Leader 🚀
                </p>
              </div>

              {/* Description */}
              <div className="space-y-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 lab-fade-3">
                <p>
                  Hi, I'm <strong className="text-slate-900 dark:text-white">Rahim</strong>, a 19-year-old innovator from Bangladesh. My world revolves around lines of code and circuits. I don't just learn technology; I live it.
                </p>
                <p>
                  From building <span className="font-bold text-blue-500">AI Assistants</span> to crafting <span className="font-bold text-purple-500">IoT Gadgets</span>, I transform complex ideas into reality using Python, JavaScript, and C++.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 lab-fade-4">
                {[
                  { val: '15+', label: 'Projects' },
                  { val: '3+',  label: 'Yrs Coding' },
                  { val: '5+',  label: 'Tech Domains' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="px-2 py-3 text-center border rounded-2xl border-slate-200/80 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/50"
                  >
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{s.val}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              {/* 🚫 REMOVED: about-pill hover scale → plain pills */}
              <div className="lab-fade-4">
                <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-2.5 text-left">Tech Stack</p>
                <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                  {techStack.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 select-none"
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info Cards */}
              {/* 🚫 REMOVED: about-card hover transform, group-hover:scale/rotate on icons */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lab-fade-5">

                <div className="p-5 bg-white border dark:bg-zinc-900/50 lite-about-card border-slate-200 dark:border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
                      <GraduationCap size={22} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Education</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">11th Grade · Science</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white border dark:bg-zinc-900/50 lite-about-card border-slate-200 dark:border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl">
                      <Cpu size={22} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Hardware & IoT</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Arduino, ESP32, Robotics</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* CTA Buttons */}
              {/* 🚫 REMOVED: about-cta::after shimmer sweep pseudo-element → active:scale-95 শুধু */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start lab-fade-5">
                <a
                  href="#contact"
                  className="lite-about-cta inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-black rounded-2xl active:scale-95"
                >
                  Let's Collaborate <Rocket size={15} />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-zinc-700 active:scale-95 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Projects →
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LiteAbout;