import React from 'react';
import { Rocket, Trophy, BookOpen, Lightbulb, Star, Baby } from 'lucide-react';

const Journey: React.FC = () => {
  const milestones = [
    {
      year: '2026',
      title: 'Innovation & AI',
      description: 'Developing advanced projects like AI Personal Assistant (Jarvis), Focus Timer, and this Smart Portfolio.',
      icon: <Rocket size={20} />,
      color: 'bg-blue-600',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2025',
      title: 'National Recognition',
      description: "Secured 38th place in the whole of Bangladesh in the 'Smritir Likhon' competition based on the '24 Mass Uprising.",
      icon: <Trophy size={20} />,
      color: 'bg-yellow-500',
      border: 'border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-500/20', // Special Highlight
    },
    {
      year: '2025',
      title: 'Academic Excellence (SSC)',
      description: 'Passed SSC (Science) with a perfect GPA 5.00.',
      icon: <BookOpen size={20} />,
      color: 'bg-green-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2024',
      title: 'The Tech Spark',
      description: 'Started my journey into the world of Python, Programming, and creative problem solving.',
      icon: <Lightbulb size={20} />,
      color: 'bg-purple-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2022',
      title: 'Junior Milestone (JSC)',
      description: 'Passed JSC exam with GPA 5.00.',
      icon: <Star size={20} />,
      color: 'bg-indigo-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2017',
      title: 'Early Foundation (PSC)',
      description: 'Passed PSC exam with GPA 5.00.',
      icon: <Star size={20} />,
      color: 'bg-cyan-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
    {
      year: '2006',
      title: 'The Beginning',
      description: 'Born on September 3, 2006. The journey began!',
      icon: <Baby size={20} />,
      color: 'bg-pink-500',
      border: 'border-white/20 dark:border-slate-700/50',
    },
  ];

  return (
    <section id="journey" className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">My Journey</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
             A timeline of my growth, achievements, and innovations.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent md:-translate-x-1/2 rounded-full opacity-30"></div>

          <div className="space-y-12">
            {milestones.map((item, index) => (
              <div 
                key={index} 
                className={`relative flex items-center md:justify-between ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 shadow-xl z-20">
                  <div className={`text-white p-1.5 rounded-full shadow-sm ${item.color}`}>
                    {item.icon}
                  </div>
                </div>

                {/* Empty Space for Grid Layout */}
                <div className="hidden md:block w-5/12"></div>

                {/* Content Card */}
                <div className="w-full md:w-5/12 pl-20 md:pl-0">
                  <div className={`bg-white/80 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border ${item.border} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${item.color}`}>
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
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