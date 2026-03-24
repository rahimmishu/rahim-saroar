import React, { useState, useEffect } from 'react';
import { 
  X, Calculator, Zap, RotateCcw, Hand, LayoutGrid, 
  Swords, Gift, Wifi, CloudSun, Cake, Bird, TrendingUp, Brain, Gamepad2,
  GraduationCap
} from 'lucide-react';

import PokemonGame from './PokemonGame';
import LuckRoyale from './LuckRoyale';
import SpeedTest from './SpeedTest';
import WeatherApp from './WeatherApp';
import FocusTimer from './FocusTimer';
import TicTacToe from './TicTacToe';
import MemoryGame from './MemoryGame';
import GpaCalculator from './GpaCalculator'; 


// ==========================================
// GLOBAL PREMIUM STYLES
// ==========================================
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  .tools-root { font-family: 'Syne', sans-serif; }
  .tools-mono { font-family: 'JetBrains Mono', monospace; }

  /* Aurora background orbs */
  @keyframes aurora-drift-1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(80px, -60px) scale(1.1); }
    66%       { transform: translate(-50px, 40px) scale(0.92); }
  }
  @keyframes aurora-drift-2 {
    0%, 100% { transform: translate(0, 0) scale(1.05); }
    33%       { transform: translate(-90px, 60px) scale(0.88); }
    66%       { transform: translate(70px, -40px) scale(1.18); }
  }
  @keyframes aurora-drift-3 {
    0%, 100% { transform: translate(0, 0) scale(0.9); }
    50%       { transform: translate(40px, -80px) scale(1.1); }
  }
  .aurora-1 { animation: aurora-drift-1 14s ease-in-out infinite; }
  .aurora-2 { animation: aurora-drift-2 18s ease-in-out infinite; }
  .aurora-3 { animation: aurora-drift-3 22s ease-in-out infinite; }

  /* Dot grid */
  .dot-grid-bg {
    background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
    background-size: 26px 26px;
  }

  /* Shimmer title */
  @keyframes shimmer-sweep {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  .shimmer-title {
    background: linear-gradient(100deg,
      #ffffff 0%,
      #a78bfa 20%,
      #ffffff 36%,
      #60a5fa 52%,
      #ffffff 68%,
      #f472b6 84%,
      #ffffff 100%
    );
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer-sweep 6s linear infinite;
  }

  /* Badge pulse dot */
  @keyframes badge-blink {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5); }
    50%       { opacity: 0.6; box-shadow: 0 0 0 5px rgba(52, 211, 153, 0); }
  }
  .badge-dot { animation: badge-blink 2.2s ease-in-out infinite; }

  /* Card stagger entrance */
  @keyframes card-rise {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .app-card {
    animation: card-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--stagger, 0ms);
  }

  /* Card inner glow on hover */
  .card-ambient {
    opacity: 0;
    transition: opacity 0.45s ease;
  }
  .app-card:hover .card-ambient { opacity: 1; }

  /* Top highlight line */
  .card-top-line {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
  }

  /* Icon 3D shine */
  .icon-glass::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Arrow nudge */
  @keyframes arrow-nudge {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(3px); }
  }
  .app-card:hover .arrow-icon { animation: arrow-nudge 0.8s ease-in-out infinite; }

  /* Modal fade */
  @keyframes modal-in {
    from { opacity: 0; backdrop-filter: blur(0px); }
    to   { opacity: 1; backdrop-filter: blur(20px); }
  }
  .modal-enter { animation: modal-in 0.35s ease forwards; }

  /* RPS Animations */
  @keyframes shakePlayer { 0%, 100% { transform: scaleX(-1) translateY(0) rotate(-90deg); } 50% { transform: scaleX(-1) translateY(-30px) rotate(-70deg); } }
  @keyframes shakeCPU    { 0%, 100% { transform: translateY(0) rotate(-90deg); }              50% { transform: translateY(-30px) rotate(-70deg); } }
  .shake-p { animation: shakePlayer 0.4s ease infinite; }
  .shake-c { animation: shakeCPU 0.4s ease infinite; }
  .hand-default-p { transform: scaleX(-1) rotate(-90deg); }
  .hand-default-c { transform: rotate(-90deg); }
  @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
  .vs-pop { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

  /* Horizontal rule shimmer */
  @keyframes rule-glow {
    0%, 100% { opacity: 0.2; }
    50%       { opacity: 0.55; }
  }
  .rule-shimmer { animation: rule-glow 3s ease-in-out infinite; }

  /* Close button spin */
  .close-btn:hover svg { transform: rotate(90deg); transition: transform 0.3s ease; }
`;

// ==========================================
// 1. ROCK PAPER SCISSORS GAME COMPONENT
// ==========================================
const RockPaperScissorsGame: React.FC = () => {
  const [pScore, setPScore] = useState(0);
  const [cScore, setCScore] = useState(0);
  const [status, setStatus] = useState("CHOOSE YOUR WEAPON");
  const [pHand, setPHand] = useState("✊");
  const [cHand, setCHand] = useState("✊");
  const [isShaking, setIsShaking] = useState(false);
  const [showVs, setShowVs] = useState(false);
  const [glowColor, setGlowColor] = useState("transparent");

  const hands: { [key: string]: string } = { rock: '✊', paper: '✋', scissors: '✌️' };

  useEffect(() => {
    const savedP = localStorage.getItem('pScore');
    const savedC = localStorage.getItem('cScore');
    if (savedP) setPScore(parseInt(savedP));
    if (savedC) setCScore(parseInt(savedC));
  }, []);

  const resetGame = () => {
    setPScore(0); setCScore(0);
    localStorage.setItem('pScore', '0'); localStorage.setItem('cScore', '0');
    setStatus("SCORE RESET"); setPHand("✊"); setCHand("✊"); setGlowColor("transparent"); setShowVs(false);
  };

  const playGame = (userChoice: string) => {
    if (isShaking) return;
    setPHand("✊"); setCHand("✊"); setStatus("WAIT...");
    setIsShaking(true); setShowVs(false); setGlowColor("transparent");

    setTimeout(() => {
      setIsShaking(false); setShowVs(true);
      const choices = ['rock', 'paper', 'scissors'];
      const cpuChoice = choices[Math.floor(Math.random() * 3)];
      setPHand(hands[userChoice]); setCHand(hands[cpuChoice]);

      if (userChoice === cpuChoice) {
        setStatus("DRAW!"); setGlowColor("rgba(148, 163, 184, 0.35)");
      } else if (
        (userChoice === 'rock' && cpuChoice === 'scissors') ||
        (userChoice === 'paper' && cpuChoice === 'rock') ||
        (userChoice === 'scissors' && cpuChoice === 'paper')
      ) {
        setStatus("YOU WIN!");
        const newScore = pScore + 1; setPScore(newScore);
        localStorage.setItem('pScore', newScore.toString());
        setGlowColor("rgba(16, 185, 129, 0.4)");
      } else {
        setStatus("CPU WINS!");
        const newScore = cScore + 1; setCScore(newScore);
        localStorage.setItem('cScore', newScore.toString());
        setGlowColor("rgba(239, 68, 68, 0.4)");
      }
      setTimeout(() => setGlowColor("transparent"), 800);
    }, 700);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full tools-root">
      <div
        className="relative bg-neutral-950 p-8 rounded-[40px] w-full max-w-[400px] text-center"
        style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 -z-10 rounded-[40px] transition-all duration-500 pointer-events-none blur-2xl opacity-60"
          style={{ background: glowColor }}
        />
        {/* Top line */}
        <div className="absolute top-0 h-px left-8 right-8 card-top-line" />

        {/* Score */}
        <div className="flex justify-between p-4 mb-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-1/2 text-center" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[9px] font-bold tracking-[0.2em] text-white/30 tools-mono">PLAYER</div>
            <div className="text-3xl font-black text-white">{pScore}</div>
          </div>
          <div className="w-1/2 text-center">
            <div className="text-[9px] font-bold tracking-[0.2em] text-white/30 tools-mono">CPU</div>
            <div className="text-3xl font-black text-white">{cScore}</div>
          </div>
        </div>

        {/* Arena */}
        <div className="flex justify-between items-center py-8 min-h-[150px] relative">
          <div className={`text-[70px] leading-none ${isShaking ? 'shake-p' : 'hand-default-p'}`}>{pHand}</div>
          {showVs && (
            <div className="absolute z-10 flex items-center justify-center w-10 h-10 text-[11px] font-black text-white -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2 vs-pop" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>
              VS
            </div>
          )}
          <div className={`text-[70px] leading-none ${isShaking ? 'shake-c' : 'hand-default-c'}`}>{cHand}</div>
        </div>

        <div className="font-black text-white mb-8 text-lg min-h-[28px] tracking-[0.15em] tools-mono">{status}</div>

        <div className="grid grid-cols-3 gap-3">
          {[{id:'rock',emoji:'✊',label:'ROCK'},{id:'paper',emoji:'✋',label:'PAPER'},{id:'scissors',emoji:'✌️',label:'SCISSORS'}].map((btn) => (
            <button
              key={btn.id}
              onClick={() => playGame(btn.id)}
              disabled={isShaking}
              className="p-3 transition-all duration-200 group rounded-2xl hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <span className="block mb-1 text-2xl transition-transform group-hover:scale-110">{btn.emoji}</span>
              <span className="text-[9px] font-bold tracking-[0.18em] text-white/30 group-hover:text-indigo-400 transition-colors tools-mono">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={resetGame} className="flex items-center gap-2 mt-8 text-[11px] font-bold transition-colors text-white/20 hover:text-red-400 tools-mono tracking-widest">
        <RotateCcw size={11} /> RESET SCORE
      </button>
    </div>
  );
};

// ==========================================
// 2. MAIN TOOLS (APP LAUNCHER) COMPONENT
// ==========================================
const Tools: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const apps = [
    {
      id: 'rps',
      name: 'RPS Game',
      icon: <Hand className="text-white rotate-90 drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      glow: 'rgba(99,102,241,0.35)',
      description: 'Rock Paper Scissors'
    },
    {
      id: 'gpa-calc',
      name: 'GPA Scientific',
      icon: <GraduationCap className="text-white drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600',
      glow: 'rgba(16,185,129,0.35)',
      description: 'HSC & Varsity CGPA'
    },
    {
      id: 'pokemon',
      name: 'PokéBattle',
      icon: <Swords className="text-white drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
      glow: 'rgba(251,146,60,0.35)',
      description: 'Turn-based RPG Battle'
    },
    {
      id: 'luck-royale',
      name: 'Luck Royale',
      icon: <Gift className="text-white drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600',
      glow: 'rgba(20,184,166,0.35)',
      description: 'Spin & Win Rewards'
    },
    {
      id: 'speed-test',
      name: 'SpeedFlow',
      icon: <Wifi className="text-white drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
      glow: 'rgba(6,182,212,0.35)',
      description: 'Check Internet Speed'
    },
    {
      id: 'weather',
      name: 'Weather',
      icon: <CloudSun className="text-white drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-sky-400 via-blue-500 to-violet-600',
      glow: 'rgba(56,189,248,0.35)',
      description: 'Live Forecast'
    },
    {
      id: 'focus',
      name: 'Focus Timer',
      icon: <Zap className="text-white drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500',
      glow: 'rgba(59,130,246,0.35)',
      description: 'Pomodoro Clock'
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      icon: <LayoutGrid className="text-white drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700',
      glow: 'rgba(124,58,237,0.35)',
      description: 'Cyber Style X-O Game'
    },
    {
      id: 'memory',
      name: 'Memory Game',
      icon: <Brain className="text-white drop-shadow-md" size={30} />,
      color: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500',
      glow: 'rgba(236,72,153,0.35)',
      description: 'Find the Masks'
    }
  ];

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'rps':         return <RockPaperScissorsGame />;
      case 'gpa-calc':   return <GpaCalculator />;
      case 'pokemon':    return <PokemonGame />;
      case 'luck-royale':return <LuckRoyale onClose={() => setActiveApp(null)} />;
      case 'speed-test': return <SpeedTest onClose={() => setActiveApp(null)} />;
      case 'weather':    return <WeatherApp onClose={() => setActiveApp(null)} />;
      case 'focus':      return <FocusTimer onClose={() => setActiveApp(null)} />;
      case 'tictactoe':  return <TicTacToe onClose={() => setActiveApp(null)} />;
      case 'memory':     return <MemoryGame onClose={() => setActiveApp(null)} />;
      default:           return null;
    }
  };

  return (
    <section
      id="tools"
      className="tools-root relative flex flex-col items-center justify-center min-h-screen py-28 overflow-hidden bg-[#050507]"
    >
      {/* Inject all premium styles */}
      <style>{PREMIUM_STYLES}</style>

      {/* ── DOT GRID ── */}
      <div className="absolute inset-0 pointer-events-none dot-grid-bg" />

      {/* ── AURORA ORBS ── */}
      <div className="aurora-1 absolute top-[-10%] left-[-5%] w-[55vw] h-[55vw] max-w-[680px] max-h-[680px] rounded-full bg-blue-700/10 blur-[160px] pointer-events-none" />
      <div className="aurora-2 absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[620px] max-h-[620px] rounded-full bg-purple-700/10 blur-[160px] pointer-events-none" />
      <div className="aurora-3 absolute top-[40%] right-[20%] w-[30vw] h-[30vw] max-w-[380px] max-h-[380px] rounded-full bg-rose-700/8 blur-[130px] pointer-events-none" />

      {/* =========================================
              FULLSCREEN GAME MODE
          ========================================= */}
      {activeApp ? (
        <div className="modal-enter fixed inset-0 z-[9999] flex flex-col" style={{ background: 'rgba(5,5,7,0.97)', backdropFilter: 'blur(24px)' }}>
          {/* Close button */}
          <div className="absolute z-50 top-6 right-6">
            <button
              onClick={() => setActiveApp(null)}
              className="close-btn group flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300 tools-mono text-xs tracking-[0.18em] font-medium"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.45)';
                e.currentTarget.style.color = 'rgba(239,68,68,0.9)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              <X size={15} />
              CLOSE
            </button>
          </div>

          {/* App content */}
          <div className="flex items-center justify-center flex-grow w-full h-full p-4 overflow-auto">
            {renderActiveApp()}
          </div>
        </div>

      ) : (
        /* =========================================
                APP GRID (LAUNCHER)
            ========================================= */
        <div className="container relative z-10 px-4 mx-auto">

          {/* ── HEADER ── */}
          <div className="mb-20 text-center">

            {/* Live badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[11px] tracking-[0.22em] mb-10 tools-mono font-medium"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.38)'
              }}
            >
              <span className="badge-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              TOOLS &amp; GAMES
            </div>

            {/* Big shimmer title */}
            <h2 className="shimmer-title text-[clamp(3.5rem,10vw,7.5rem)] font-black tracking-tighter leading-[0.9] mb-7 select-none">
              Playground
            </h2>

            {/* Subtitle */}
            <p className="tools-mono max-w-sm mx-auto text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.28)' }}>
              A curated collection of tools, games &amp; experiments.
              <br />
              Click any tile to launch full screen.
            </p>

            {/* Decorative rule */}
            <div className="flex items-center gap-3 max-w-[160px] mx-auto mt-10 rule-shimmer">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))' }} />
              <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
            </div>
          </div>

          {/* ── APP GRID ── */}
          <div className="grid max-w-4xl grid-cols-2 gap-4 mx-auto md:grid-cols-4">
            {apps.map((app, index) => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className="relative flex flex-col items-start p-5 overflow-hidden text-left transition-all duration-300 app-card group rounded-2xl hover:-translate-y-2"
                style={{
                  '--stagger': `${index * 55}ms`,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(10px)',
                } as React.CSSProperties}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.055)';
                  e.currentTarget.style.boxShadow = `0 20px 60px ${app.glow}, 0 0 0 1px rgba(255,255,255,0.07)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Ambient color bleed (behind card, on hover) */}
                <div
                  className="card-ambient absolute -inset-[1px] -z-10 rounded-2xl blur-2xl pointer-events-none"
                  style={{ background: app.glow }}
                />

                {/* Top highlight line */}
                <div className="absolute top-0 h-px pointer-events-none left-4 right-4 card-top-line" />

                {/* ── ICON ── */}
                <div
                  className={`icon-glass relative w-[62px] h-[62px] rounded-[16px] ${app.color} flex items-center justify-center mb-5 overflow-hidden transition-transform duration-300 group-hover:scale-110`}
                  style={{
                    boxShadow: `0 12px 35px ${app.glow}`,
                    border: '1px solid rgba(255,255,255,0.18)'
                  }}
                >
                  {/* Bottom shadow */}
                  <div className="absolute inset-x-0 bottom-0 pointer-events-none h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="relative z-10">
                    {app.icon}
                  </div>
                </div>

                {/* ── TEXT ── */}
                <div className="flex flex-col flex-1 w-full gap-1">
                  <h3
                    className="text-[14px] font-bold leading-tight tracking-tight transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.92)' }}
                  >
                    {app.name}
                  </h3>
                  <p
                    className="text-[11px] tools-mono leading-tight transition-colors duration-200 group-hover:opacity-70"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {app.description}
                  </p>
                </div>

                {/* ── LAUNCH ARROW ── */}
                <div
                  className="absolute transition-opacity duration-300 opacity-0 top-4 right-4 group-hover:opacity-100"
                >
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full arrow-icon"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5H8M8 5L5.5 2.5M8 5L5.5 7.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── FOOTER HINT ── */}
          <p
            className="mt-14 text-center text-[10px] tracking-[0.3em] tools-mono"
            style={{ color: 'rgba(255,255,255,0.15)' }}
          >
            {apps.length} APPS &nbsp;·&nbsp; MORE COMING SOON
          </p>

        </div>
      )}
    </section>
  );
};

export default Tools;