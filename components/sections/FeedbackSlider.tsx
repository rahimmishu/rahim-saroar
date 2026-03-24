import React, { useState, useEffect } from 'react';
import { Angry, Frown, Meh, Smile, Star, CheckCircle, X, User, Loader2 } from 'lucide-react';
import { db } from "../../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const alreadySubmitted = localStorage.getItem('feedback_submitted');
      if (!alreadySubmitted) {
        setIsVisible(true);
      }
    }, 300000); 

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
    
    setLoading(true);

    try {
      await addDoc(collection(db, "feedbacks"), {
        name: name,
        rating: level,
        ratingText: currentMood.label,
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      localStorage.setItem('feedback_submitted', 'true');
      
      if (onSubmit) {
        onSubmit({
          name: name,
          rating: level,
          label: currentMood.label
        });
      }
      
      setTimeout(() => setIsVisible(false), 2500);

    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* CSS Injection for Styles */}
      <style>{`
        .feedback-card {
          background: #ffffff;
          width: 100%;
          max-width: 400px;
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .dark .feedback-card {
          background: #1e293b;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .icon-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--theme-color);
          filter: blur(20px);
          opacity: 0.3;
          animation: pulse 2s infinite;
        }
        .icon-stage {
          position: relative;
          z-index: 10;
          color: var(--theme-color);
          filter: drop-shadow(0 5px 15px var(--theme-shadow));
        }
        .mood-label {
          color: var(--theme-color);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .slider-container input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #e2e8f0;
          outline: none;
          background-image: linear-gradient(to right, var(--theme-color), var(--theme-color));
          background-repeat: no-repeat;
          margin-bottom: 24px;
        }
        .dark .slider-container input[type="range"] {
          background: #334155;
        }
        .slider-container input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: #fff;
          border: 4px solid var(--theme-color);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px var(--theme-shadow);
          transition: transform 0.1s;
        }
        .slider-container input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: var(--theme-color);
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 5px 15px var(--theme-shadow);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px var(--theme-shadow);
        }
        .submit-btn:active {
          transform: translateY(0);
        }
        .pop-anim {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(0.8); opacity: 0.3; }
        }
        /* Success Overlay Styles */
        .success-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          min-height: 300px; /* Fixed height to match form view */
        }
      `}</style>

      <div 
        className="relative mx-4 feedback-card dark"
        style={{
          '--theme-color': currentMood.color,
          '--theme-shadow': currentMood.shadow,
        } as React.CSSProperties}
      >
        {/* Close Button (Only show if not submitted) */}
        {!isSubmitted && (
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute transition-colors top-4 right-4 text-slate-400 hover:text-red-500"
          >
            <X size={24} />
          </button>
        )}

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
          /* 🔥 SUCCESS MESSAGE FIXED */
          <div className="duration-300 success-overlay animate-in fade-in zoom-in">
            <div style={{ color: '#00b894', marginBottom: '20px' }}>
              <CheckCircle size={80} className="pop-anim drop-shadow-lg" />
            </div>
            <h2 className="mb-2 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Thank You!
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
              Your feedback helps us grow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSlider;