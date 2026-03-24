import React, { useEffect, useState, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

// *** 📸 ছবি ইম্পোর্ট করা (ছবিগুলো src/assets/images/ এ থাকতে হবে) ***
// যদি ছবি না থাকে, তাহলে কোড এরর দিবে। 
// ছবি অ্যাড করার পর এই লাইনগুলো আন-কমেন্ট (মুছে দেওয়া) করো:
// import telegramProfilePic from '../../assets/images/telegram_profile.png';
// import facebookProfilePic from '../../assets/images/facebook_cover.png';
// import defaultIcon from '../../assets/images/redirect_logo.png';

// Fallback images in case user hasn't uploaded actual files yet.
// These are just simple placeholder URLs, replace them with your actual pictures.
const fallbackTelegramPic = "https://cdn.pixabay.com/photo/2017/02/12/11/44/telegram-icon-2059714_1280.png";
const fallbackFacebookPic = "https://w7.pngwing.com/pngs/318/1000/png-transparent-logo-facebook-fb-social-media-icon-interface-logos-icon-thumbnail.png";
const fallbackDefaultIcon = "https://cdn-icons-png.flaticon.com/512/81/81041.png";

// 1. কাস্টম প্ল্যাটফর্ম ডাটা স্ট্রাকচার (FIXED ডাটা)
interface PlatformDetails {
  name: string;
  url: string;
  profilePic: string; // ছবির পাথ বা URL
  customGlow: ReactNode; // প্ল্যাটফর্ম অনুযায়ী আলাদা Background Glow
  customButtonClass: string; // প্ল্যাটফর্ম অনুযায়ী আলাদা বাটন কালার
  customTextColor: string; // প্ল্যাটফর্ম অনুযায়ী আলাদা টেক্সট কালার
}

const platformData: Record<string, PlatformDetails> = {
  telegram: {
    name: 'Telegram',
    // ⬇️ তোমার টেলিগ্রামের ফিক্সড লিংক ⬇️
    url: 'https://t.me/rahim_saroar_mishu', 
    // profilePic: telegramProfilePic, // <-- ছবি আপলোড করার পর এই লাইনটি ব্যবহার করো
    profilePic: fallbackTelegramPic, // <-- ছবি আপলোড করার আগে এটা থাকবে
    customTextColor: 'text-sky-300',
    customButtonClass: 'from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-sky-500/40',
    customGlow: (
      <>
        <div key="tg1" className="absolute w-96 h-96 bg-sky-600/30 rounded-full blur-3xl top-[-10%] left-[-10%] animate-pulse"></div>
        <div key="tg2" className="absolute w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl bottom-[-10%] right-[-10%] animate-pulse delay-700"></div>
      </>
    ),
  },
  facebook: {
    name: 'Facebook',
    // ⬇️ তোমার ফেসবুকের ফিক্সড লিংক বসাও ⬇️
    url: 'https://www.facebook.com/rahimsaroar', 
    // profilePic: facebookProfilePic, // <-- ছবি আপলোড করার পর এই লাইনটি ব্যবহার করো
    profilePic: fallbackFacebookPic, // <-- ছবি আপলোড করার আগে এটা থাকবে
    customTextColor: 'text-blue-300',
    customButtonClass: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/40',
    customGlow: (
      <>
        <div key="fb1" className="absolute w-96 h-96 bg-blue-700/40 rounded-full blur-3xl top-[-10%] left-[-10%] animate-pulse"></div>
        <div key="fb2" className="absolute w-96 h-96 bg-indigo-700/30 rounded-full blur-3xl bottom-[-10%] right-[-10%] animate-pulse delay-500"></div>
      </>
    ),
  },
  // তুমি চাইলে এখানে youtube, github ইত্যাদি অ্যাড করতে পারবে।
};

const RedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Read the platform param and convert to lowercase
  const requestedPlatform = (searchParams.get('platform') || 'default').toLowerCase();

  // Find the data for the requested platform, or fall back to default logic
  const currentPlatformData = platformData[requestedPlatform] || null;

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // যদি প্ল্যাটফর্ম ফিক্সড ডাটাতে না থাকে, তবে অটো রিডাইরেক্ট বন্ধ থাকবে
    if (!currentPlatformData) return;

    // ৫ সেকেন্ডের কাউন্টডাউন
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = currentPlatformData.url; // ফিক্সড URL এ অটো রিডাইরেক্ট
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlatformData]);

  // If the platform is not recognized
  if (!currentPlatformData) {
    return (
      <div className="relative flex items-center justify-center min-h-screen text-white bg-black">
        <div key="defGlow" className="absolute rounded-full w-96 h-96 bg-gray-600/30 blur-3xl animate-pulse"></div>
        <div className="relative z-10 p-10 mx-4 text-center border bg-black/40 backdrop-blur-2xl border-white/10 rounded-3xl">
            <img src={fallbackDefaultIcon} alt="Error" className="w-20 h-20 mx-auto mb-6 opacity-60" />
            <h1 className="mb-4 text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text">Invalid Link!</h1>
            <p className="text-slate-400">আপনাকে সঠিক প্ল্যাটফর্মের লিংক দিতে হবে। (যেমন: /link?platform=telegram)</p>
        </div>
      </div>
    );
  }

  // Destructure data for cleaner code
  const { name, url, profilePic, customGlow, customButtonClass, customTextColor } = currentPlatformData;

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-950">
      {/* 🔮 Background Glow Effects (প্ল্যাটফর্ম অনুযায়ী ভিন্ন) */}
      {customGlow}

      <div className="relative z-10 w-full max-w-lg p-10 mx-4 text-center border-2 shadow-2xl bg-white/5 dark:bg-black/30 backdrop-blur-3xl border-white/5 rounded-3xl">
        
        {/* 📸 কাস্টম ছবি (তোমার টেলিগ্রামের ছবির মতো হবে) */}
        <div className="relative w-32 h-32 mx-auto mb-8">
            <img 
              src={profilePic} 
              alt={`${name} Profile`} 
              className={`w-full h-full object-cover rounded-full border-4 ${customTextColor.replace('text','border')} shadow-2xl shadow-${requestedPlatform === 'telegram' ? 'sky' : 'blue'}-500/50`} 
            />
            {/* Online/Verified badge */}
            <div className={`absolute bottom-1 right-1 w-8 h-8 rounded-full border-4 border-slate-950 ${requestedPlatform === 'telegram' ? 'bg-sky-500' : 'bg-blue-600'} flex items-center justify-center text-white text-lg font-bold animate-pulse`}>✓</div>
        </div>

        <h1 className="mb-3 text-4xl font-bold text-transparent bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text">
          Taking you to <span className={customTextColor}>{name}</span>
        </h1>
        
        <p className="max-w-md mx-auto mb-10 text-base text-slate-400">
          আমাদের ওয়েবসাইট থেকে আপনি {name} এ যাচ্ছেন। ৫ সেকেন্ডের মধ্যে অটোমেটিক্যালি পাঠানো হবে...
        </p>
        
        {/* ⏳ কাস্টম কাউন্টডাউন টাইমার */}
        <div className={`mb-10 p-6 rounded-3xl bg-black/30 ${customTextColor.replace('text','border')} text-slate-300 text-2xl font-bold tracking-widest inline-flex items-center gap-4`}>
            <span className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br ${customButtonClass} text-white text-3xl`}>{countdown}</span>
            <span className="text-slate-500 uppercase text-xs tracking-[0.5em]">{countdown <= 1 ? "Redirecting" : "Seconds Left"}</span>
        </div>

        <a
          href={url}
          className={`inline-flex items-center justify-center w-full gap-3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r ${customButtonClass} hover:scale-105 active:scale-95 shadow-xl`}
        >
          ওপেন <span className='underline'>{name}</span> এখনই
        </a>
      </div>
    </div>
  );
};

export default RedirectPage;