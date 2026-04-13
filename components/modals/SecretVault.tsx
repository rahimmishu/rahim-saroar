import React, { useState, useEffect } from 'react';
import { Search, X, Lock, Grid, Play, Video, Sparkles, Command, ArrowRight } from 'lucide-react';
// import { triggerIsland } from '../layout/DynamicIsland'; // 🔥 নোটিফিকেশনের জন্য ইমপোর্ট (প্রয়োজন হলে আনকমেন্ট করুন)

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  title: string;
  thumbnail?: string;
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

  // আপনার সিক্রেট কোড লিস্ট (আপনার আগের ডাটাই আছে)
  const secretCodes: { [key: string]: { 
      msg: string, type: 'text' | 'media' | 'gallery', src?: string, mediaType?: 'image' | 'video', items?: MediaItem[], action?: () => void 
  } } = {
    "magic": { msg: "✨ You found the hidden magic!", type: 'text' },
    "intro": { msg: "🎬 Playing Intro...", type: 'media', mediaType: 'video', src: '/intro.mp4' },
    "hotcdi": { 
      msg: "📂 ছিঃ! ছিঃ! 🤢 কি দেখপা আইছি! 👀🐸", type: 'gallery',
      items: [
        { type: 'video', src: 'https://drive.google.com/drive/folders/1Pv264KpS96cm6MGyXEkW-3Ri30BeGkLK?usp=sharing', title: 'Hidden File 01', thumbnail: '/new.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1hgoelYUpZs7Qve0PFt_lvR1Rw_vBSWn9/preview', title: 'Hidden File 01', thumbnail: '/hot.jpg' },
        { type: 'video', src: 'https://www.youtube.com/embed/TVjrci5QQ4A', title: 'Favorite romance 🥵' },
        { type: 'video', src: 'https://drive.google.com/file/d/1T5nC_AYzfp3RZ9NvKCHchMTLSktmTajg/preview', title: 'Funny Clip',thumbnail: '/pagla.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1osCjA7soR9r9l7rdt0roG4DewVOk98Nn/preview', title: 'Couple Moment', thumbnail: '/goju.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1C-fGEcNowdv6Igyb_PZCtMUtDuB7NIgr/preview', title: 'Romantic Video', thumbnail: '/horny.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1aW3atn8w4OkSfvmhnt1lEKjuNwVvn_60/preview', title: 'Throat Romantice', thumbnail: '/hornyh.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1rk4xeKb5WpXi8BO9nNJNtOFMKtBDsqNb/preview', title: 'Funny Dub', thumbnail: '/deep.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1OX1MiT6NDNhHUdLvSwQiJwfmTDUD34Ha/preview', title: 'Drama Clip', thumbnail: '/step.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1ounJZxu1fY-MNXUHCdNyejkKTz4J99lG/preview', title: 'Teen Clip', thumbnail: '/blonde.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1_4TgeMds_TSBVw5B-BznJaBWkyVvzKh6/preview', title: 'Action Scene', thumbnail: '/manual.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1ZmhaN6ft7z-WufCFmiDoTYMUWD_MX2-9/preview', title: 'Brunette Clip', thumbnail: '/fok.jpg' },
        { type: 'video', src: 'https://drive.google.com/file/d/1oNTdU03qDdoPCscx5kqmsTdoFXueoXVp/preview', title: 'Teen Scene', thumbnail: '/f.jpg' },
        { type: 'image', src: '/secret-pic.jpg', title: 'Secret Image' }
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
    // triggerIsland("Secret Vault Activated 🔐", "success");
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

  const getThumbnail = (src: string, manualThumbnail?: string) => {
    if (manualThumbnail) return manualThumbnail;
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      let videoId = null;
      if (src.includes('embed/')) videoId = src.split('embed/')[1]?.split('?')[0];
      else if (src.includes('v=')) videoId = src.split('v=')[1]?.split('&')[0];
      else videoId = src.split('/').pop();
      
      if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
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
      setMessage("❌ Access Denied: Invalid Code");
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
      {/* SEARCH MODAL - PREMIUM GLASSMORPHISM */}
      {isOpen && !showGallery && !showPlayer && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xl flex items-start justify-center pt-[20vh] animate-in fade-in duration-300">
          
          {/* Background Glow Effect */}
          <div className="absolute top-[20vh] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="w-full max-w-xl mx-4 relative overflow-hidden bg-[#0a0a0a]/80 border border-white/10 shadow-2xl rounded-2xl backdrop-blur-2xl ring-1 ring-white/5 transform transition-all">
            
            {/* Header / Input Area */}
            <div className="flex items-center px-6 py-5 border-b border-white/5">
              <Command className="w-6 h-6 mr-4 text-purple-500 animate-pulse" />
              <form onSubmit={handleSearch} className="flex-1">
                <input 
                  type="text" 
                  autoFocus 
                  placeholder="Enter access code..." 
                  className="w-full text-xl font-medium tracking-wide text-white bg-transparent border-none outline-none placeholder:text-neutral-500" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />
              </form>
              <div className="flex items-center gap-2">
                 <button onClick={closeAll} className="px-2 py-1 text-[10px] font-bold tracking-wider rounded bg-white/5 text-neutral-400 border border-white/5 hover:bg-white/10 transition-colors">ESC</button>
              </div>
            </div>

            {/* Message / Status Area */}
            <div className="p-8 text-center min-h-[140px] flex flex-col items-center justify-center">
                {message ? (
                    <div className="duration-300 animate-in slide-in-from-bottom-2 fade-in">
                         <div className="inline-flex items-center justify-center w-12 h-12 mb-3 text-purple-400 rounded-full bg-purple-500/10">
                            <Sparkles size={20} />
                         </div>
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">{message}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-neutral-500">
                        <div className="p-4 mb-3 border rounded-full bg-white/5 border-white/5">
                            <Lock className="w-6 h-6 opacity-60" />
                        </div>
                        <p className="text-sm font-medium">Restricted Area</p>
                        <p className="mt-1 text-xs opacity-40">Enter authorized passkey to continue</p>
                    </div>
                )}
            </div>
            
            {/* Footer Decoration */}
            <div className="w-full h-1 opacity-50 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </div>
        </div>
      )}

      {/* GALLERY VIEW - PREMIUM GRID */}
      {showGallery && (
        <div className="fixed inset-0 z-[100000] bg-[#050505] animate-in zoom-in-95 duration-500 overflow-y-auto">
            
            {/* Gallery Header */}
            <div className="sticky top-0 z-50 px-6 py-4 border-b bg-black/80 backdrop-blur-xl border-white/10">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white">
                        <Grid className="text-purple-500" /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">{galleryTitle}</span>
                    </h2>
                    <button onClick={() => setShowGallery(false)} className="p-2 transition-all rounded-full text-neutral-400 hover:bg-white/10 hover:text-white hover:rotate-90">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid w-full max-w-6xl grid-cols-1 gap-6 p-6 pb-20 mx-auto md:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map((item, idx) => {
                    const thumbUrl = getThumbnail(item.src, item.thumbnail);
                    return (
                        <div 
                            key={idx} 
                            onClick={() => openMedia(item)} 
                            className="group relative overflow-hidden cursor-pointer bg-neutral-900 border border-white/5 rounded-3xl aspect-video hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1"
                        >
                            {/* Image/Thumbnail */}
                            <div className="relative w-full h-full">
                                {thumbUrl ? (
                                    <>
                                        <img src={thumbUrl} alt={item.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="flex items-center justify-center transition-all duration-300 border rounded-full w-14 h-14 bg-white/10 backdrop-blur-md border-white/20 group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:scale-110">
                                                    <Play className="w-6 h-6 ml-1 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full transition-colors bg-neutral-900 group-hover:bg-neutral-800">
                                        {item.type === 'video' ? 
                                            <Video className="w-12 h-12 transition-colors text-neutral-600 group-hover:text-purple-500" /> : 
                                            <img src={item.src} className="object-cover w-full h-full opacity-60 group-hover:opacity-100" />
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Title Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-300 translate-y-2 bg-gradient-to-t from-black via-black/80 to-transparent group-hover:translate-y-0">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-white truncate">
                                    {item.title} 
                                    <ArrowRight className="w-4 h-4 text-purple-500 transition-all -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      )}

      {/* MEDIA PLAYER - CINEMATIC MODE */}
      {showPlayer && currentMedia && (
        <div className="fixed inset-0 z-[100001] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <button 
                onClick={() => setShowPlayer(false)} 
                className="absolute z-50 p-3 transition-all border border-transparent rounded-full text-white/50 top-6 right-6 hover:bg-white/10 hover:text-white hover:border-white/10"
            >
                <X size={32} />
            </button>
            
            <div className="relative flex flex-col items-center w-full max-w-7xl">
                <div className="relative w-full overflow-hidden bg-black border shadow-2xl rounded-2xl border-white/10">
                    {currentMedia.type === 'video' ? (
                        isExternalVideo(currentMedia.src) ? 
                        <iframe src={currentMedia.src} className="w-full aspect-video max-h-[85vh]" allowFullScreen allow="autoplay; encrypted-media"></iframe> : 
                        <video src={currentMedia.src} controls autoPlay className="w-full h-auto max-h-[85vh]" />
                    ) : (
                        <img src={currentMedia.src} className="w-full h-auto max-h-[85vh] object-contain" />
                    )}
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-wide text-white">{currentMedia.title}</h3>
            </div>
        </div>
      )}
    </>
  );
};

export default SecretVault;