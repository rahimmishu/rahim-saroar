import React from 'react';
import { Film, ExternalLink, PlayCircle } from 'lucide-react'; // Heart সরিয়ে PlayCircle আনা হয়েছে

const CreativeWork: React.FC = () => {
  const videos = [
    {
      id: 1,
      title: "The Art of Silence",
      tag: "Cinematic",
      videoId: "F02iMCEEQWs" 
    },
    {
      id: 2,
      title: "Voice of the Unheard",
      tag: "Storytelling",
      videoId: "1R47EQrxgfw"
    },
    {
      id: 3,
      title: "Nature's Rhythm",
      tag: "Videography",
      videoId: "MWPYhebILb4"
    }
  ];

  return (
    <section id="creative" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900 rounded-full blur-[128px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-wider text-blue-200 border border-white/10">
                <Film size={14} />
                <span>CONTENT CREATION</span>
            </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Beyond Coding: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">My Creative Side</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
             Founder of <span className="text-white font-medium">'Rhythm of Peace'</span> | Video Editor | Storyteller
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((video) => (
                <div key={video.id} className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl hover:shadow-blue-900/20 transition-all duration-500">
                    
                    {/* Video Player Section */}
                    <div className="relative aspect-video overflow-hidden bg-black">
                        <iframe 
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.videoId}`} 
                            title={video.title}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>
                        </iframe>
                        
                        {/* Tag overlay */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/10 pointer-events-none">
                            {video.tag}
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{video.title}</h3>
                        
                        {/* 👇 এখানে পরিবর্তন করা হয়েছে: Watch Now বাটন 👇 */}
                        <div className="flex items-center justify-between text-slate-500 text-sm">
                            <span className="flex items-center gap-1.5 text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                                <PlayCircle size={16} /> Watch Now
                            </span>
                            <span>Full HD</span>
                        </div>

                    </div>
                </div>
            ))}
        </div>

        <div className="mt-16 text-center">
            <a 
                href="https://www.facebook.com/rhythm2OfPeace" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-lg hover:shadow-white/20 transform hover:-translate-y-1"
            >
                Visit 'Rhythm of Peace' Page
                <ExternalLink size={20} />
            </a>
        </div>
      </div>
    </section>
  );
};

export default CreativeWork;