import React, { useState, useEffect } from 'react';

const RockPaperScissors: React.FC = () => {
  const [pScore, setPScore] = useState(0);
  const [cScore, setCScore] = useState(0);
  const [status, setStatus] = useState("CHOOSE YOUR WEAPON");
  const [pHand, setPHand] = useState("✊");
  const [cHand, setCHand] = useState("✊");
  const [isShaking, setIsShaking] = useState(false);
  const [glowColor, setGlowColor] = useState("transparent");

  const hands: { [key: string]: string } = { rock: '✊', paper: '✋', scissors: '✌️' };

  // ১. লোড স্কোর ফ্রম লোকাল স্টোরেজ
  useEffect(() => {
    const savedP = localStorage.getItem('pScore');
    const savedC = localStorage.getItem('cScore');
    if (savedP) setPScore(parseInt(savedP));
    if (savedC) setCScore(parseInt(savedC));
  }, []);

  // ২. গেম রিসেট ফাংশন
  const resetGame = () => {
    setPScore(0);
    setCScore(0);
    localStorage.setItem('pScore', '0');
    localStorage.setItem('cScore', '0');
    setStatus("SCORE RESET");
    setPHand("✊");
    setCHand("✊");
    setGlowColor("transparent");
  };

  // ৩. গেম খেলার লজিক
  const playGame = (userChoice: string) => {
    if (isShaking) return; // এনিমেশন চলাকালীন ক্লিক বন্ধ

    // রিসেট হ্যান্ডস
    setPHand("✊");
    setCHand("✊");
    setStatus("WAIT...");
    setIsShaking(true);
    setGlowColor("transparent");

    // এনিমেশন টাইমার (0.7 সেকেন্ড)
    setTimeout(() => {
      setIsShaking(false);
      
      const choices = ['rock', 'paper', 'scissors'];
      const cpuChoice = choices[Math.floor(Math.random() * 3)];

      // হ্যান্ড আইকন আপডেট
      setPHand(hands[userChoice]);
      setCHand(hands[cpuChoice]);

      // রেজাল্ট লজিক
      if (userChoice === cpuChoice) {
        setStatus("DRAW!");
        setGlowColor("rgba(148, 163, 184, 0.5)"); // Gray Glow
      } else if (
        (userChoice === 'rock' && cpuChoice === 'scissors') ||
        (userChoice === 'paper' && cpuChoice === 'rock') ||
        (userChoice === 'scissors' && cpuChoice === 'paper')
      ) {
        setStatus("YOU WIN!");
        const newScore = pScore + 1;
        setPScore(newScore);
        localStorage.setItem('pScore', newScore.toString());
        setGlowColor("rgba(16, 185, 129, 0.6)"); // Green Glow
      } else {
        setStatus("CPU WINS!");
        const newScore = cScore + 1;
        setCScore(newScore);
        localStorage.setItem('cScore', newScore.toString());
        setGlowColor("rgba(239, 68, 68, 0.6)"); // Red Glow
      }

      // গ্লো অফ করা
      setTimeout(() => setGlowColor("transparent"), 800);

    }, 700);
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-10 font-sans">
      {/* CSS Styles Injection for Animation */}
      <style>{`
        @keyframes shakePlayer {
          0%, 100% { transform: scaleX(-1) translateY(0) rotate(-90deg); }
          50% { transform: scaleX(-1) translateY(-30px) rotate(-70deg); }
        }
        @keyframes shakeCPU {
          0%, 100% { transform: translateY(0) rotate(-90deg); }
          50% { transform: translateY(-30px) rotate(-70deg); }
        }
        .shake-p { animation: shakePlayer 0.4s ease infinite; }
        .shake-c { animation: shakeCPU 0.4s ease infinite; }
        
        .hand-default-p { transform: scaleX(-1) rotate(-90deg); }
        .hand-default-c { transform: rotate(-90deg); }
        
        .vs-clash { transform: scale(1.3); }
      `}</style>

      {/* Glow Effect Overlay */}
      <div 
        className="absolute inset-0 -z-10 rounded-[3rem] transition-all duration-500 blur-3xl"
        style={{ background: glowColor }}
      ></div>

      {/* Game Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
        
        {/* Score Board */}
        <div className="flex justify-between p-4 mb-8 border bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-700">
          <div className="w-1/2 text-center border-r border-slate-200 dark:border-slate-700">
            <div className="mb-1 text-xs font-black tracking-wider text-slate-400">PLAYER</div>
            <div className="text-3xl font-black text-slate-800 dark:text-white">{pScore}</div>
          </div>
          <div className="w-1/2 text-center">
            <div className="mb-1 text-xs font-black tracking-wider text-slate-400">CPU</div>
            <div className="text-3xl font-black text-slate-800 dark:text-white">{cScore}</div>
          </div>
        </div>

        {/* Arena */}
        <div className="relative flex items-center justify-between h-32 px-4 mb-6">
          <div className={`text-6xl transition-transform duration-100 ${isShaking ? 'shake-p' : 'hand-default-p'}`}>
            {pHand}
          </div>
          
          <div className={`w-10 h-10 flex items-center justify-center bg-slate-800 dark:bg-indigo-600 text-white font-black rounded-full shadow-lg z-10 transition-transform duration-200 ${!isShaking ? 'scale-110' : 'scale-100'}`}>
            VS
          </div>

          <div className={`text-6xl transition-transform duration-100 ${isShaking ? 'shake-c' : 'hand-default-c'}`}>
            {cHand}
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center font-black text-slate-800 dark:text-white mb-8 text-lg min-h-[1.75rem]">
          {status}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'rock', emoji: '✊', label: 'ROCK' },
            { id: 'paper', emoji: '✋', label: 'PAPER' },
            { id: 'scissors', emoji: '✌️', label: 'SCISSORS' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => playGame(btn.id)}
              disabled={isShaking}
              className="flex flex-col items-center justify-center p-3 transition-all border-2 rounded-2xl border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50 dark:bg-slate-700/50"
            >
              <span className="mb-1 text-2xl">{btn.emoji}</span>
              <span className="text-[0.6rem] font-black text-slate-400">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button 
          onClick={resetGame} 
          className="w-full mt-6 text-xs font-bold underline transition-colors text-slate-400 hover:text-red-500 decoration-2 underline-offset-4"
        >
          RESET SCORE
        </button>

      </div>
    </div>
  );
};

export default RockPaperScissors;