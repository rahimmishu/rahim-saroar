import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Star, MessageCircle, Quote } from "lucide-react";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    // 🔥 Marquee এর জন্য একটু বেশি ডেটা (10টি) লোড করছি
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeedbacks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="relative py-20 overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container relative z-10 px-4 mx-auto mb-12 text-center">
        <h2 className="mb-3 text-3xl font-bold transition-colors duration-300 md:text-5xl text-slate-900 dark:text-white">
          People <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Love Us</span>
        </h2>
        <p className="transition-colors duration-300 text-slate-600 dark:text-slate-400">See what others are saying</p>
      </div>

      {feedbacks.length > 0 ? (
        <div className="relative flex w-full overflow-hidden mask-gradient-x">
          
          {/* 🔥 Infinite Marquee Animation Wrapper */}
          <div className="flex gap-6 py-4 animate-marquee whitespace-nowrap">
            
            {/* ডেটা ডুপ্লিকেট করা হচ্ছে ইনফিনিটি লুপের জন্য */}
            {[...feedbacks, ...feedbacks].map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="w-[300px] md:w-[380px] p-6 transition-all bg-white border shadow-lg dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm hover:border-yellow-500/30 flex-shrink-0 whitespace-normal group relative"
              >
                {/* Quote Icon */}
                <Quote className="absolute transition-colors top-4 right-6 text-slate-200 dark:text-slate-700 group-hover:text-yellow-500/20" size={40} />

                {/* Rating */}
                <div className="flex gap-1 mb-3 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < item.rating ? "currentColor" : "none"} 
                      className={i < item.rating ? "" : "text-slate-300 dark:text-slate-700"} 
                    />
                  ))}
                </div>

                {/* Review Message */}
                {/* আপনার ডেটাবেসে যদি 'message' ফিল্ড থাকে সেটা দেখাবে, না থাকলে ratingText */}
                <p className="mb-6 text-sm italic leading-relaxed text-slate-600 dark:text-slate-300 md:text-base opacity-90 line-clamp-3">
                  "{item.message || item.ratingText || "No comment provided."}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3 mt-auto">
                   <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white rounded-full shadow-md bg-gradient-to-tr from-yellow-400 to-orange-500 shrink-0">
                      {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name || "Anonymous"}</h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.ratingText || "Reviewer"}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-md p-10 mx-auto text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500">
           <MessageCircle className="mx-auto mb-2 opacity-50" />
           <p>No feedbacks yet. Be the first to share!</p>
        </div>
      )}

      {/* 🔥 CSS for Animation (Tailwind config এ না থাকলে এখান থেকে কাজ করবে) */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        /* হোভার করলে থামবে */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        /* দুই পাশে ফেইড ইফেক্ট */
        .mask-gradient-x {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>

    </section>
  );
};

export default FeedbackList;