import React from 'react';
import { Rocket, Trophy, BookOpen, Lightbulb, Star, Baby, Map as MapIcon, Flag, Mountain, Compass, Ship, Skull, Anchor } from 'lucide-react';

const Journey: React.FC = () => {
  // 📍 DESKTOP Coordinates (1000x600 Grid)
  const milestones = [
    { id: 1, year: '2026', title: 'AI Innovation', icon: <Rocket size={20} />, x: 850, y: 100 },
    { id: 2, year: '2025', title: 'National Award', icon: <Trophy size={20} />, x: 550, y: 150 },
    { id: 3, year: '2025', title: 'SSC Result', icon: <BookOpen size={20} />, x: 250, y: 100 },
    { id: 4, year: '2024', title: 'Tech Spark', icon: <Lightbulb size={20} />, x: 100, y: 300 },
    { id: 5, year: '2022', title: 'JSC Milestone', icon: <Star size={20} />, x: 350, y: 400 },
    { id: 6, year: '2017', title: 'PSC Success', icon: <Star size={20} />, x: 650, y: 300 },
    { id: 7, year: '2006', title: 'Born', icon: <Baby size={20} />, x: 900, y: 500 },
  ];

  // 🛤️ DESKTOP Path Data
  const desktopPathData = `
    M ${milestones[6].x} ${milestones[6].y} 
    C 750 500, 750 350, ${milestones[5].x} ${milestones[5].y}
    C 550 250, 450 450, ${milestones[4].x} ${milestones[4].y}
    C 200 350, 100 400, ${milestones[3].x} ${milestones[3].y}
    C 100 150, 200 200, ${milestones[2].x} ${milestones[2].y}
    C 350 50, 450 200, ${milestones[1].x} ${milestones[1].y}
    C 650 100, 750 50, ${milestones[0].x} ${milestones[0].y}
  `;

  // 📍 MOBILE Coordinates (350x800 Grid - Tall & Narrow)
  // রিভার্স অর্ডার (Start from bottom)
  const mobileMilestones = [
    { id: 7, year: '2006', title: 'Born', icon: <Baby size={18} />, x: 280, y: 750 },
    { id: 6, year: '2017', title: 'PSC Success', icon: <Star size={18} />, x: 100, y: 650 },
    { id: 5, year: '2022', title: 'JSC Milestone', icon: <Star size={18} />, x: 250, y: 550 },
    { id: 4, year: '2024', title: 'Tech Spark', icon: <Lightbulb size={18} />, x: 80, y: 450 },
    { id: 3, year: '2025', title: 'SSC Result', icon: <BookOpen size={18} />, x: 260, y: 350 },
    { id: 2, year: '2025', title: 'National Award', icon: <Trophy size={18} />, x: 90, y: 250 },
    { id: 1, year: '2026', title: 'AI Innovation', icon: <Rocket size={18} />, x: 250, y: 150 },
  ];

  // 🛤️ MOBILE Path Data (Vertical Snake)
  const mobilePathData = `
    M ${mobileMilestones[0].x} ${mobileMilestones[0].y}
    C 100 750, 250 680, ${mobileMilestones[1].x} ${mobileMilestones[1].y}
    C 50 600, 150 580, ${mobileMilestones[2].x} ${mobileMilestones[2].y}
    C 350 500, 150 480, ${mobileMilestones[3].x} ${mobileMilestones[3].y}
    C 50 400, 150 380, ${mobileMilestones[4].x} ${mobileMilestones[4].y}
    C 350 300, 150 280, ${mobileMilestones[5].x} ${mobileMilestones[5].y}
    C 50 200, 150 180, ${mobileMilestones[6].x} ${mobileMilestones[6].y}
  `;

  return (
    <section id="journey" className="py-24 relative overflow-hidden flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500">
      
      {/* 🌟 Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")` }}></div>
      </div>

      <div className="container relative z-10 w-full max-w-6xl px-4 mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
           <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-slate-800 text-[#8B4513] dark:text-[#d4a373] mb-4 shadow-lg border border-[#8B4513]/20 dark:border-[#d4a373]/30 transform -rotate-1">
              <MapIcon size={18} /> <span className="text-sm font-bold tracking-widest uppercase">Adventure Log</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-[#e2e8f0] font-serif tracking-wide drop-shadow-sm">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-[#d4a373]">Treasure Hunt</span>
           </h2>
        </div>

        {/* =========================================
            🖥️ DESKTOP VIEW (Landscape Map)
           ========================================= */}
        <div className="hidden md:block relative w-full aspect-[2/1] mx-auto filter drop-shadow-2xl hover:scale-[1.01] transition-transform duration-500">
           {/* 📜 Map Shape */}
           <div className="absolute inset-0 bg-[#f4e4bc]" 
                style={{ 
                  clipPath: 'polygon(2% 4%, 15% 2%, 30% 5%, 45% 2%, 60% 4%, 75% 2%, 90% 5%, 98% 3%, 99% 15%, 97% 30%, 99% 45%, 97% 60%, 99% 75%, 97% 90%, 95% 98%, 80% 96%, 65% 99%, 50% 96%, 35% 99%, 20% 96%, 5% 99%, 2% 90%, 3% 75%, 1% 60%, 3% 45%, 1% 30%, 3% 15%)',
                  boxShadow: 'inset 0 0 60px rgba(139,69,19,0.2)' 
                }}>
             
             {/* Textures & Decor */}
             <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/aged-paper.png")` }}></div>
             <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(101,67,33,0.5)]"></div>
             
             <Mountain className="absolute top-12 left-24 text-[#8d6e63]/20 w-32 h-32" />
             <Compass className="absolute top-8 right-12 text-[#8d6e63]/30 w-24 h-24 rotate-12" />
             <Ship className="absolute bottom-20 left-12 text-[#8d6e63]/20 w-20 h-20" />
             <Anchor className="absolute bottom-8 right-8 text-[#8d6e63]/20 w-16 h-16 -rotate-12" />

             {/* 🔥 Desktop Path */}
             <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full pointer-events-none">
                <path d={desktopPathData} stroke="rgba(139,69,19,0.15)" strokeWidth="10" fill="none" strokeLinecap="round" />
                <path d={desktopPathData} stroke="#8B4513" strokeWidth="4" fill="none" strokeDasharray="15 10" strokeLinecap="round" className="drop-shadow-sm opacity-90" />
             </svg>

             {/* 📍 Desktop Milestones */}
             {milestones.map((item) => (
               <div key={item.id} className="absolute z-20 group" style={{ left: `${(item.x / 1000) * 100}%`, top: `${(item.y / 600) * 100}%`, transform: 'translate(-50%, -50%)' }}>
                  <div className={`w-16 h-16 rounded-full bg-[#fdf2e9] border-[3px] border-[#8B4513] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 cursor-pointer relative z-20 ${item.id === 7 ? 'animate-bounce' : ''}`}>
                     <div className="text-[#8B4513] group-hover:rotate-12 transition-transform">{item.icon}</div>
                  </div>
                  <div className="absolute top-16 w-36 bg-[#fff8dc] border-2 border-[#8B4513] p-2 rounded-lg text-center opacity-100 transition-all z-30 transform rotate-1 group-hover:rotate-0">
                     <span className="text-[10px] font-black text-[#8B4513]/70 uppercase block">{item.year}</span>
                     <span className="text-xs font-bold text-[#3e2723] block">{item.title}</span>
                  </div>
               </div>
             ))}
             
             {/* Start Label */}
             <div className="absolute top-[85%] left-[90%] -translate-x-1/2 pointer-events-none animate-pulse">
                 <Flag className="mx-auto mb-1 text-red-600" size={32} fill="currentColor" />
                 <span className="text-[10px] font-black text-white bg-red-600 px-2 py-0.5 rounded">START</span>
             </div>
           </div>
        </div>


        {/* =========================================
            📱 MOBILE VIEW (Vertical Snake Map)
           ========================================= */}
        <div className="md:hidden relative w-full h-[850px] mx-auto filter drop-shadow-xl mt-8">
           {/* 📜 Map Shape (Vertical) */}
           <div className="absolute inset-0 bg-[#f4e4bc]" 
                style={{ 
                  clipPath: 'polygon(2% 1%, 98% 2%, 96% 98%, 4% 99%)', // Simple ragged look
                  borderRadius: '10px',
                  boxShadow: 'inset 0 0 40px rgba(139,69,19,0.3)' 
                }}>
             
             {/* Texture */}
             <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/aged-paper.png")` }}></div>
             <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(101,67,33,0.4)]"></div>

             {/* Decor */}
             <Compass className="absolute top-4 right-4 text-[#8d6e63]/20 w-16 h-16 rotate-12" />
             <Ship className="absolute bottom-10 left-4 text-[#8d6e63]/10 w-16 h-16" />

             {/* 🔥 Mobile Path */}
             <svg viewBox="0 0 350 800" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path d={mobilePathData} stroke="rgba(139,69,19,0.1)" strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d={mobilePathData} stroke="#8B4513" strokeWidth="3" fill="none" strokeDasharray="10 8" strokeLinecap="round" className="opacity-80" />
             </svg>

             {/* 📍 Mobile Milestones */}
             {mobileMilestones.map((item) => (
               <div key={item.id} className="absolute z-20" style={{ left: `${(item.x / 350) * 100}%`, top: `${(item.y / 800) * 100}%`, transform: 'translate(-50%, -50%)' }}>
                  {/* Node */}
                  <div className={`w-12 h-12 rounded-full bg-[#fdf2e9] border-[3px] border-[#8B4513] flex items-center justify-center shadow-md relative z-20 ${item.id === 7 ? 'animate-bounce' : ''}`}>
                     <div className="text-[#8B4513] scale-90">{item.icon}</div>
                  </div>
                  
                  {/* Card (Alternating Sides) */}
                  <div className={`
                    absolute top-1/2 -translate-y-1/2 w-28 bg-[#fff8dc] border border-[#8B4513] p-1.5 rounded shadow-sm text-center z-10
                    ${item.x > 175 ? 'right-14' : 'left-14'}
                  `}>
                     <span className="text-[9px] font-black text-[#8B4513]/70 block">{item.year}</span>
                     <span className="text-[10px] font-bold text-[#3e2723] block leading-tight">{item.title}</span>
                  </div>
               </div>
             ))}

             {/* Start Label Mobile */}
             <div className="absolute flex flex-col items-center -translate-x-1/2 bottom-4 left-1/2">
                 <Flag className="mb-1 text-red-600" size={24} fill="currentColor" />
                 <span className="text-[9px] font-black text-white bg-red-600 px-2 py-0.5 rounded">START</span>
             </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Journey;