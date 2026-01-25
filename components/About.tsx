import React from 'react';
import { GraduationCap, Code2, Cpu } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-[6px] border-white dark:border-slate-700 shadow-xl">
                <img 
                  src="./1.jpg" 
                  alt="Rahim Saroar Mishu" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg border-4 border-white dark:border-slate-700">
                <Code2 size={24} />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-2/3 space-y-6 text-center lg:text-left">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-slate-700 text-primary dark:text-blue-300 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                About Me
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Rahim Saroar Mishu</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-lg">
                11th Grade Science Student | Tech Enthusiast
              </p>
            </div>

            <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4 text-left">
              <p>
                Hi, I am <span className="font-bold text-slate-900 dark:text-white">Rahim Saroar Mishu</span>. 
                I am a 19-year-old Science student from Bangladesh. I love technology and bringing ideas to life.
              </p>

              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-3">Here is what I do:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">🚀</span> 
                    <span><span className="font-bold text-slate-800 dark:text-slate-200">Python & AI:</span> I build smart projects like GPS trackers and voice assistants.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">🤖</span> 
                    <span><span className="font-bold text-slate-800 dark:text-slate-200">IoT & Robotics:</span> I enjoy making hardware work with code (Arduino).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">🎬</span> 
                    <span><span className="font-bold text-slate-800 dark:text-slate-200">Content Creation:</span> I create videos for my page, 'Rhythm of Peace'.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">🎓</span> 
                    <span><span className="font-bold text-slate-800 dark:text-slate-200">Certified:</span> I am also a <span className="font-bold text-slate-900 dark:text-white">Google Certified Educator</span>.</span>
                  </li>
                </ul>
              </div>

              <p>
                My goal is to keep learning and building useful things every single day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
               <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400"><GraduationCap size={20}/></div>
                 <div className="text-left">
                   <div className="font-bold text-slate-900 dark:text-white">Education</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400">11th Grade Science</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400"><Cpu size={20}/></div>
                 <div className="text-left">
                   <div className="font-bold text-slate-900 dark:text-white">Hardware</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400">Arduino & IoT</div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;