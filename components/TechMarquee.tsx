import React from 'react';
import { Terminal, Globe, Zap, Server, Cpu, Sparkles, FileCode, Github } from 'lucide-react';

const TechMarquee: React.FC = () => {
  const techs = [
    { name: 'Python', icon: <Terminal size={24} />, color: 'text-yellow-400' },
    { name: 'React', icon: <Globe size={24} />, color: 'text-blue-400' },
    { name: 'Tailwind', icon: <Zap size={24} />, color: 'text-cyan-400' },
    { name: 'Node.js', icon: <Server size={24} />, color: 'text-green-500' },
    { name: 'Arduino', icon: <Cpu size={24} />, color: 'text-teal-400' },
    { name: 'Gemini AI', icon: <Sparkles size={24} />, color: 'text-purple-400' },
    { name: 'VS Code', icon: <FileCode size={24} />, color: 'text-blue-500' },
    { name: 'Github', icon: <Github size={24} />, color: 'text-white' },
  ];

  return (
    <section className="py-8 bg-slate-950 border-y border-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 z-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 mb-4 relative z-20">
         <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] text-center">Powering My Workflow</p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 px-6">
          {/* Triple the list for seamless loop on wide screens */}
          {[...techs, ...techs, ...techs].map((tech, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 transition-all duration-300 group/item cursor-default opacity-60 hover:opacity-100"
            >
              <span className={`p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-sm group-hover/item:border-slate-700 transition-colors grayscale group-hover/item:grayscale-0 ${tech.color}`}>
                {tech.icon}
              </span>
              <span className="font-bold text-lg text-slate-400 group-hover/item:text-white transition-colors">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechMarquee;