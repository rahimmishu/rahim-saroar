import React, { useState, useEffect } from 'react';
import { 
  Hand, Scissors, FileText, RefreshCw, Trophy, Cpu, 
  Play, Pause, RotateCcw, Zap, Maximize2, Minimize2, Settings 
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================
type Choice = 'rock' | 'paper' | 'scissors' | null;
type Result = 'win' | 'lose' | 'draw' | null;

const Tools: React.FC = () => {
  // ----------------------------------------
  // 1. GAME STATE
  // ----------------------------------------
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // ----------------------------------------
  // 2. FOCUS TIMER STATE
  // ----------------------------------------
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState(25);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // ----------------------------------------
  // GAME LOGIC
  // ----------------------------------------
  const getIcon = (choice: Choice, size = 24) => {
    switch (choice) {
      case 'rock': return <Hand size={size} className="rotate-90" />;
      case 'paper': return <FileText size={size} />;
      case 'scissors': return <Scissors size={size} className="-rotate-90" />;
      default: return <div className="w-6 h-6 rounded-full bg-slate-800 animate-pulse" />;
    }
  };

  const playGame = (choice: Choice) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult(null);

    setTimeout(() => {
      const choices: Choice[] = ['rock', 'paper', 'scissors'];
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(randomChoice);
      calculateResult(choice, randomChoice);
      setIsProcessing(false);
    }, 1000);
  };

  const calculateResult = (player: Choice, computer: Choice) => {
    if (player === computer) {
      setResult('draw');
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      setResult('win');
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setResult('lose');
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
  };

  // ----------------------------------------
  // TIMER LOGIC
  // ----------------------------------------
  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Handle "Esc" Key to Exit Full Screen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Handle Mouse Move to Show/Hide Controls in Fullscreen
  useEffect(() => {
    let timeout: number;
    if (isFullScreen) {
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(timeout);
            timeout = window.setTimeout(() => setShowControls(false), 2000); // Hide after 2 seconds
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeout);
        };
    }
  }, [isFullScreen]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const setTime = (minutes: number) => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
    setCustomTime(minutes);
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value);
      if (!isNaN(val) && val > 0) {
          setCustomTime(val);
          setIsActive(false);
          setTimeLeft(val * 60);
      }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="tools" className="py-24 bg-slate-900 relative overflow-hidden text-white min-h-screen flex items-center justify-center">
       {/* Background Glows */}
       <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-600/5 blur-[120px] pointer-events-none"></div>
       <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-600/5 blur-[120px] pointer-events-none"></div>

      {/* ==========================
          FULL SCREEN OVERLAY (PURE ZEN MODE)
         ========================== */}
      {isFullScreen && (
        <div className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-all duration-300 ${showControls ? 'cursor-default' : 'cursor-none'}`}>
            
            {/* The Giant Clock - Center of Attention */}
            <h1 className="text-white font-black leading-none select-none tabular-nums tracking-tight" style={{ fontSize: '28vw' }}>
                {formatTime(timeLeft)}
            </h1>

            {/* Hidden Controls - Only visible on mouse move */}
            <div className={`absolute bottom-10 flex gap-8 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                    onClick={toggleTimer} 
                    className="p-4 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white transition-all transform hover:scale-110 border border-white/5"
                >
                    {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                </button>
                <button 
                    onClick={() => {
                        setIsActive(false);
                        setTimeLeft(customTime * 60);
                    }} 
                    className="p-4 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white transition-all transform hover:scale-110 border border-white/5"
                >
                    <RotateCcw size={32} />
                </button>
                <button 
                    onClick={() => setIsFullScreen(false)} 
                    className="p-4 rounded-full bg-red-500/20 hover:bg-red-500/50 backdrop-blur-md text-red-200 transition-all transform hover:scale-110 border border-red-500/20"
                >
                    <Minimize2 size={32} />
                </button>
            </div>
        </div>
      )}

      {/* ==========================
          NORMAL VIEW
         ========================== */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-400 border border-slate-700 mb-4">
                <Zap size={14} className="text-yellow-500" />
                <span>ZONE & PLAYGROUND</span>
            </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Productivity <span className="text-slate-600">x</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Entertainment</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
            
            {/* 1. GAME SECTION */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-full">
                <div className="flex items-center gap-3 mb-8">
                    <Trophy className="text-yellow-500" size={24} />
                    <h3 className="text-xl font-bold">Luck Battle</h3>
                </div>

                <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <div className="text-center">
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest mb-1">YOU</p>
                        <p className="text-3xl font-black text-white">{score.player}</p>
                    </div>
                    <div className="px-3 py-1 bg-slate-800 rounded text-[10px] font-mono text-slate-400">VS</div>
                    <div className="text-center">
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest mb-1">AI</p>
                        <p className="text-3xl font-black text-white">{score.computer}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-10 px-2 h-24">
                    <div className={`transition-all duration-500 transform ${playerChoice ? 'scale-110' : 'scale-100'}`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg transition-colors ${
                            result === 'win' ? 'border-green-500 bg-green-500/10 text-green-400' : 
                            result === 'lose' ? 'border-red-500 bg-red-500/10 text-red-400' : 
                            'border-blue-500 bg-slate-800 text-blue-400'
                        }`}>
                            {playerChoice ? getIcon(playerChoice, 32) : <span className="text-[10px] text-slate-500">READY</span>}
                        </div>
                    </div>
                    <div className="text-center w-28">
                        {isProcessing ? (
                            <RefreshCw size={20} className="text-blue-500 animate-spin mx-auto" />
                        ) : result ? (
                            <span className={`text-2xl font-black ${
                                result === 'win' ? 'text-green-500' : 
                                result === 'lose' ? 'text-red-500' : 
                                'text-slate-400'
                            }`}>
                                {result === 'win' ? 'WIN' : result === 'lose' ? 'LOSE' : 'DRAW'}
                            </span>
                        ) : (
                            <span className="text-slate-600 font-mono text-xs">FIGHT</span>
                        )}
                    </div>
                    <div className={`transition-all duration-500 transform ${computerChoice ? 'scale-110' : 'scale-100'}`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg transition-colors ${
                            result === 'lose' ? 'border-green-500 bg-green-500/10 text-green-400' : 
                            result === 'win' ? 'border-red-500 bg-red-500/10 text-red-400' : 
                            'border-purple-500 bg-slate-800 text-purple-400'
                        }`}>
                            {computerChoice ? getIcon(computerChoice, 32) : <Cpu size={28} className={isProcessing ? "animate-pulse" : ""} />}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {['rock', 'paper', 'scissors'].map((item) => (
                        <button 
                            key={item}
                            onClick={() => playGame(item as Choice)}
                            disabled={isProcessing}
                            className="group p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 rounded-xl flex flex-col items-center gap-1 transition-all disabled:opacity-50"
                        >
                            {getIcon(item as Choice, 18)}
                            <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-400 uppercase">{item}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. FOCUS TIMER */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] pointer-events-none"></div>
                
                <div className="w-full flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <Settings className="text-orange-500" size={24} />
                        <h3 className="text-xl font-bold">Focus Zone</h3>
                    </div>
                    <button 
                        onClick={() => setIsFullScreen(true)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                        title="Enter Zen Mode"
                    >
                        <Maximize2 size={20} />
                    </button>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center mb-8">
                    <div className="text-6xl md:text-7xl font-mono font-bold tracking-tight text-white tabular-nums mb-4">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                            {isActive ? 'RUNNING' : 'PAUSED'}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                         <button onClick={() => setTime(25)} className="py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:border-orange-500 transition-all">25m</button>
                         <button onClick={() => setTime(5)} className="py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:border-green-500 transition-all">5m</button>
                         <button onClick={() => setTime(60)} className="py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:border-blue-500 transition-all">60m</button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
                        <span className="text-xs text-slate-500 font-bold uppercase whitespace-nowrap">Set Minutes:</span>
                        <input 
                            type="number" 
                            value={customTime}
                            onChange={handleCustomTimeChange}
                            className="w-full bg-transparent text-white text-sm font-bold focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button 
                        onClick={toggleTimer}
                        className={`flex-1 py-4 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-all ${
                            isActive ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-500/20'
                        }`}
                    >
                        {isActive ? <span className="flex items-center gap-2"><Pause size={20}/> Pause</span> : <span className="flex items-center gap-2"><Play size={20}/> Start Focus</span>}
                    </button>
                    
                    <button 
                        onClick={() => {setIsActive(false); setTimeLeft(customTime * 60);}}
                        className="w-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

            </div>

        </div>
      </div>
    </section>
  );
};

export default Tools;