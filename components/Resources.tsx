import React from 'react';
import { Download, FileText, BookOpen, FileCode, HardDrive } from 'lucide-react';

const Resources: React.FC = () => {

  const files = [
    {
      id: 1,
      title: "HSC Exam routine 2026",
      category: "routine",
      size: "2.5 MB",
      date: "Jan 25, 2026",
      icon: <FileCode className="text-cyan-400" size={32} />,
      link: "/downloads/Exam routine.pdf"
    },
    {
      id: 2,
      title: "Physics First Paper Suggestion",
      category: "Suggestion",
      size: "1.2 MB",
      date: "Dec 10, 2025",
      icon: <BookOpen className="text-purple-400" size={32} />,
      link: "/downloads/physics_sugg.pdf"
    },
    {
      id: 3,
      title: "Python Basic Cheat Sheet",
      category: "Programming",
      size: "5.0 MB",
      date: "Nov 20, 2025",
      icon: <FileText className="text-green-400" size={32} />,
      link: "/downloads/python_sheet.pdf"
    },
    {
      id: 4,
      title: "Chemistry Lab Manual",
      category: "Practical",
      size: "8.5 MB",
      date: "Oct 05, 2025",
      icon: <HardDrive className="text-red-400" size={32} />,
      link: "/downloads/chem_lab.pdf"
    }
  ];

  return (
    <section id="resources" className="py-20 bg-slate-900 relative">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Study <span className="text-cyan-400">Resources</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Download my personal notes, suggestions, and coding materials for free.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {files.map((file) => (
            <div key={file.id} className="group flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10">
              
              {/* Icon Box */}
              <div className="p-4 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {file.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {file.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">{file.category}</span>
                  <span>{file.size}</span>
                  <span>• {file.date}</span>
                </div>
              </div>

              {/* Download Button */}
              <a 
                href={file.link} 
                download 
                className="p-3 bg-cyan-500/10 text-cyan-400 rounded-full hover:bg-cyan-500 hover:text-white transition-all duration-300 border border-cyan-500/20"
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

// 👇 এই লাইনটিই মিসিং ছিল বা ভুল ছিল
export default Resources;