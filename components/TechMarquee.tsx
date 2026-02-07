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
    <section className="relative py-8 overflow-hidden bg-black border-y border-zinc-900">
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-black via-transparent to-black"></div>
      
      <div className="container relative z-20 px-4 mx-auto mb-4">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] text-center">Powering My Workflow</p>
        </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex items-center gap-12 px-6 animate-marquee whitespace-nowrap">
          {/* Triple the list for seamless loop on wide screens */}
          {[...techs, ...techs, ...techs].map((tech, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 transition-all duration-300 cursor-default group/item opacity-60 hover:opacity-100"
            >
              <span className={`p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm group-hover/item:border-zinc-700 transition-colors grayscale group-hover/item:grayscale-0 ${tech.color}`}>
                {tech.icon}
              </span>
              <span className="text-lg font-bold transition-colors text-zinc-400 group-hover/item:text-white">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechMarquee;