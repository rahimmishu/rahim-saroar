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
      // 🔥 আইকনের সাইজ ফিক্স করা হয়েছে (24px)
      icon: <FileCode className="text-cyan-400" size={24} />, 
      link: "https://drive.google.com/file/d/1qWBKueSXK2EL57ezLngcViexqQ-XjXQz/view?usp=drive_link"
    },
    {
      id: 2,
      title: "Physics First Paper Suggestion",
      category: "Suggestion",
      size: "1.2 MB",
      date: "Dec 10, 2025",
      icon: <BookOpen className="text-purple-400" size={24} />,
      link: "/downloads/physics_sugg.pdf"
    },
    {
      id: 3,
      title: "Python Basic Cheat Sheet",
      category: "Programming",
      size: "5.0 MB",
      date: "Nov 20, 2025",
      icon: <FileText className="text-green-400" size={24} />,
      link: "/downloads/python_sheet.pdf"
    },
    {
      id: 4,
      title: "Chemistry Lab Manual",
      category: "Practical",
      size: "8.5 MB",
      date: "Oct 05, 2025",
      icon: <HardDrive className="text-red-400" size={24} />,
      link: "/downloads/chem_lab.pdf"
    }
  ];

  return (
    <section id="resources" className="relative py-12 md:py-20 bg-slate-900">
      <div className="container px-4 mx-auto md:px-6">
        
        {/* Header */}
        <div className="mb-8 text-center md:mb-16">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-5xl">
            Study <span className="text-cyan-400">Resources</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-base text-slate-400">
            Download my personal notes, suggestions, and coding materials for free.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid max-w-4xl gap-3 mx-auto md:gap-6 md:grid-cols-2 lg:grid-cols-2">
          {files.map((file) => (
            // 🔥 প্যাডিং কমানো হয়েছে: p-3 (মোবাইল)
            <div key={file.id} className="relative flex items-center justify-between w-full gap-2 p-3 overflow-hidden transition-all duration-300 border md:gap-4 md:p-5 group bg-slate-800/50 hover:bg-slate-800 border-slate-700 hover:border-cyan-500/50 rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10">
              
              {/* Left Side: Icon + Text */}
              <div className="flex items-center flex-1 min-w-0 gap-3">
                  
                  {/* Icon Box - প্যাডিং এবং সাইজ কমানো হয়েছে */}
                  <div className="shrink-0 p-2.5 md:p-4 bg-slate-900 rounded-xl group-hover:scale-110">
                    {file.icon}
                  </div>

                  {/* Text Info - min-w-0 দিয়ে টেক্সট ওভারফ্লো আটকানো হয়েছে */}
                  <div className="flex-1 min-w-0">
                    <h3 className="pr-1 text-sm font-bold text-white truncate transition-colors md:text-lg group-hover:text-cyan-400">
                      {file.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] md:text-xs text-slate-500">
                      <span className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 truncate max-w-[80px]">{file.category}</span>
                      <span className="whitespace-nowrap">{file.size}</span>
                      <span className="hidden sm:inline">• {file.date}</span>
                    </div>
                  </div>
              </div>

              {/* Download Button - Fixed Size */}
              <a 
                href={file.link} 
                download 
                className="p-2 ml-1 transition-all duration-300 border rounded-full shrink-0 md:p-3 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white border-cyan-500/20"
                title="Download Now"
              >
                {/* বাটন আইকন সাইজ ছোট করা হয়েছে */}
                <Download size={18} className="md:w-5 md:h-5" />
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Resources;