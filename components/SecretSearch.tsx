import React, { useState, useEffect } from 'react';
import { Search, X, Lock, Zap, Image as ImageIcon, Video, Grid, Play } from 'lucide-react';

// মিডিয়া আইটেম টাইপ
interface MediaItem {
  type: 'image' | 'video';
  src: string;
  title: string;
}

const SecretSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  
  // 🔥 গ্যালারি এবং প্লেয়ার স্টেট
  const [showGallery, setShowGallery] = useState(false);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);

  // 🔥 সিক্রেট ডেটাবেস
  const secretCodes: { [key: string]: { 
      msg: string, 
      type: 'text' | 'media' | 'gallery', 
      src?: string, 
      mediaType?: 'image' | 'video', 
      items?: MediaItem[], 
      action?: () => void 
  } } = {
    
    // ১. হ্যাকার মোড (Text)
    "magic": { msg: "✨ You found the hidden magic!", type: 'text' },

    // ২. সিঙ্গেল ভিডিও (Local File Example)
    "intro": { 
      msg: "🎬 Playing Intro...", 
      type: 'media', 
      mediaType: 'video',
      src: '/intro.mp4' 
    },

    // ৩. 🔥 মিক্সড কালেকশন (Local + Online Links)
    "hotcdi": { 
      msg: "📂 Unlocking Hot Memory Vault...", 
      type: 'gallery',
      items: [
        // Public ফোল্ডারের ভিডিও
        { type: 'video', src: 'https://drive.google.com/file/d/1hgoelYUpZs7Qve0PFt_lvR1Rw_vBSWn9/preview', title: '👻' },
        // YouTube ভিডিও (Embed Link)
        { type: 'video', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Favorite Song 🎵' },
        // Google Drive ভিডিও (Preview Link)
        { type: 'video', src: 'https://drive.google.com/file/d/1T5nC_AYzfp3RZ9NvKCHchMTLSktmTajg/preview', title: '😁😁' },
        // ছবি
        { type: 'image', src: '/secret-pic.jpg', title: 'Batch 2024 Group Photo 📸' }
      ]
    },

    // ৪. প্রোজেক্ট ডেমো গ্যালারি
    "love": {
        msg: "🚀 Showing Secret Content...",
        type: 'gallery',
        items: [
            { type: 'video', src: '/secret-video.mp4', title: 'Secret Project 1' },
            { type: 'video', src: '/secret-video2.mp4', title: 'Secret Project 2' },
        ]
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // PC Shortcut: Ctrl + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSecretSearch();
      }
      // ESC to Close
      if (e.key === 'Escape') {
        closeAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPlayer, showGallery]);

  const openSecretSearch = () => {
    setIsOpen((prev) => !prev);
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
      setMessage("❌ Access Denied. Try 'memories' or 'hot'");
    }
  };

  const openMedia = (item: MediaItem) => {
    setCurrentMedia(item);
    setShowPlayer(true);
  };

  // 🔥 ভিডিও সোর্স চেক করার ফাংশন
  const isExternalVideo = (src: string) => {
    return src.includes('youtube') || 
           src.includes('youtu.be') || 
           src.includes('vimeo') || 
           src.includes('drive.google.com');
  };

  return (
    <>
      {/* 📱 MOBILE TRIGGER BUTTON (শুধুমাত্র মোবাইল স্ক্রিনে দেখাবে) */}
      {!isOpen && !showGallery && !showPlayer && (
        <button 
          onClick={openSecretSearch}
          className="fixed bottom-5 right-5 z-[9990] p-3 rounded-full bg-slate-800/20 text-slate-400 hover:bg-pink-500 hover:text-white backdrop-blur-sm transition-all md:hidden border border-white/10"
        >
          <Lock size={20} />
        </button>
      )}

      {/* 1. SEARCH BAR */}
      {isOpen && !showGallery && !showPlayer && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200">
          <div className="w-full max-w-lg mx-4 overflow-hidden bg-white border shadow-2xl dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-700">
            <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 mr-3 text-slate-400" />
              <form onSubmit={handleSearch} className="flex-1">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Enter secret code..." 
                  className="w-full text-lg bg-transparent border-none outline-none text-slate-700 dark:text-slate-200"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
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
                        <p className="mt-2 text-xs opacity-50">(Hint: Try 'memories')</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* 2. GALLERY VIEW */}
      {showGallery && (
        <div className="fixed inset-0 z-[100000] bg-slate-950/95 backdrop-blur-md flex flex-col p-6 animate-in zoom-in-95 duration-300 overflow-y-auto">
            <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-8">
                <h2 className="flex items-center gap-3 text-2xl font-black text-white md:text-3xl">
                    <Grid className="text-pink-500" /> 
                    {galleryTitle}
                    <span className="hidden px-3 py-1 font-mono text-sm text-pink-500 rounded-full md:inline-block bg-pink-500/20">SECURE</span>
                </h2>
                <button onClick={() => setShowGallery(false)} className="p-2 text-white transition-all rounded-full bg-white/10 hover:bg-red-500">
                    <X size={24} />
                </button>
            </div>

            <div className="grid w-full max-w-5xl grid-cols-1 gap-6 pb-10 mx-auto md:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map((item, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => openMedia(item)}
                        className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300"
                    >
                        <div className="relative flex items-center justify-center aspect-video bg-slate-800">
                            {item.type === 'video' ? (
                                <Video className="w-12 h-12 transition-colors text-slate-600 group-hover:text-pink-500" />
                            ) : (
                                <img src={item.src} className="object-cover w-full h-full transition-opacity opacity-80 group-hover:opacity-100" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 bg-black/40">
                                <div className="p-3 text-white rounded-full bg-white/20 backdrop-blur-md">
                                    <Play fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold truncate text-slate-200 group-hover:text-white">{item.title}</h3>
                            <p className="mt-1 text-xs tracking-wider uppercase text-slate-500">{item.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* 3. UNIVERSAL MEDIA PLAYER */}
      {showPlayer && currentMedia && (
        <div className="fixed inset-0 z-[100001] bg-black flex items-center justify-center p-4 animate-in fade-in duration-200">
            <button 
                onClick={() => setShowPlayer(false)}
                className="absolute z-50 p-3 text-white rounded-full top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md"
            >
                <X size={28} />
            </button>

            <div className="max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center">
                {currentMedia.type === 'video' ? (
                    // 🔥 লজিক: External Link (YouTube/Drive) vs Local File
                    isExternalVideo(currentMedia.src) ? (
                        <iframe 
                            src={currentMedia.src} 
                            className="w-full aspect-video max-h-[85vh] rounded-lg shadow-2xl border border-white/10"
                            title="External Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <video 
                            src={currentMedia.src} 
                            controls 
                            autoPlay 
                            className="w-full h-auto max-h-[85vh] rounded-lg shadow-2xl border border-white/10" 
                        />
                    )
                ) : (
                    <img 
                        src={currentMedia.src} 
                        className="w-auto h-auto max-h-[85vh] rounded-lg shadow-2xl object-contain" 
                    />
                )}
                <h3 className="mt-4 text-xl font-bold text-center text-white">{currentMedia.title}</h3>
            </div>
        </div>
      )}
    </>
  );
};

export default SecretSearch;