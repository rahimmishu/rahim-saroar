import React from 'react';
import { Rocket, Trophy, BookOpen, Lightbulb, Star, Baby, Briefcase, GraduationCap } from 'lucide-react';

const Journey: React.FC = () => {
  const milestones = [
    {
      year: '2026',
      title: 'Innovation & AI',
      subtitle: 'Future Goal',
      description: 'Building AI Personal Assistant (Jarvis) & Advanced Smart Portfolio System.',
      icon: <Rocket size={20} />,
      color: 'text-cyan-400',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      year: '2025',
      title: 'National Award',
      subtitle: 'Achievement',
      description: "Secured 38th place in Bangladesh - 'Smritir Likhon' competition.",
      icon: <Trophy size={20} />,
      color: 'text-amber-400',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      year: '2025',
      title: 'SSC Examination',
      subtitle: 'Academic',
      description: 'Passed SSC from Science Group with perfect GPA 5.00.',
      icon: <BookOpen size={20} />,
      color: 'text-emerald-400',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      year: '2024',
      title: 'Tech Spark',
      subtitle: 'The Beginning',
      description: 'Started my journey into Python, Web Development & creative coding.',
      icon: <Lightbulb size={20} />,
      color: 'text-violet-400',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      year: '2022',
      title: 'JSC Completion',
      subtitle: 'Academic',
      description: 'Junior School Milestone achieved with excellence (GPA 5.00).',
      icon: <Star size={20} />,
      color: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      year: '2017',
      title: 'PSC Success',
      subtitle: 'Academic',
      description: 'Passed Primary School Certificate exam with GPA 5.00.',
      icon: <GraduationCap size={20} />,
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      year: '2006',
      title: 'Born',
      subtitle: 'Life Event',
      description: 'Born on September 3, 2006. The journey of a lifetime began!',
      icon: <Baby size={20} />,
      color: 'text-slate-400',
      gradient: 'from-slate-500 to-gray-500',
    },
  ];

  return (
    <section id="journey" className="relative py-24 overflow-hidden transition-colors duration-500 bg-slate-50 dark:bg-black">
      {/* 🌟 Background Elements (Premium Glows) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container relative z-10 max-w-5xl px-4 mx-auto">
        
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="inline-block px-4 py-1.5 mb-4 border border-blue-500/30 rounded-full bg-blue-500/5 backdrop-blur-sm">
             <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">My Timeline</span>
          </div>
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900 dark:text-white">
            Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Milestones</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            A chronological look at my academic and technical evolution.
          </p>
        </div>

        {/* ⏳ TIMELINE CONTAINER */}
        <div className="relative">
          
          {/* The Central Line (Gradient) */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent md:-translate-x-1/2 opacity-30"></div>

          <div className="space-y-12">
            {milestones.map((item, index) => (
              <div key={index} className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* 1. Empty Space for alternating layout on desktop */}
                <div className="hidden w-5/12 md:block"></div>

                {/* 2. The Center Node (Icon) */}
                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-black border-4 border-slate-100 dark:border-zinc-800 shadow-[0_0_0_4px_rgba(59,130,246,0.1)] z-20 group">
                   <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.gradient} group-hover:scale-150 transition-transform duration-300`}></div>
                </div>

                {/* 3. The Content Card */}
                <div className="w-full pl-12 md:w-5/12 md:pl-0">
                  <div className={`
                    relative p-6 rounded-2xl border border-slate-200 dark:border-zinc-800
                    bg-white/50 dark:bg-zinc-950 backdrop-blur-xl shadow-sm hover:shadow-xl
                    transition-all duration-300 hover:-translate-y-1 group
                  `}>
                    
                    {/* Glowing Border Effect on Hover */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>

                    <div className="flex items-start justify-between mb-2">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-zinc-900 ${item.color} border border-slate-200 dark:border-zinc-800`}>
                          {item.year}
                       </span>
                       <div className={`p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 ${item.color}`}>
                          {item.icon}
                       </div>
                    </div>

                    <h3 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <span className="block mb-3 text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Bottom Decor */}
        <div className="mt-20 text-center">
           <div className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white transition-transform rounded-full shadow-xl cursor-pointer bg-slate-900 dark:bg-white dark:text-slate-900 hover:scale-105">
              <Rocket size={18} /> <span>Continue Journey</span>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Journey;