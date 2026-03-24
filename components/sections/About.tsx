import React from 'react';
import { GraduationCap, Code2, Cpu, Sparkles, Brain, Rocket, MapPin, Zap } from 'lucide-react';

const aboutStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;900&display=swap');

  #about { font-family: 'Cabinet Grotesk', sans-serif; }

  /* Shimmer name */
  @keyframes shimmer-pan {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  .about-shimmer-name {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer-pan 5s linear infinite;
  }

  /* Floating badges */
  @keyframes float-a {
    0%, 100% { transform: translateY(0) rotate(-1deg); }
    50%       { transform: translateY(-12px) rotate(2deg); }
  }
  @keyframes float-b {
    0%, 100% { transform: translateY(0) rotate(1deg); }
    50%       { transform: translateY(-16px) rotate(-2deg); }
  }
  .about-badge-a { animation: float-a 4s ease-in-out infinite; }
  .about-badge-b { animation: float-b 5s ease-in-out infinite; animation-delay: -2.5s; }

  /* Rotating ring */
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  .about-ring { animation: spin-slow 12s linear infinite; }

  /* Orb pulse */
  @keyframes orb-pulse {
    0%, 100% { opacity: 0.12; transform: scale(1); }
    50%       { opacity: 0.22; transform: scale(1.08); }
  }
  .about-orb-1 { animation: orb-pulse 7s ease-in-out infinite; }
  .about-orb-2 { animation: orb-pulse 9s ease-in-out infinite; animation-delay: -4s; }

  /* CTA shine */
  .about-cta {
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .about-cta::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .about-cta:hover::after  { transform: translateX(100%); }
  .about-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,0,0,0.2); }

  /* Status dot */
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .about-dot { animation: blink 1.8s ease-in-out infinite; }

  /* Card hover */
  .about-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
  }
  .about-card:hover { transform: translateY(-3px); }

  /* Tech pill */
  .about-pill { transition: transform 0.2s ease, border-color 0.2s ease; }
  .about-pill:hover { transform: translateY(-2px) scale(1.05); }
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

const About: React.FC = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: aboutStyles }} />

      <section
        id="about"
        className="relative py-32 overflow-hidden transition-colors duration-500 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-black dark:via-zinc-950 dark:to-black"
      >

        {/* ── Background Glows ── */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="about-orb-1 absolute top-10 left-[-10%] w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[130px]" />
          <div className="about-orb-2 absolute bottom-10 right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.018] dark:opacity-[0.035]"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '70px 70px'
            }}
          />
        </div>

        <div className="container relative z-10 px-4 mx-auto md:px-8">

          {/* ── Section Label (above card) ── */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase border border-blue-200/70 dark:border-blue-800/50 rounded-full bg-blue-50/80 dark:bg-blue-900/15 backdrop-blur-sm">
              <Sparkles size={12} className="animate-pulse" />
              About Me
              <Sparkles size={12} className="animate-pulse" />
            </div>
          </div>

          {/* ── Main Card Container ── */}
          <div className="flex flex-col lg:flex-row items-center gap-16 p-8 md:p-12 lg:p-16 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-white/8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 dark:shadow-[0_0_60px_rgba(0,0,0,0.6)]">

            {/* ═══ Left: Image & Decor ═══ */}
            <div className="relative flex flex-col items-center justify-center w-full lg:w-1/3">

              {/* Decorative spinning ring */}
              <div className="about-ring absolute inset-0 m-auto w-[290px] h-[290px] md:w-[350px] md:h-[350px] rounded-full border border-dashed border-blue-400/20 dark:border-blue-500/15 pointer-events-none" />

              {/* Glow blob behind image */}
              <div className="absolute rounded-full opacity-25 pointer-events-none w-52 h-52 blur-3xl"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)' }}
              />

              <div className="relative group">
                {/* Image */}
                <div className="w-60 h-60 md:w-72 md:h-72 rounded-[1.75rem] overflow-hidden border-2 border-white/80 dark:border-zinc-800 shadow-2xl relative z-10 transition-all duration-500 group-hover:scale-[1.03] group-hover:rotate-1">
                  <img
                    src="./rahim-saroar-pic.png"
                    alt="Rahim Saroar Mishu"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-5 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:opacity-100">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-blue-300 uppercase">Innovator</span>
                    <span className="text-base font-black leading-tight text-white">Rahim Saroar</span>
                  </div>
                </div>

                {/* Floating Badge 1 — bottom right */}
                <div className="about-badge-a absolute z-20 -bottom-5 -right-5 flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700/80 rounded-2xl shadow-xl shadow-blue-100/60 dark:shadow-black/50">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                    <Code2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Top Skill</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white">Full-Stack Dev</p>
                  </div>
                </div>

                {/* Floating Badge 2 — top left */}
                <div className="about-badge-b absolute z-20 -top-5 -left-5 flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700/80 rounded-2xl shadow-xl shadow-purple-100/60 dark:shadow-black/50">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                    <Brain className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Passion</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white">AI & Robotics</p>
                  </div>
                </div>
              </div>

              {/* Location + Open to Work */}
              <div className="mt-10 flex items-center gap-2.5 text-xs text-slate-400">
                <MapPin size={12} className="text-blue-500" />
                <span>Bangladesh 🇧🇩</span>
                <span className="w-px h-3 bg-slate-300 dark:bg-zinc-700" />
                <span className="inline-block w-2 h-2 rounded-full about-dot bg-emerald-400" />
                <span className="font-bold text-emerald-500 dark:text-emerald-400">Open to Work</span>
              </div>
            </div>

            {/* ═══ Right: Content ═══ */}
            <div className="w-full space-y-6 text-center lg:w-2/3 lg:text-left">

              {/* Name */}
              <div>
                <h2 className="text-4xl font-black leading-tight md:text-5xl text-slate-900 dark:text-white">
                  Rahim Saroar{' '}
                  <span className="about-shimmer-name">Mishu</span>
                </h2>
                <p className="flex items-center justify-center gap-2 mt-3 text-base font-medium lg:justify-start text-slate-500 dark:text-slate-400">
                  <Zap size={14} className="text-yellow-400 shrink-0" />
                  11th Grade Science Student & Future Tech Leader 🚀
                </p>
              </div>

              {/* Description */}
              <div className="space-y-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  Hi, I'm <strong className="text-slate-900 dark:text-white">Rahim</strong>, a 19-year-old innovator from Bangladesh. My world revolves around lines of code and circuits. I don't just learn technology; I live it.
                </p>
                <p>
                  From building <span className="font-bold text-blue-500">AI Assistants</span> to crafting <span className="font-bold text-purple-500">IoT Gadgets</span>, I transform complex ideas into reality using Python, JavaScript, and C++.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: '15+', label: 'Projects' },
                  { val: '3+',  label: 'Yrs Coding' },
                  { val: '5+',  label: 'Tech Domains' },
                ].map((s, i) => (
                  <div key={i} className="px-2 py-3 text-center border rounded-2xl border-slate-200/80 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/50">
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{s.val}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-2.5 text-left">Tech Stack</p>
                <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                  {techStack.map((t, i) => (
                    <span key={i}
                      className="about-pill inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 cursor-default select-none"
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div className="p-5 bg-white border about-card group dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-blue-400/50 dark:hover:border-blue-500/40 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-none">
                  <div className="flex items-center gap-4">
                    <div className="p-3 text-blue-600 transition-transform duration-300 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl group-hover:scale-110 group-hover:rotate-3">
                      <GraduationCap size={22} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Education</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">11th Grade · Science</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white border about-card group dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:bg-purple-50/40 dark:hover:bg-purple-900/10 hover:shadow-lg hover:shadow-purple-100/50 dark:hover:shadow-none">
                  <div className="flex items-center gap-4">
                    <div className="p-3 text-purple-600 transition-transform duration-300 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl group-hover:scale-110 group-hover:rotate-3">
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
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
                <a href="#contact"
                  className="about-cta inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-black rounded-2xl"
                >
                  Let's Collaborate <Rocket size={15} />
                </a>
                <a href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-zinc-700 transition-all duration-300 hover:border-slate-400 dark:hover:border-zinc-500 hover:text-slate-900 dark:hover:text-white"
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

export default About;