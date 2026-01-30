import React, { useState, useEffect } from 'react';
import { 
  X, Gamepad2, Calculator, Trophy, Zap, 
  RotateCcw, Hand, LayoutGrid, Swords 
} from 'lucide-react';

// ✅ PokemonGame ইমপোর্ট (নিশ্চিত করুন PokemonGame.tsx ফাইলটি তৈরি করা আছে)
import PokemonGame from './PokemonGame';

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

  // Load Score
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
        setStatus("DRAW!"); setGlowColor("rgba(148, 163, 184, 0.4)");
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
    <div className="relative flex flex-col items-center justify-center w-full h-full">
       {/* Inject Animations */}
       <style>{`
        @keyframes shakePlayer { 0%, 100% { transform: scaleX(-1) translateY(0) rotate(-90deg); } 50% { transform: scaleX(-1) translateY(-30px) rotate(-70deg); } }
        @keyframes shakeCPU { 0%, 100% { transform: translateY(0) rotate(-90deg); } 50% { transform: translateY(-30px) rotate(-70deg); } }
        .shake-p { animation: shakePlayer 0.4s ease infinite; }
        .shake-c { animation: shakeCPU 0.4s ease infinite; }
        .hand-default-p { transform: scaleX(-1) rotate(-90deg); }
        .hand-default-c { transform: rotate(-90deg); }
        .vs-pop { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
      `}</style>
      
      {/* Game Card */}
      <div className="relative bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-2xl w-full max-w-[400px] text-center border border-slate-200 dark:border-slate-700">
        <div 
          className="absolute inset-0 -z-10 rounded-[40px] transition-colors duration-500 pointer-events-none blur-xl opacity-50"
          style={{ background: glowColor }}
        ></div>

        {/* Score */}
        <div className="flex justify-between p-4 mb-8 border bg-slate-50 dark:bg-slate-900 rounded-3xl border-slate-200 dark:border-slate-700">
          <div className="w-1/2 text-center border-r border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-black text-slate-400">PLAYER</div>
            <div className="text-3xl font-black text-slate-800 dark:text-white">{pScore}</div>
          </div>
          <div className="w-1/2 text-center">
            <div className="text-[10px] font-black text-slate-400">CPU</div>
            <div className="text-3xl font-black text-slate-800 dark:text-white">{cScore}</div>
          </div>
        </div>

        {/* Arena */}
        <div className="flex justify-between items-center py-8 min-h-[150px] relative">
          <div className={`text-[60px] md:text-[80px] leading-none transition-transform duration-100 ${isShaking ? 'shake-p' : 'hand-default-p'}`}>{pHand}</div>
          {showVs && <div className="absolute z-10 flex items-center justify-center w-10 h-10 text-xs font-black text-white -translate-x-1/2 -translate-y-1/2 bg-indigo-600 border-2 border-white rounded-full shadow-lg left-1/2 top-1/2 vs-pop dark:border-slate-800">VS</div>}
          <div className={`text-[60px] md:text-[80px] leading-none transition-transform duration-100 ${isShaking ? 'shake-c' : 'hand-default-c'}`}>{cHand}</div>
        </div>

        <div className="font-black text-slate-800 dark:text-white mb-8 text-lg min-h-[28px] tracking-wide">{status}</div>

        <div className="grid grid-cols-3 gap-3">
          {[{id:'rock',emoji:'✊',label:'ROCK'},{id:'paper',emoji:'✋',label:'PAPER'},{id:'scissors',emoji:'✌️',label:'SCISSORS'}].map((btn)=>(
            <button key={btn.id} onClick={()=>playGame(btn.id)} disabled={isShaking} className="p-3 transition-all bg-white border-2 shadow-sm group dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-2xl hover:-translate-y-1 hover:border-indigo-500">
              <span className="block mb-1 text-2xl transition-transform group-hover:scale-110">{btn.emoji}</span>
              <span className="text-[9px] font-black text-slate-400 group-hover:text-indigo-500 tracking-widest">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <button onClick={resetGame} className="flex items-center gap-2 mt-8 text-xs font-bold underline transition-colors text-slate-400 hover:text-red-500 decoration-2">
        <RotateCcw size={12} /> RESET SCORE
      </button>
    </div>
  );
};

// ==========================================
// 2. MAIN TOOLS (APP LAUNCHER) COMPONENT
// ==========================================
const Tools: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  // App Configuration
  const apps = [
    {
      id: 'rps',
      name: 'RPS Game',
      icon: <Hand className="rotate-90" size={32} />,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      description: 'Classic Rock Paper Scissors'
    },
    // ✨ নতুন PokéBattle গেম যোগ করা হলো
    {
      id: 'pokemon',
      name: 'PokéBattle',
      icon: <Swords size={32} />,
      color: 'bg-gradient-to-br from-yellow-400 to-orange-600',
      description: 'Turn-based RPG Battle'
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: <Calculator size={32} />,
      color: 'bg-gradient-to-br from-orange-400 to-red-500',
      description: 'Coming Soon',
      disabled: true 
    },
    {
      id: 'focus',
      name: 'Focus Timer',
      icon: <Zap size={32} />,
      color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      description: 'Coming Soon',
      disabled: true
    }
  ];

  // Render Active Game Logic
  const renderActiveApp = () => {
    switch (activeApp) {
      case 'rps':
        return <RockPaperScissorsGame />;
      case 'pokemon':
        return <PokemonGame />; // ✨ Pokémon গেম রেন্ডার
      default:
        return null;
    }
  };

  return (
    <section id="tools" className="relative flex flex-col items-center justify-center min-h-screen py-24 overflow-hidden bg-slate-900">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      {/* =======================
          FULL SCREEN GAME MODE
         ======================= */}
      {activeApp ? (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          
          {/* Top Bar (Close Button) */}
          <div className="absolute z-50 top-6 right-6">
            <button 
              onClick={() => setActiveApp(null)}
              className="p-3 text-white transition-all border rounded-full shadow-lg bg-white/10 hover:bg-red-500/80 backdrop-blur-md hover:rotate-90 hover:scale-110 border-white/10"
            >
              <X size={28} />
            </button>
          </div>

          {/* Game Container */}
          <div className="flex items-center justify-center flex-grow w-full h-full p-4">
             {renderActiveApp()}
          </div>
        </div>
      ) : (
        /* =======================
            APP GRID (LAUNCHER)
           ======================= */
        <div className="container relative z-10 px-4 mx-auto">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 rounded-full text-xs font-bold text-slate-300 border border-slate-700 mb-6 backdrop-blur-sm">
              <LayoutGrid size={14} className="text-blue-400" />
              <span>TOOLS & GAMES</span>
            </div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
              Playground
            </h2>
            <p className="max-w-lg mx-auto text-slate-400">
              Select an app to launch it in full screen. More tools coming soon.
            </p>
          </div>

          {/* App Grid */}
          <div className="grid max-w-4xl grid-cols-2 gap-6 mx-auto md:grid-cols-4">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => !app.disabled && setActiveApp(app.id)}
                disabled={app.disabled}
                className={`group relative flex flex-col items-center p-6 rounded-3xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 ${app.disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-2 hover:shadow-2xl'}`}
              >
                {/* App Icon */}
                <div className={`w-20 h-20 rounded-2xl ${app.color} shadow-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {app.icon}
                </div>
                
                {/* App Name */}
                <h3 className="mb-1 text-lg font-bold text-white">{app.name}</h3>
                <p className="text-xs font-medium text-slate-500">{app.description}</p>
                
                {/* Hover Glow */}
                {!app.disabled && (
                  <div className="absolute inset-0 transition-opacity opacity-0 pointer-events-none bg-blue-500/5 rounded-3xl group-hover:opacity-100"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Tools;