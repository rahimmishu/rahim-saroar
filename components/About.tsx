import React from 'react';
import { GraduationCap, Code2, Cpu, Sparkles, Brain, Rocket } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative py-32 overflow-hidden transition-colors duration-500 bg-white dark:bg-black">
      
      {/* Background Glows (Premium Ambient Lighting) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto md:px-8">
        
        {/* Main Card Container */}
        <div className="flex flex-col lg:flex-row items-center gap-16 p-8 md:p-12 lg:p-16 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Left Side: Image & Decor */}
          <div className="relative flex flex-col items-center justify-center w-full lg:w-1/3">
            
            {/* Rotating Glow Ring behind Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 animate-spin-slow duration-[10s]"></div>

            <div className="relative group">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-[2rem] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl relative z-10 transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-2">
                <img 
                  src="./1.jpg" 
                  alt="Rahim Saroar Mishu" 
                  className="object-cover w-full h-full transition-transform duration-700 transform group-hover:scale-110"
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100">
                    <span className="text-sm font-bold tracking-widest text-white uppercase">Visionary</span>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute z-20 p-4 bg-white border shadow-xl -bottom-6 -right-6 dark:bg-zinc-900 rounded-2xl border-slate-100 dark:border-zinc-700 animate-bounce-slow">
                <Code2 className="w-8 h-8 text-blue-500" />
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute z-20 p-4 delay-700 bg-white border shadow-xl -top-6 -left-6 dark:bg-zinc-900 rounded-2xl border-slate-100 dark:border-zinc-700 animate-bounce-slow">
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full space-y-8 text-center lg:w-2/3 lg:text-left">
            
            {/* Header Section */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-xs font-bold tracking-wider text-blue-600 uppercase border border-blue-100 rounded-full bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50">
                <Sparkles size={14} className="animate-pulse" /> About Me
              </div>
              
              <h2 className="text-4xl font-black leading-tight md:text-5xl text-slate-900 dark:text-white">
                Rahim Saroar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Mishu</span>
              </h2>
              
              <p className="mt-4 text-xl font-medium text-slate-600 dark:text-slate-300">
                11th Grade Science Student & Future Tech Leader 🚀
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              <p>
                Hi, I'm <strong className="text-slate-900 dark:text-white">Rahim</strong>, a 19-year-old innovator from Bangladesh. My world revolves around lines of code and circuits. I don't just learn technology; I live it.
              </p>
              
              <p>
                From building <span className="font-bold text-blue-500">AI Assistants</span> to crafting <span className="font-bold text-purple-500">IoT Gadgets</span>, I transform complex ideas into reality using Python, JavaScript, and C++.
              </p>
            </div>

            {/* Premium Info Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
               
               {/* Card 1: Education */}
               <div className="p-5 transition-all duration-300 bg-white border group dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 text-blue-600 transition-transform bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl group-hover:scale-110">
                        <GraduationCap size={24} />
                    </div>
                    <div className="text-left">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Education</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">11th Grade Science</p>
                    </div>
                 </div>
               </div>

               {/* Card 2: Tech Stack */}
               <div className="p-5 transition-all duration-300 bg-white border group dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 text-purple-600 transition-transform bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl group-hover:scale-110">
                        <Cpu size={24} />
                    </div>
                    <div className="text-left">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Hardware & IoT</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Arduino, ESP32, Robotics</p>
                    </div>
                 </div>
               </div>

            </div>

            {/* Call to Action Button (Optional) */}
            <div className="pt-4">
               <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white transition-all bg-slate-900 dark:bg-white dark:text-black rounded-xl hover:scale-105 hover:shadow-lg">
                  Let's Collaborate <Rocket size={16} />
               </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;