import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Star, MessageCircle } from "lucide-react";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeedbacks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="max-w-6xl px-6 py-20 mx-auto">
      <div className="mb-12 text-center">
         {/* 🔥 ফিক্স: টেক্সট কালার এখন ডায়নামিক (Light: Slate-900, Dark: White) */}
         <h2 className="mb-3 text-3xl font-bold transition-colors duration-300 md:text-4xl text-slate-900 dark:text-white">
           People <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Love Us</span>
         </h2>
         <p className="transition-colors duration-300 text-slate-600 dark:text-slate-400">See what others are saying</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((item) => (
          <div 
            key={item.id} 
            // 🔥 ফিক্স: কার্ডের ব্যাকগ্রাউন্ডও এখন লাইট মোডে সাদা হবে
            className="p-6 transition-all bg-white border shadow-lg dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm hover:border-yellow-500/30 dark:shadow-none group"
          >
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white rounded-full shadow-md bg-gradient-to-tr from-yellow-400 to-orange-500">
                      {item.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                      {/* 🔥 ফিক্স: নামের কালার ঠিক করা হয়েছে */}
                      <h4 className="text-sm font-bold transition-colors duration-300 text-slate-900 dark:text-white">{item.name}</h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.ratingText}</span>
                   </div>
                </div>
                <div className="flex text-yellow-500">
                   {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                   ))}
                </div>
             </div>
             
             <div className="w-full h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" 
                  style={{ width: `${(item.rating / 5) * 100}%` }}
                ></div>
             </div>
          </div>
        ))}
      </div>
      
      {feedbacks.length === 0 && (
         <div className="p-10 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500">
            <MessageCircle className="mx-auto mb-2 opacity-50" />
            <p>No feedbacks yet. Be the first to share!</p>
         </div>
      )}
    </section>
  );
};

export default FeedbackList;