import React, { useState, useEffect } from 'react';
import { Angry, Frown, Meh, Smile, Star, CheckCircle, X, User, Loader2 } from 'lucide-react';
import { db } from "../firebase"; // ✅ Firebase ডেটাবেস ইম্পোর্ট
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // ✅ ফায়ারবেস ফাংশন

// Mood Configuration
const moodConfig: any = {
  1: { color: "#ff4757", shadow: "rgba(255, 71, 87, 0.4)", label: "Terrible", Icon: Angry },
  2: { color: "#ffa502", shadow: "rgba(255, 165, 2, 0.4)", label: "Bad", Icon: Frown },
  3: { color: "#ffd32a", shadow: "rgba(255, 211, 42, 0.4)", label: "Okay", Icon: Meh },
  4: { color: "#00b894", shadow: "rgba(0, 184, 148, 0.4)", label: "Good", Icon: Smile },
  5: { color: "#6c5ce7", shadow: "rgba(108, 92, 231, 0.4)", label: "Excellent!", Icon: Star }
};

interface FeedbackSliderProps {
  onSubmit?: (data: { name: string; rating: number; label: string }) => void;
}

const FeedbackSlider: React.FC<FeedbackSliderProps> = ({ onSubmit }) => {
  const [value, setValue] = useState(50);
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ লোডিং স্টেট যোগ করা হয়েছে

  // 🔥 5 মিনিট (300,000 ms) পর পপ-আপ চালু হবে
  useEffect(() => {
    const timer = setTimeout(() => {
      // যদি আগে সাবমিট না করে থাকে, তবেই দেখাবে
      const alreadySubmitted = localStorage.getItem('feedback_submitted');
      if (!alreadySubmitted) {
        setIsVisible(true);
      }
    }, 300000); // 5 minutes

    return () => clearTimeout(timer);
  }, []);

  const getLevel = (val: number) => {
    if (val >= 80) return 5;
    if (val >= 60) return 4;
    if (val >= 40) return 3;
    if (val >= 20) return 2;
    return 1;
  };

  const level = getLevel(value);
  const currentMood = moodConfig[level];

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Please enter your name!");
    
    setLoading(true); // লোডিং শুরু

    try {
      // ✅ ফায়ারবেসে ডাটা সেভ করা হচ্ছে
      await addDoc(collection(db, "feedbacks"), {
        name: name,
        rating: level,          // 1 থেকে 5 এর মধ্যে রেটিং
        ratingText: currentMood.label, // যেমন: "Good", "Excellent!"
        createdAt: serverTimestamp(),  // সময়
      });

      // সফল হলে
      setIsSubmitted(true);
      localStorage.setItem('feedback_submitted', 'true');
      
      // প্যারেন্ট কম্পোনেন্টকে জানানো (যদি দরকার হয়)
      if (onSubmit) {
        onSubmit({
          name: name,
          rating: level,
          label: currentMood.label
        });
      }
      
      // ২.৫ সেকেন্ড পর অটোমেটিক বন্ধ হবে
      setTimeout(() => setIsVisible(false), 2500);

    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Something went wrong! Please try again.");
    }

    setLoading(false); // লোডিং শেষ
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative mx-4 feedback-card"
        style={{
          '--theme-color': currentMood.color,
          '--theme-shadow': currentMood.shadow,
        } as React.CSSProperties}
      >
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute transition-colors top-4 right-4 text-slate-400 hover:text-red-500"
        >
          <X size={24} />
        </button>

        {!isSubmitted ? (
          <div className="form-view">
            <div className="icon-wrapper">
              <div className="icon-glow"></div>
              <div className="icon-stage">
                <currentMood.Icon key={level} size={80} className="pop-anim" />
              </div>
            </div>

            <h2 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">
              Feedback Time!
            </h2>
            <div className="mood-label">{currentMood.label}</div>

            {/* Name Input */}
            <div className="relative mb-6">
              <User className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 border-none outline-none focus:ring-2 focus:ring-[var(--theme-color)] transition-all dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="slider-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={value} 
                onChange={(e) => setValue(parseInt(e.target.value))}
                style={{ backgroundSize: `${value}% 100%` }}
              />
            </div>

            <button 
              type="button" 
              className="flex items-center justify-center gap-2 submit-btn disabled:opacity-70 disabled:cursor-not-allowed" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Share Feedback"}
            </button>
          </div>
        ) : (
          <div className="success-overlay active">
            <div style={{ color: '#00b894', marginBottom: '20px' }}>
              <CheckCircle size={80} className="pop-anim" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Thank You!</h2>
            <p className="text-slate-400">Feedback saved successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSlider;