import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Star, Quote, Shield, TrendingUp, Users, Award } from "lucide-react";

// 🔥 Custom Feedback Data with Local Images
const customFeedbacks = [
  {
    id: "custom-1",
    name: "Rahim Saroar",
    rating: 5,
    message: "অসাধারণ কাজ! ওয়েবসাইটটি খুব ফাস্ট এবং ইউজার ফ্রেন্ডলি। ডিজাইনের ডিটেইলসগুলো আমার খুব ভালো লেগেছে।",
    ratingText: "Full Stack Developer",
    color: "from-blue-500 to-cyan-500",
    accent: "#3b82f6",
    photoURL: "/users/9.jpg",
    verified: true,
    date: "2 days ago"
  },
  {
    id: "custom-2",
    name: "Samiul Islam",
    rating: 5,
    message: "ডার্ক মোডের কালার কম্বিনেশনটা জাস্ট ওয়াও! চোখের জন্য খুব আরামদায়ক। কিপ ইট আপ!",
    ratingText: "UI/UX Designer",
    color: "from-purple-500 to-pink-500",
    accent: "#a855f7",
    photoURL: "/users/2.png",
    verified: true,
    date: "5 days ago"
  },
  {
    id: "custom-3",
    name: "Fariha Rahman",
    rating: 4,
    message: "আমি অনেক ওয়েবসাইট দেখেছি, কিন্তু এমন স্মুথ অ্যানিমেশন খুব কমই চোখে পড়ে। খুব প্রফেশনাল কাজ।",
    ratingText: "Content Creator",
    color: "from-orange-500 to-red-500",
    accent: "#f97316",
    photoURL: "/users/3.jpg",
    verified: false,
    date: "1 week ago"
  },
  {
    id: "custom-4",
    name: "Tanvir Ahmed",
    rating: 5,
    message: "কোড স্ট্রাকচার খুব ক্লিন মনে হচ্ছে। পোর্টফোলিও হিসেবে এটি একটি পারফেক্ট উদাহরণ।",
    ratingText: "Software Engineer",
    color: "from-green-500 to-teal-500",
    accent: "#22c55e",
    photoURL: "/users/4.jpg",
    verified: true,
    date: "3 days ago"
  },
  {
    id: "custom-5",
    name: "Nusrat Jahan",
    rating: 5,
    message: "খুব সুন্দর এবং গোছানো। মোবাইল ভিউতেও সবকিছু ঠিকঠাক কাজ করছে। বেস্ট অফ লাক!",
    ratingText: "Digital Marketer",
    color: "from-pink-500 to-rose-500",
    accent: "#ec4899",
    photoURL: "/users/5.png",
    verified: true,
    date: "Yesterday"
  },
  {
    id: "custom-6",
    name: "Arif Hossain",
    rating: 5,
    message: "পারফরম্যান্স অসাধারণ! লোডিং টাইম এত কম আগে কোথাও দেখিনি। সত্যিই ইম্প্রেসিভ কাজ।",
    ratingText: "Backend Developer",
    color: "from-indigo-500 to-blue-500",
    accent: "#6366f1",
    photoURL: "/users/6.png",
    verified: true,
    date: "4 days ago"
  },
  {
    id: "custom-7",
    name: "Riya Sultana",
    rating: 5,
    message: "এই পোর্টফোলিওটা দেখে আমি নিজেও অনুপ্রাণিত হয়েছি। ক্রিয়েটিভিটি এবং টেকনিক্যাল স্কিলের অসাধারণ মিশ্রণ।",
    ratingText: "Graphic Designer",
    color: "from-yellow-500 to-amber-500",
    accent: "#eab308",
    photoURL: "/users/7.jpg",
    verified: false,
    date: "6 days ago"
  },
  {
    id: "custom-8",
    name: "Kamal Uddin",
    rating: 5,
    message: "রেসপন্সিভ ডিজাইনটা পারফেক্ট। ছোট স্ক্রিনেও সব এলিমেন্ট সুন্দরভাবে দেখা যাচ্ছে। দারুণ কাজ!",
    ratingText: "Project Manager",
    color: "from-teal-500 to-cyan-500",
    accent: "#14b8a6",
    photoURL: "/users/8.jpg",
    verified: true,
    date: "1 day ago"
  },
];

// Split feedbacks into two rows
const row1Feedbacks = customFeedbacks.slice(0, 4);
const row2Feedbacks = customFeedbacks.slice(4, 8);

// Stat counter animation hook
const useCountUp = (target: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

// ⭐ Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        className={`${i < rating ? "text-amber-400" : "text-slate-600"} sm:w-[14px] sm:h-[14px]`}
        fill={i < rating ? "currentColor" : "none"}
        style={i < rating ? { filter: "drop-shadow(0 0 4px rgba(251,191,36,0.6))" } : {}}
      />
    ))}
  </div>
);

// 🃏 Single Feedback Card - MOBILE OPTIMIZED
const FeedbackCard = ({ item }: { item: any }) => {
  return (
    <div
      className="feedback-card w-[260px] sm:w-[300px] md:w-[360px] flex-shrink-0 whitespace-normal relative group"
      style={{ "--accent": item.accent || "#facc15" } as React.CSSProperties}
    >
      {/* Card Body */}
      <div className="relative h-full p-4 overflow-hidden transition-all duration-300 border sm:p-5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-zinc-900/80 border-slate-200/60 dark:border-zinc-800/60 backdrop-blur-md group-hover:border-opacity-100 group-hover:shadow-xl">

        {/* Glow on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-100 rounded-xl sm:rounded-2xl"
          style={{ background: `radial-gradient(circle at 50% 0%, ${item.accent}18 0%, transparent 70%)` }}
        />

        {/* Top border accent line */}
        <div
          className="absolute top-0 h-px transition-opacity duration-300 opacity-0 left-4 right-4 sm:left-6 sm:right-6 group-hover:opacity-100"
          style={{ background: `linear-gradient(to right, transparent, ${item.accent}, transparent)` }}
        />

        {/* Quote icon */}
        <Quote
          className="absolute transition-all duration-300 top-3 right-3 sm:top-4 sm:right-4 opacity-10 group-hover:opacity-20"
          style={{ color: item.accent }}
          size={28}
        />

        {/* Header: stars + verified + date */}
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <StarRating rating={item.rating} />
          <div className="flex items-center gap-1.5 sm:gap-2">
            {item.verified && (
              <span className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Shield size={8} className="sm:w-[9px] sm:h-[9px]" />
                <span className="hidden xs:inline">Verified</span>
                <span className="xs:hidden">✓</span>
              </span>
            )}
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">{item.date || ""}</span>
          </div>
        </div>

        {/* Message */}
        <p className="mb-4 text-xs font-medium leading-relaxed sm:mb-5 sm:text-sm text-slate-600 dark:text-slate-300 font-bangla-premium line-clamp-3">
          "{item.message || "No comment provided."}"
        </p>

        {/* User Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-zinc-800">
          {/* Avatar */}
          <div className="relative shrink-0">
            {item.photoURL ? (
              <img
                src={item.photoURL}
                alt={item.name || "User"}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                }}
                className="object-cover border-2 rounded-full shadow-md w-9 h-9 sm:w-10 sm:h-10"
                style={{ borderColor: `${item.accent}40` }}
              />
            ) : null}
            <div
              className={`${item.photoURL ? "hidden" : "flex"} items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base font-bold text-white rounded-full shadow-md bg-gradient-to-tr ${item.color || "from-yellow-400 to-orange-500"}`}
            >
              {item.name ? item.name.charAt(0).toUpperCase() : "U"}
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-400" />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-bold truncate sm:text-sm text-slate-900 dark:text-white">{item.name || "Anonymous"}</h4>
            <span
              className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: item.accent }}
            >
              {item.ratingText || "Reviewer"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 📊 Stat Item Component - MOBILE OPTIMIZED
const StatItem = ({ icon: Icon, value, label, color }: any) => {
  const count = useCountUp(value);
  return (
    <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
      <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl" style={{ background: `${color}15` }}>
        <Icon size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color }} />
      </div>
      <div>
        <p className="text-base font-black leading-none sm:text-lg text-slate-900 dark:text-white">
          {count}{value >= 100 ? "+" : ""}
        </p>
        <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
};

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const realData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbacks([...realData, ...customFeedbacks]);
    });
    return () => unsubscribe();
  }, []);

  const displayFeedbacks = feedbacks.length > 0 ? feedbacks : customFeedbacks;
  const half = Math.ceil(displayFeedbacks.length / 2);
  const topRow = displayFeedbacks.slice(0, half).length > 0 ? displayFeedbacks.slice(0, half) : row1Feedbacks;
  const bottomRow = displayFeedbacks.slice(half).length > 0 ? displayFeedbacks.slice(half) : row2Feedbacks;

  return (
    <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-[#080808]">

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .font-bangla-premium { font-family: 'Hind Siliguri', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }

        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-marquee-left {
          animation: marquee-left 35s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 42s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }

        /* Mobile-friendly marquee speed */
        @media (max-width: 640px) {
          .animate-marquee-left {
            animation: marquee-left 40s linear infinite;
          }
          .animate-marquee-right {
            animation: marquee-right 48s linear infinite;
          }
        }

        .mask-gradient-x {
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        .feedback-card {
          transition: transform 0.3s ease;
        }
        .feedback-card:hover {
          transform: translateY(-4px) scale(1.01);
        }

        /* Reduce hover effect on touch devices */
        @media (hover: none) {
          .feedback-card:hover {
            transform: translateY(-2px) scale(1.005);
          }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
        }
        .float-slow { animation: float-slow 8s ease-in-out infinite; }
        .float-medium { animation: float-medium 6s ease-in-out infinite; }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }

        .stat-divider {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, transparent, rgba(148,163,184,0.3), transparent);
        }

        @media (min-width: 640px) {
          .stat-divider {
            height: 36px;
          }
        }

        .badge-glow {
          box-shadow: 0 0 12px rgba(234,179,8,0.25);
        }

        /* Custom breakpoint for extra small screens */
        @media (min-width: 380px) {
          .xs\:inline {
            display: inline;
          }
          .xs\:hidden {
            display: none;
          }
        }
      `}</style>

      {/* ── Ambient Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full pulse-glow"
          style={{ background: "radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)" }} />
        {/* Top-left violet glow */}
        <div className="absolute -top-20 -left-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full blur-[60px] sm:blur-[80px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent)" }} />
        {/* Bottom-right cyan glow */}
        <div className="absolute -bottom-20 -right-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full blur-[60px] sm:blur-[80px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.4), transparent)" }} />

        {/* Floating decorative shapes - hidden on mobile for performance */}
        <div className="hidden sm:block float-slow absolute top-20 left-[12%] w-3 h-3 rounded-full bg-amber-400/30 blur-[2px]" />
        <div className="hidden sm:block float-medium absolute top-40 right-[15%] w-2 h-2 rounded-full bg-purple-400/40" style={{ animationDelay: "1s" }} />
        <div className="hidden sm:block float-slow absolute bottom-32 left-[20%] w-2 h-2 rounded-full bg-cyan-400/40" style={{ animationDelay: "2s" }} />
        <div className="hidden sm:block float-medium absolute bottom-20 right-[25%] w-3 h-3 rounded-full bg-rose-400/30 blur-[1px]" style={{ animationDelay: "0.5s" }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── Section Header - MOBILE OPTIMIZED ── */}
      <div className="container relative z-10 px-4 mx-auto mb-6 text-center sm:mb-8 md:mb-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-amber-500/25 bg-amber-500/8 backdrop-blur-sm badge-glow">
          <Award size={11} className="sm:w-[13px] sm:h-[13px] text-amber-400" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-amber-500">Client Testimonials</span>
        </div>

        <h2 className="mb-3 text-3xl font-extrabold leading-tight transition-colors duration-300 sm:mb-4 sm:text-4xl md:text-6xl font-display text-slate-900 dark:text-white">
          People{" "}
          <span
            className="relative inline-block text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)" }}
          >
            Love It
            {/* Underline accent */}
            <svg className="absolute left-0 w-full -bottom-1 sm:-bottom-2" height="6" viewBox="0 0 200 6" fill="none">
              <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="url(#ul-grad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <defs>
                <linearGradient id="ul-grad" x1="0" y1="0" x2="200" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h2>

        <p className="max-w-md mx-auto text-sm leading-relaxed sm:text-base text-slate-500 dark:text-slate-400">
          Real feedback from real people — see why they keep coming back.
        </p>
      </div>

      {/* ── Stats Bar - MOBILE OPTIMIZED WITH GRID ── */}
      <div className="container relative z-10 px-4 mx-auto mb-6 sm:mb-8 md:mb-10">
        <div className="grid max-w-2xl grid-cols-2 gap-0 mx-auto overflow-hidden border shadow-sm sm:flex sm:flex-wrap sm:items-center sm:justify-center rounded-xl sm:rounded-2xl border-slate-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm">
          <StatItem icon={Star} value={97} label="Satisfaction" color="#f59e0b" />
          <div className="hidden sm:block stat-divider" />
          <StatItem icon={Users} value={240} label="Reviews" color="#6366f1" />
          <div className="hidden sm:block stat-divider" />
          <StatItem icon={TrendingUp} value={5} label="Avg Rating" color="#22c55e" />
          <div className="hidden sm:block stat-divider" />
          <StatItem icon={Shield} value={180} label="Verified" color="#ec4899" />
        </div>
      </div>

      {/* ── Row 1: Left Scroll ── */}
      <div className="relative flex w-full mb-3 overflow-hidden sm:mb-4 mask-gradient-x">
        <div className="flex gap-3 py-2 sm:gap-5 sm:py-3 animate-marquee-left">
          {[...topRow, ...topRow, ...topRow].map((item, index) => (
            <FeedbackCard key={`row1-${item.id}-${index}`} item={item} />
          ))}
        </div>
      </div>

      {/* ── Row 2: Right Scroll ── */}
      <div className="relative flex w-full overflow-hidden mask-gradient-x">
        <div className="flex gap-3 py-2 sm:gap-5 sm:py-3 animate-marquee-right">
          {[...bottomRow, ...bottomRow, ...bottomRow].map((item, index) => (
            <FeedbackCard key={`row2-${item.id}-${index}`} item={item} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA - MOBILE OPTIMIZED ── */}
      <div className="container relative z-10 px-4 mx-auto mt-8 text-center sm:mt-12">
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
          Trusted by{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">200+ clients</span>
          {" "}across Bangladesh 🇧🇩
        </p>
      </div>

    </section>
  );
};

export default FeedbackList;