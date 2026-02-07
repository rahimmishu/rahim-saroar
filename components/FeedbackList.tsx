import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Star, Quote } from "lucide-react";

// 🔥 Custom Feedback Data with Local Images
const customFeedbacks = [
  {
    id: "custom-1",
    name: "Rahim Saroar",
    rating: 5,
    message: "অসাধারণ কাজ! ওয়েবসাইটটি খুব ফাস্ট এবং ইউজার ফ্রেন্ডলি। ডিজাইনের ডিটেইলসগুলো আমার খুব ভালো লেগেছে।",
    ratingText: "Full Stack Developer",
    color: "from-blue-500 to-cyan-500",
    // ✅ Public Folder Image Path
    photoURL: "/users/9.jpg" 
  },
  {
    id: "custom-2",
    name: "Samiul Islam",
    rating: 5,
    message: "ডার্ক মোডের কালার কম্বিনেশনটা জাস্ট ওয়াও! চোখের জন্য খুব আরামদায়ক। কিপ ইট আপ!",
    ratingText: "UI/UX Designer",
    color: "from-purple-500 to-pink-500",
    // ✅ Public Folder Image Path
    photoURL: "/users/2.jpg"
  },
  {
    id: "custom-3",
    name: "Fariha Rahman",
    rating: 4,
    message: "আমি অনেক ওয়েবসাইট দেখেছি, কিন্তু এমন স্মুথ অ্যানিমেশন খুব কমই চোখে পড়ে। খুব প্রফেশনাল কাজ।",
    ratingText: "Content Creator",
    color: "from-orange-500 to-red-500",
    // ✅ Public Folder Image Path
    photoURL: "/users/3.jpg"
  },
  {
    id: "custom-4",
    name: "Tanvir Ahmed",
    rating: 5,
    message: "কোড স্ট্রাকচার খুব ক্লিন মনে হচ্ছে। পোর্টফোলিও হিসেবে এটি একটি পারফেক্ট উদাহরণ।",
    ratingText: "Software Engineer",
    color: "from-green-500 to-teal-500",
    // ✅ Public Folder Image Path
    photoURL: "/users/4.jpg"
  },
  {
    id: "custom-5",
    name: "Nusrat Jahan",
    rating: 5,
    message: "খুব সুন্দর এবং গোছানো। মোবাইল ভিউতেও সবকিছু ঠিকঠাক কাজ করছে। বেস্ট অফ লাক!",
    ratingText: "Digital Marketer",
    color: "from-pink-500 to-rose-500",
    // ✅ Public Folder Image Path
    photoURL: "/users/5.jpg"
  },
];

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const realData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks([...realData, ...customFeedbacks]);
    });

    return () => unsubscribe();
  }, []);

  const displayFeedbacks = feedbacks.length > 0 ? feedbacks : customFeedbacks;

  return (
    <section className="relative py-20 overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-black">
      
      {/* 🔥 Import Premium Bengali Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
        
        .font-bangla-premium {
          font-family: 'Hind Siliguri', sans-serif;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .mask-gradient-x {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container relative z-10 px-4 mx-auto mb-12 text-center">
        <h2 className="mb-3 text-3xl font-bold transition-colors duration-300 md:text-5xl text-slate-900 dark:text-white">
          People <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Love Us</span>
        </h2>
        <p className="transition-colors duration-300 text-slate-600 dark:text-slate-400">See what others are saying</p>
      </div>

      <div className="relative flex w-full overflow-hidden mask-gradient-x">
        
        {/* Infinite Marquee Animation Wrapper */}
        <div className="flex gap-6 py-4 animate-marquee whitespace-nowrap">
          
          {[...displayFeedbacks, ...displayFeedbacks].map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="w-[300px] md:w-[380px] p-6 transition-all bg-white border shadow-lg dark:bg-zinc-950/60 border-slate-200 dark:border-zinc-800 rounded-2xl backdrop-blur-sm hover:border-yellow-500/30 flex-shrink-0 whitespace-normal group relative"
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

              {/* Review Message with Premium Font */}
              <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-[15px] opacity-90 line-clamp-3 font-bangla-premium font-medium">
                "{item.message || item.ratingText || "No comment provided."}"
              </p>

              {/* User Info with Photo or Initial */}
              <div className="flex items-center gap-3 mt-auto">
                 {/* 🔥 Logic Update: ছবি দেখানোর নিয়ম */}
                 {item.photoURL ? (
                   <img
                     src={item.photoURL}
                     alt={item.name || "User"}
                     // onError হ্যান্ডলার যোগ করা হয়েছে যাতে ছবি না পেলে ইনিশিয়াল দেখায় (অপশনাল সেফটি)
                     onError={(e) => {
                       (e.target as HTMLImageElement).style.display = 'none';
                       (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                     }}
                     className="object-cover w-10 h-10 border-2 border-white rounded-full shadow-md shrink-0 dark:border-zinc-800"
                   />
                 ) : null}
                 
                 {/* Fallback Initial (যদি ছবি না থাকে বা লোড না হয়) */}
                 <div className={`${item.photoURL ? 'hidden' : 'flex'} items-center justify-center w-10 h-10 text-lg font-bold text-white rounded-full shadow-md bg-gradient-to-tr shrink-0 ${item.color || "from-yellow-400 to-orange-500"}`}>
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

    </section>
  );
};

export default FeedbackList;