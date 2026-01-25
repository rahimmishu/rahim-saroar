import React from 'react';
import { Facebook, ExternalLink, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

const FacebookFeed: React.FC = () => {
  
  // ✅ পাবলিক ফোল্ডারের ছবির জন্য এভাবে লিখুন
const PROFILE_PIC = "/fb-profile.png"; 
  // টিপস: আপনি আপনার আসল ছবির লিংক এখানে পেস্ট করবেন।

  // ✅ ২. আপনার পোস্টের তথ্য
  const posts = [
    {
      id: 1,
      date: "January 20, 2026",
      text: "আলহামদুলিল্লাহ! অবশেষে আমার পার্সোনাল পোর্টফোলিও ওয়েবসাইট লাইভ হলো। React, Next.js এবং Tailwind CSS দিয়ে তৈরি। আপনাদের মতামত আশা করছি! 🚀💻",
      image: "/portfolio.png", //
      link: "https://www.facebook.com/rahimsaroar", // 
      likes: "120",
      comments: "45"
    },
    {
      id: 2,
      date: "December 16, 2025",
      text: "বিজয় দিবসের শুভেচ্ছা! 🇧🇩 প্রযুক্তির সাথে স্বপ্নের পথে এগিয়ে যাক বাংলাদেশ।",
      image: "/victory.jpg", //
      link: "https://www.facebook.com/rahimsaroar",
      likes: "250",
      comments: "82"
    },
    {
      id: 3,
      date: "November 10, 2025",
      text: "নতুন কিছু শেখার চেষ্টা করছি... কোডিং ইজ লাভ! 💻☕ #WebDevelopment #CodingLife",
      image: "/code-scaled.jpg", //
      link: "https://www.facebook.com/rahimsaroar",
      likes: "120",
      comments: "12"
    }
  ];

  return (
    <section className="py-20 bg-slate-900 border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
            <div className="p-3 bg-blue-600/20 rounded-full text-blue-500 mb-4 animate-bounce-slow">
                <Facebook size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Latest from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Facebook</span>
            </h2>
            {/* ✅ নাম পরিবর্তন করা হয়েছে */}
            <p className="text-slate-400">Follow <span className='text-blue-400 font-semibold'>Rahim Saroar</span> for daily updates</p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-950/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)] group">
              
              {/* Image Section */}
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src={post.image} 
                  alt="Post" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 bg-white/10 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-md transition-colors border border-white/20">
                    <ExternalLink size={16} />
                </a>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    {/* ✅ আপনার প্রোফাইল পিকচার এখানে দেখাবে */}
                    <img src={PROFILE_PIC} alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-500/30 object-cover" />
                    <div>
                        {/* ✅ নাম পরিবর্তন করা হয়েছে */}
                        <h4 className="text-sm font-bold text-white leading-none mb-1">Rahim Saroar</h4>
                        <span className="text-xs text-slate-500">{post.date}</span>
                    </div>
                </div>

                <p className="text-slate-300 text-sm line-clamp-3 mb-6 leading-relaxed font-light">
                  {post.text}
                </p>

                {/* Footer Stats */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5 text-slate-500 text-xs font-mono">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1 hover:text-blue-400 transition-colors"><ThumbsUp size={14} /> {post.likes}</span>
                        <span className="flex items-center gap-1 hover:text-blue-400 transition-colors"><MessageCircle size={14} /> {post.comments}</span>
                    </div>
                    <span className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer"><Share2 size={14} /> Share</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
            <a href="https://www.facebook.com/rahimsaroar" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
                Visit Facebook Profile <ExternalLink size={18} />
            </a>
        </div>

      </div>
    </section>
  );
};

export default FacebookFeed;