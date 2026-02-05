import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Star, MessageCircle } from "lucide-react";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    // ডাটাবেস থেকে রিয়েল-টাইম ডাটা আনবে
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeedbacks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="max-w-6xl px-6 py-20 mx-auto">
      <div className="mb-12 text-center">
         <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
           People <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Love Us</span>
         </h2>
         <p className="text-slate-400">See what others are saying</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((item) => (
          <div key={item.id} className="p-6 transition-all border bg-slate-900/50 border-slate-800 rounded-2xl backdrop-blur-sm hover:border-yellow-500/30 group">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500">
                      {item.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.ratingText}</span>
                   </div>
                </div>
                <div className="flex text-yellow-500">
                   {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                   ))}
                </div>
             </div>
             
             <div className="w-full h-1 overflow-hidden rounded-full bg-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" 
                  style={{ width: `${(item.rating / 5) * 100}%` }}
                ></div>
             </div>
          </div>
        ))}
      </div>
      
      {feedbacks.length === 0 && (
         <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
            <MessageCircle className="mx-auto mb-2 opacity-50" />
            <p>No feedbacks yet. Be the first to share!</p>
         </div>
      )}
    </section>
  );
};

export default FeedbackList;