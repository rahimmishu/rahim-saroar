import React, { useState, useEffect } from 'react';
import { Search, X, Lock, Grid, Play, Video } from 'lucide-react';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  title: string;
  thumbnail?: string; // 🔥 নতুন অপশন: ম্যানুয়াল থাম্বনেইল
}

const SecretVault: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  
  const [showGallery, setShowGallery] = useState(false);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);

  const secretCodes: { [key: string]: { 
      msg: string, type: 'text' | 'media' | 'gallery', src?: string, mediaType?: 'image' | 'video', items?: MediaItem[], action?: () => void 
  } } = {
    "magic": { msg: "✨ You found the hidden magic!", type: 'text' },
    "intro": { msg: "🎬 Playing Intro...", type: 'media', mediaType: 'video', src: '/intro.mp4' },
    "hotcdi": { 
      msg: "📂 Unlocking Hot Memory Vault...", type: 'gallery',
      items: [
        { type: 'video', src: 'https://drive.google.com/file/d/1hgoelYUpZs7Qve0PFt_lvR1Rw_vBSWn9/preview', title: '👻', thumbnail: '/hot.jpg' },
        { type: 'video', src: 'https://www.youtube.com/embed/TVjrci5QQ4A', title: 'Favorite romance 🥵' }, // অটোমেটিক থাম্বনেইল আসবে
        { type: 'video', src: 'https://drive.google.com/file/d/1T5nC_AYzfp3RZ9NvKCHchMTLSktmTajg/preview', title: '😁😁',thumbnail: '/pagla.jpg' },
        // আপনার আগের ভিডিও আইটেমগুলো এখানে থাকবে...
        { type: 'video', src: 'https://drive.google.com/file/d/1osCjA7soR9r9l7rdt0roG4DewVOk98Nn/preview', title: 'Hot Guju Couple', thumbnail: '/goju.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1C-fGEcNowdv6Igyb_PZCtMUtDuB7NIgr/preview', title: 'Romantic Video', thumbnail: '/horny.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1aW3atn8w4OkSfvmhnt1lEKjuNwVvn_60/preview', title: 'Throat Romantice', thumbnail: '/hornyh.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1rk4xeKb5WpXi8BO9nNJNtOFMKtBDsqNb/preview', title: 'Deep cunnilingus and a passionate fuck', thumbnail: '/deep.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1OX1MiT6NDNhHUdLvSwQiJwfmTDUD34Ha/preview', title: 'Stepmom asks her sister to help with stepsons porn addiction', thumbnail: '/step.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1ounJZxu1fY-MNXUHCdNyejkKTz4J99l/preview', title: 'Blonde Russian 18 Yo Teen Hannah Is Fucke by Boyfriend ', thumbnail: '/blonde.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1_4TgeMds_TSBVw5B-BznJaBWkyVvzKh6/preview', title: 'Manuel Ferrara  Gia Derza Foxy Teen Gets Her Ass Raided ', thumbnail: '/manual.jpg' },
        { type: 'image', src: '/secret-pic.jpg', title: 'কি দেখিস রে শ্লা 🥵' }
      ]
    },
    "love": {
        msg: "🚀 Showing Secret Content...", type: 'gallery',
        items: [
            { type: 'video', src: '/secret-video.mp4', title: 'Secret Project 1' },
            { type: 'video', src: '/secret-video2.mp4', title: 'Secret Project 2' },
        ]
    }
  };

  const openSecretSearch = () => {
    console.log("🔓 Secret Vault Open Signal Received!");
    setIsOpen(true);
    setMessage('');
    setQuery('');
    setShowGallery(false);
    setShowPlayer(false);
  };

  const closeAll = () => {
    if (showPlayer) setShowPlayer(false);
    else if (showGallery) setShowGallery(false);
    else setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') closeAll();
    };

    const handleNavbarSignal = () => openSecretSearch();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-secret-search', handleNavbarSignal);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-secret-search', handleNavbarSignal);
    };
  }, []);

  // 🔥 থাম্বনেইল জেনারেটর ফাংশন
  const getThumbnail = (src: string, manualThumbnail?: string) => {
    // ১. ম্যানুয়াল থাম্বনেইল থাকলে সেটাই দেখাবে
    if (manualThumbnail) return manualThumbnail;

    // ২. ইউটিউব লিংক হলে অটোমেটিক থাম্বনেইল আনবে
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      // ইউটিউব আইডি বের করার লজিক
      let videoId = null;
      if (src.includes('embed/')) {
          videoId = src.split('embed/')[1]?.split('?')[0];
      } else if (src.includes('v=')) {
          videoId = src.split('v=')[1]?.split('&')[0];
      } else {
          videoId = src.split('/').pop();
      }
      
      if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    // ৩. অন্যথায় নাল রিটার্ন করবে (ডিফল্ট আইকন দেখাবে)
    return null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const lowerQuery = query.toLowerCase().trim();
    const result = secretCodes[lowerQuery];

    if (result) {
      setMessage(result.msg);
      if (result.type === 'gallery' && result.items) {
        setTimeout(() => {
          setGalleryItems(result.items!);
          setGalleryTitle(lowerQuery.toUpperCase());
          setShowGallery(true);
        }, 800);
      } else if (result.type === 'media') {
        setTimeout(() => {
          setCurrentMedia({ type: result.mediaType!, src: result.src!, title: 'Secret Content' });
          setShowPlayer(true);
        }, 800);
      } else if (result.action) {
        setTimeout(() => result.action!(), 1000);
      }
    } else {
      setMessage("❌ কিরে চোর 🍌 ");
    }
  };

  const openMedia = (item: MediaItem) => {
    setCurrentMedia(item);
    setShowPlayer(true);
  };

  const isExternalVideo = (src: string) => {
    return src.includes('youtube') || src.includes('youtu.be') || src.includes('vimeo') || src.includes('drive.google.com');
  };

  if (!isOpen && !showGallery && !showPlayer) return null;

  return (
    <>
      {isOpen && !showGallery && !showPlayer && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200">
          <div className="w-full max-w-lg mx-4 overflow-hidden bg-white border shadow-2xl dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-700">
            <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 mr-3 text-slate-400" />
              <form onSubmit={handleSearch} className="flex-1">
                <input type="text" autoFocus placeholder="Enter secret code..." className="w-full text-lg bg-transparent border-none outline-none text-slate-700 dark:text-slate-200" value={query} onChange={(e) => setQuery(e.target.value)} />
              </form>
              <button onClick={closeAll} className="px-2 py-1 text-xs rounded text-slate-400 bg-slate-100 dark:bg-slate-800">ESC</button>
            </div>
            <div className="p-6 text-center min-h-[100px] flex flex-col items-center justify-center">
                {message ? (
                    <p className="text-lg font-bold text-slate-800 dark:text-white animate-in slide-in-from-bottom-2">{message}</p>
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <Lock className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">Type a code to unlock.</p>
                        <p className="mt-2 text-xs opacity-50">(Hint: Try 'love')</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* 🔥 GALLERY VIEW UPDATED 🔥 */}
      {showGallery && (
        <div className="fixed inset-0 z-[100000] bg-slate-950/95 backdrop-blur-md flex flex-col p-6 animate-in zoom-in-95 duration-300 overflow-y-auto">
            <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-8">
                <h2 className="flex items-center gap-3 text-2xl font-black text-white md:text-3xl"><Grid className="text-pink-500" /> {galleryTitle}</h2>
                <button onClick={() => setShowGallery(false)} className="p-2 text-white transition-all rounded-full bg-white/10 hover:bg-red-500"><X size={24} /></button>
            </div>
            <div className="grid w-full max-w-5xl grid-cols-1 gap-6 pb-10 mx-auto md:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map((item, idx) => {
                    // থাম্বনেইল চেক করা
                    const thumbUrl = getThumbnail(item.src, item.thumbnail);
                    
                    return (
                        <div key={idx} onClick={() => openMedia(item)} className="relative overflow-hidden border cursor-pointer group bg-slate-900 border-slate-800 rounded-2xl aspect-video">
                            <div className="relative flex items-center justify-center w-full h-full bg-slate-800">
                                {thumbUrl ? (
                                    // 🔥 যদি থাম্বনেইল পাওয়া যায়
                                    <>
                                        <img src={thumbUrl} alt={item.title} className="object-cover w-full h-full transition-opacity opacity-80 group-hover:opacity-100" />
                                        {/* ভিডিও হলে প্লে বাটন দেখাবে */}
                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                                                    <Play className="w-6 h-6 text-white fill-white" />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // ⚠️ থাম্বনেইল না থাকলে ডিফল্ট আইকন
                                    item.type === 'video' ? 
                                    <Video className="w-12 h-12 transition-colors text-slate-600 group-hover:text-pink-500" /> : 
                                    <img src={item.src} className="object-cover w-full h-full opacity-80 group-hover:opacity-100" />
                                )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="font-bold truncate text-slate-200">{item.title}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      )}

      {showPlayer && currentMedia && (
        <div className="fixed inset-0 z-[100001] bg-black flex items-center justify-center p-4 animate-in fade-in duration-200">
            <button onClick={() => setShowPlayer(false)} className="absolute z-50 p-3 text-white rounded-full top-6 right-6 bg-white/10 hover:bg-white/20"><X size={28} /></button>
            <div className="max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center">
                {currentMedia.type === 'video' ? (
                    isExternalVideo(currentMedia.src) ? 
                    <iframe src={currentMedia.src} className="w-full aspect-video max-h-[85vh] rounded-lg shadow-2xl bg-black" allowFullScreen allow="autoplay; encrypted-media"></iframe> : 
                    <video src={currentMedia.src} controls autoPlay className="w-full h-auto max-h-[85vh] rounded-lg shadow-2xl bg-black" />
                ) : (
                    <img src={currentMedia.src} className="w-auto h-auto max-h-[85vh] rounded-lg object-contain shadow-2xl" />
                )}
            </div>
        </div>
      )}
    </>
  );
};

export default SecretVault;