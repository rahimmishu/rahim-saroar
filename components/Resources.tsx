import React from 'react';
import { Download, FileText, BookOpen, FileCode, HardDrive } from 'lucide-react';

const Resources: React.FC = () => {

  const files = [
    {
      id: 1,
      title: "HSC Chemistry 1st Paper - Udvash (2025)",
      category: "Question Bank",
      size: "140 MB",
      date: "Feb 03, 2026",
      icon: <FileCode className="text-cyan-500" />,
      // 🔥 কালার ক্লাসগুলো ডায়নামিক করা হলো যাতে আইকনের ব্যাকগ্রাউন্ড সুন্দর দেখায়
      color: "text-cyan-500",
      bg: "bg-cyan-100 dark:bg-cyan-500/10",
      link: "https://drive.google.com/file/d/1qWBKueSXK2EL57ezLngcViexqQ-XjXQz/view?usp=drive_link"
    },
    {
      id: 2,
      title: "Physics First Paper Suggestion",
      category: "Suggestion",
      size: "1.2 MB",
      date: "Dec 10, 2025",
      icon: <BookOpen className="text-purple-500" />,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-500/10",
      link: "/downloads/physics_sugg.pdf"
    },
    {
      id: 3,
      title: "Python Basic Cheat Sheet",
      category: "Programming",
      size: "5.0 MB",
      date: "Nov 20, 2025",
      icon: <FileText className="text-green-500" />,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-500/10",
      link: "/downloads/python_sheet.pdf"
    },
    {
      id: 4,
      title: "Chemistry Lab Manual",
      category: "Practical",
      size: "8.5 MB",
      date: "Oct 05, 2025",
      icon: <HardDrive className="text-rose-500" />,
      color: "text-rose-500",
      bg: "bg-rose-100 dark:bg-rose-500/10",
      link: "/downloads/chem_lab.pdf"
    }
  ];

  return (
    // 🔥 FIX: Theme based background (Light: Slate-50, Dark: Slate-950/Dark Blue)
    <section id="resources" className="py-20 transition-colors duration-500 bg-slate-50 dark:bg-black">
      <div className="container px-4 mx-auto md:px-6">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900 md:text-5xl dark:text-white">
            Study <span className="text-blue-600 dark:text-cyan-400">Resources</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Download my personal notes, suggestions, and coding materials for free.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid max-w-4xl gap-4 mx-auto md:gap-6 md:grid-cols-2 lg:grid-cols-2">
          {files.map((file) => (
            <div 
              key={file.id} 
              // 🔥 FIX: Card Background (Light: White, Dark: Dark Blue #151e32) & Hover Effects
              className="relative flex items-center justify-between w-full gap-3 p-4 overflow-hidden transition-all duration-300 bg-white border dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 rounded-2xl group hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/30 dark:hover:border-cyan-500/30"
              >
              
              {/* Left Side: Icon + Text */}
              <div className="flex items-center flex-1 min-w-0 gap-4">
                  
                  {/* Icon Box - Dynamic Colors */}
                  <div className={`shrink-0 p-3.5 rounded-xl transition-transform group-hover:scale-110 ${file.bg}`}>
                    {/* আইকনের সাইজ ঠিক রাখা হয়েছে (24px default) */}
                    {React.cloneElement(file.icon as React.ReactElement, { size: 24 })}
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="pr-1 text-base font-bold truncate transition-colors text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                      {file.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-slate-600 dark:text-zinc-300 font-medium truncate max-w-[100px] border border-slate-200 dark:border-zinc-800">
                      </span>
                      <span className="font-medium whitespace-nowrap">{file.size}</span>
                      <span className="hidden sm:inline opacity-60">• {file.date}</span>
                    </div>
                  </div>
              </div>

              {/* Download Button */}
              <a 
                href={file.link} 
                download 
                className="p-3 transition-all duration-300 rounded-full shadow-sm shrink-0 bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white hover:shadow-md"
                title="Download Now"
              >
                <Download size={20} />
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Resources;