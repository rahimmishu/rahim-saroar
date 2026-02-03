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
      icon: <FileCode className="text-cyan-400" size={32} />,
      link: "https://drive.google.com/file/d/1qWBKueSXK2EL57ezLngcViexqQ-XjXQz/view?usp=drive_link"
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
    <section id="resources" className="relative py-20 bg-slate-900">
      <div className="container px-6 mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            Study <span className="text-cyan-400">Resources</span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-400">
            Download my personal notes, suggestions, and coding materials for free.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid max-w-4xl gap-6 mx-auto md:grid-cols-2 lg:grid-cols-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-4 p-5 transition-all duration-300 border group bg-slate-800/50 hover:bg-slate-800 border-slate-700 hover:border-cyan-500/50 rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10">
              
              {/* Icon Box */}
              <div className="p-4 transition-transform duration-300 bg-slate-900 rounded-xl group-hover:scale-110">
                {file.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white transition-colors group-hover:text-cyan-400">
                  {file.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">{file.category}</span>
                  <span>{file.size}</span>
                  <span>• {file.date}</span>
                </div>
              </div>

              {/* Download Button */}
              <a 
                href={file.link} 
                download 
                className="p-3 transition-all duration-300 border rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white border-cyan-500/20"
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