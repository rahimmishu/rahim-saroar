import React from 'react';
import { Facebook, ExternalLink, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

const FacebookFeed: React.FC = () => {
  
  // ✅ ১. প্রোফাইল পিকচার (আপনার দেওয়া পাথ)
  const PROFILE_PIC = "/fb-profile.png"; 

  // ✅ ২. আপনার পোস্টের তথ্য (আপনার দেওয়া বাংলা কন্টেন্ট)
  const posts = [
    {
      id: 1,
      date: "January 20, 2026",
      text: "আলহামদুলিল্লাহ! অবশেষে আমার পার্সোনাল পোর্টফোলিও ওয়েবসাইট লাইভ হলো। React, Next.js এবং Tailwind CSS দিয়ে তৈরি। আপনাদের মতামত আশা করছি! 🚀💻",
      image: "/portfolio.png", 
      link: "https://www.facebook.com/rahimsaroar",
      likes: "120",
      comments: "45"
    },
    {
      id: 2,
      date: "December 16, 2025",
      text: "বিজয় দিবসের শুভেচ্ছা! 🇧🇩 প্রযুক্তির সাথে স্বপ্নের পথে এগিয়ে যাক বাংলাদেশ।",
      image: "/victory.jpg",
      link: "https://www.facebook.com/rahimsaroar",
      likes: "250",
      comments: "82"
    },
    {
      id: 3,
      date: "November 10, 2025",
      text: "নতুন কিছু শেখার চেষ্টা করছি... কোডিং ইজ লাভ! 💻☕ #WebDevelopment #CodingLife",
      image: "/code-scaled.jpg",
      link: "https://www.facebook.com/rahimsaroar",
      likes: "120",
      comments: "12"
    }
  ];

  return (
    // 🔥 FIX: Theme based background (Light: Slate-50, Dark: Dark Blue)
    <section className="relative py-20 overflow-hidden transition-colors duration-500 border-t bg-slate-50 dark:bg-black border-slate-200 dark:border-zinc-900">
      
      {/* Background Glow (Theme Adaptive) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 px-6 mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
            <div className="p-3 mb-4 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-600/20 dark:text-blue-500 animate-bounce-slow">
                <Facebook size={32} />
            </div>
            <h2 className="mb-2 text-3xl font-extrabold md:text-5xl text-slate-900 dark:text-white">
                Latest from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">Facebook</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
                Follow <span className='font-semibold text-blue-600 dark:text-blue-400'>Rahim Saroar</span> for daily updates
            </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <div 
              key={post.id} 
              // 🔥 FIX: Card Styling for Light/Dark Mode
              className="overflow-hidden transition-all duration-300 bg-white border dark:bg-zinc-950 border-slate-200 dark:border-zinc-900 rounded-2xl hover:border-blue-500/40 hover:-translate-y-2 hover:shadow-xl group"
              >
              
              {/* Image Section */}
              <div className="relative overflow-hidden h-52 bg-slate-100 dark:bg-zinc-900">
                <img 
                  src={post.image} 
                  alt="Post" 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:opacity-100" />
                
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="absolute p-2 transition-colors rounded-full shadow-sm top-4 right-4 bg-white/90 dark:bg-black/50 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-700 dark:text-white hover:text-white backdrop-blur-md">
                    <ExternalLink size={16} />
                </a>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    {/* প্রোফাইল পিকচার */}
                    <div className="w-10 h-10 overflow-hidden border-2 rounded-full border-slate-200 dark:border-blue-500/30">
                        <img src={PROFILE_PIC} alt="Profile" className="object-cover w-full h-full" />
                    </div>
                    <div>
                        <h4 className="mb-1 text-sm font-bold leading-none text-slate-900 dark:text-white">Rahim Saroar</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{post.date}</span>
                    </div>
                </div>

                {/* Post Text (Light/Dark text color fixed) */}
                <p className="mb-6 text-sm font-normal leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-3">
                  {post.text}
                </p>

                {/* Footer Stats */}
                <div className="flex items-center justify-between pt-4 text-xs font-medium border-t border-slate-100 dark:border-zinc-900 text-slate-500 dark:text-slate-400">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"><ThumbsUp size={14} /> {post.likes}</span>
                        <span className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"><MessageCircle size={14} /> {post.comments}</span>
                    </div>
                    <span className="flex items-center gap-1 transition-colors cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"><Share2 size={14} /> Share</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
            <a href="https://www.facebook.com/rahimsaroar" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white transition-all bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95">
                Visit Facebook Profile <ExternalLink size={18} />
            </a>
        </div>

      </div>
    </section>
  );
};

export default FacebookFeed;