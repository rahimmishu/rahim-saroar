import React from 'react';
import { GraduationCap, Code2, Cpu } from 'lucide-react';

const About: React.FC = () => {
  return (
    // পরিবর্তন ১: dark:bg-black
    <section id="about" className="py-24 transition-colors duration-300 bg-white dark:bg-black">
      <div className="container px-4 mx-auto md:px-8">
        
        {/* পরিবর্তন ২: dark:bg-zinc-950 এবং বর্ডার dark:border-zinc-800 */}
        <div className="flex flex-col items-center gap-12 p-8 border shadow-sm bg-slate-50 dark:bg-zinc-950 rounded-3xl md:p-12 border-slate-100 dark:border-zinc-800 lg:flex-row">
          
          {/* Image Side */}
          <div className="flex justify-center w-full lg:w-1/3 lg:justify-start">
            <div className="relative group">
              {/* ছবির বর্ডার পরিবর্তন: dark:border-zinc-800 */}
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-[6px] border-white dark:border-zinc-800 shadow-xl">
                <img 
                  src="./1.jpg" 
                  alt="Rahim Saroar Mishu" 
                  className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-105"
                />
              </div>
              <div className="absolute p-3 text-white border-4 border-white rounded-full shadow-lg bottom-6 right-6 bg-primary dark:border-zinc-800">
                <Code2 size={24} />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full space-y-6 text-center lg:w-2/3 lg:text-left">
            <div>
              {/* ব্যাজ পরিবর্তন: dark:bg-zinc-800 */}
              <div className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider uppercase bg-blue-100 rounded-full dark:bg-zinc-800 text-primary dark:text-blue-300">
                About Me
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Rahim Saroar Mishu</h2>
              <p className="mt-2 text-lg font-medium text-slate-500 dark:text-slate-400">
                11th Grade Science Student | Tech Enthusiast
              </p>
            </div>

            <div className="space-y-4 text-lg leading-relaxed text-left text-slate-600 dark:text-slate-300">
              <p>
                Hi, I am <span className="font-bold text-slate-900 dark:text-white">Rahim Saroar Mishu</span>. 
                I am a 19-year-old Science student from Bangladesh. I love technology and bringing ideas to life.
              </p>

              <div>
                <p className="mb-3 font-bold text-slate-900 dark:text-white">Here is what I do:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0">🚀</span> 
                    <span><span className="font-bold text-slate-800 dark:text-zinc-200">Python & AI:</span> I build smart projects like GPS trackers and voice assistants.</span>
                  </li>
                  {/* ... (বাকি লিস্ট একই থাকবে) */}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
               {/* পরিবর্তন ৩: dark:bg-black এবং dark:border-zinc-800 */}
               <div className="flex items-center gap-3 p-4 bg-white border shadow-sm dark:bg-black rounded-xl border-slate-100 dark:border-zinc-800">
                 <div className="p-2 text-green-600 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400"><GraduationCap size={20}/></div>
                 <div className="text-left">
                   <div className="font-bold text-slate-900 dark:text-white">Education</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400">11th Grade Science</div>
                 </div>
               </div>
               
               <div className="flex items-center gap-3 p-4 bg-white border shadow-sm dark:bg-black rounded-xl border-slate-100 dark:border-zinc-800">
                 <div className="p-2 text-orange-600 bg-orange-100 rounded-lg dark:bg-orange-900/30 dark:text-orange-400"><Cpu size={20}/></div>
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