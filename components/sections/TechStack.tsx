import React from 'react';
import { Code, Cpu, Database, Server, Terminal, Globe, Zap } from 'lucide-react';

const TechStack: React.FC = () => {
  const techs = [
    { name: 'Python', icon: <Terminal size={24} /> },
    { name: 'JavaScript', icon: <Code size={24} /> },
    { name: 'React', icon: <Globe size={24} /> },
    { name: 'Tailwind CSS', icon: <Zap size={24} /> },
    { name: 'Node.js', icon: <Server size={24} /> },
    { name: 'Arduino', icon: <Cpu size={24} /> },
    { name: 'Gemini AI', icon: <Database size={24} /> },
  ];

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center lg:text-left">
         <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Technologies I Use</h3>
      </div>
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 px-6">
          {/* Double the list for seamless loop */}
          {[...techs, ...techs, ...techs, ...techs].map((tech, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors cursor-default"
            >
              <span className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                {tech.icon}
              </span>
              <span className="font-bold text-xl">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;