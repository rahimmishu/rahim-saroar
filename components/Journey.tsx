import React from 'react';
import { Rocket, Trophy, BookOpen, Lightbulb, Star, Baby } from 'lucide-react';

const Journey: React.FC = () => {
  const milestones = [
    {
      year: '2026',
      title: 'Innovation & AI',
      description: 'Developing advanced projects like AI Personal Assistant (Jarvis), Focus Timer, and this Smart Portfolio.',
      icon: <Rocket />, 
      color: 'bg-blue-600',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2025',
      title: 'National Recognition',
      description: "Secured 38th place in the whole of Bangladesh in the 'Smritir Likhon' competition based on the '24 Mass Uprising.",
      icon: <Trophy />,
      color: 'bg-yellow-500',
      border: 'border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-500/20',
    },
    {
      year: '2025',
      title: 'Academic Excellence (SSC)',
      description: 'Passed SSC (Science) with a perfect GPA 5.00.',
      icon: <BookOpen />,
      color: 'bg-green-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2024',
      title: 'The Tech Spark',
      description: 'Started my journey into the world of Python, Programming, and creative problem solving.',
      icon: <Lightbulb />,
      color: 'bg-purple-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2022',
      title: 'Junior Milestone (JSC)',
      description: 'Passed JSC exam with GPA 5.00.',
      icon: <Star />,
      color: 'bg-indigo-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2017',
      title: 'Early Foundation (PSC)',
      description: 'Passed PSC exam with GPA 5.00.',
      icon: <Star />,
      color: 'bg-cyan-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2006',
      title: 'The Beginning',
      description: 'Born on September 3, 2006. The journey began!',
      icon: <Baby />,
      color: 'bg-pink-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
  ];

  return (
    // 🔥 FIX 1: Reduced section padding for mobile (py-12 instead of py-24)
    <section id="journey" className="relative py-12 overflow-hidden transition-colors duration-300 md:py-24 bg-slate-50 dark:bg-slate-900">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full top-20 left-10 bg-blue-500/5 blur-3xl"></div>
        <div className="absolute rounded-full bottom-20 right-10 w-80 h-80 bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto md:px-8">
        <div className="mb-10 text-center md:mb-16">
          <h2 className="mb-3 text-3xl font-extrabold md:text-4xl text-slate-900 dark:text-white md:mb-4">My Journey</h2>
          <p className="max-w-2xl mx-auto text-base text-slate-600 dark:text-slate-400 md:text-lg">
             A timeline of my growth, achievements, and innovations.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line - 🔥 FIX 2: Moved closer to left (left-5) on mobile */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent md:-translate-x-1/2 rounded-full opacity-30"></div>

          {/* 🔥 FIX 3: Reduced gap between items (space-y-8 on mobile) */}
          <div className="space-y-8 md:space-y-12">
            {milestones.map((item, index) => (
              <div 
                key={index} 
                className={`relative flex items-start md:items-center md:justify-between ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot - 🔥 FIX 4: Smaller dot (w-8 h-8) & aligned top for mobile */}
                <div className="absolute z-20 flex items-center justify-center w-8 h-8 mt-0 -translate-x-1/2 bg-white border-2 rounded-full shadow-xl left-5 md:left-1/2 md:w-10 md:h-10 dark:bg-slate-800 md:border-4 border-slate-100 dark:border-slate-700 md:mt-0">
                  <div className={`text-white p-1.5 rounded-full shadow-sm ${item.color}`}>
                     {/* Dynamic Icon Size */}
                     {React.cloneElement(item.icon as React.ReactElement, { size: 14, className: "md:w-5 md:h-5" })}
                  </div>
                </div>

                {/* Empty Space for Grid Layout (Desktop only) */}
                <div className="hidden w-5/12 md:block"></div>

                {/* Content Card - 🔥 FIX 5: Reduced left padding (pl-12) to reduce gap */}
                <div className="w-full pl-12 md:w-5/12 md:pl-0">
                  {/* Reduced internal padding (p-4) & border radius */}
                  <div className={`bg-white/80 dark:bg-slate-800/60 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border ${item.border} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group`}>
                    
                    <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                      <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold text-white shadow-sm ${item.color}`}>
                        {item.year}
                      </span>
                    </div>
                    
                    <h3 className="mb-1 text-base font-bold transition-colors md:text-xl text-slate-900 dark:text-white md:mb-2 group-hover:text-primary">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 md:text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;