import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Search, X, Lock, Grid, Play, Video, Sparkles,
  Command, ArrowRight, ArrowLeft, Folder
} from 'lucide-react';

interface MediaItem {
  type: 'image' | 'video' | 'folder'; 
  src?: string; 
  title: string;
  thumbnail?: string;
  items?: MediaItem[]; 
}

// ── Local Secret codes ────────────────────────────────────────────
const secretCodes: {
  [key: string]: {
    msg: string;
    type: 'text' | 'media' | 'gallery';
    src?: string;
    mediaType?: 'image' | 'video';
    items?: MediaItem[];
  };
} = {
  magic: { msg: '✨ You found the hidden magic!', type: 'text' },
  intro: { msg: '🎬 Playing Intro...', type: 'media', mediaType: 'video', src: '/intro.mp4' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getThumbnail = (src?: string, manual?: string) => {
  if (manual) return manual;
  if (!src) return null;
  if (src.includes('youtube') || src.includes('youtu.be')) {
    let id: string | null = null;
    if (src.includes('embed/')) id = src.split('embed/')[1]?.split('?')[0];
    else if (src.includes('v=')) id = src.split('v=')[1]?.split('&')[0];
    else id = src.split('/').pop() ?? null;
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return null;
};

const isExternalVideo = (src?: string) => {
  if (!src) return false;
  return src.includes('youtube') || src.includes('youtu.be') ||
  src.includes('vimeo') || src.includes('drive.google.com');
}

// ── Component ─────────────────────────────────────────────────────────────────
const VaultPage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // ✅ Track setTimeout IDs for race condition prevention
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);

  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [view, setView] = useState<'search' | 'gallery' | 'player'>('search');
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [galleryHistory, setGalleryHistory] = useState<{items: MediaItem[], title: string}[]>([]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // ✅ Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(id => clearTimeout(id));
      timeoutIdsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'player') setView('gallery');
        else if (view === 'gallery') {
          setView('search');
          setGalleryHistory([]); 
        }
        else navigate('/');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, navigate]);

  // 🔥 এখানেই মূল ডাটাবেসের ম্যাজিকটা হবে!
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Clear any previous timeouts to prevent race conditions
    timeoutIdsRef.current.forEach(id => clearTimeout(id));
    timeoutIdsRef.current = [];
    
    const lowerQuery = query.toLowerCase().trim();
    setIsLoading(true);
    setMessage('🔄 Checking Database...');

    try {
      const { data, error } = await supabase
        .from('vault_items')
        .select('*')
        .eq('secret_code', lowerQuery);

      if (error) throw error;

      if (data && data.length > 0) {
        const folderMap = new Map();
        const directItems: MediaItem[] = [];

        data.forEach((row: any) => {
          const item: MediaItem = {
            type: row.type,
            src: row.src,
            title: row.title,
            thumbnail: row.thumbnail || (row.type === 'image' ? row.src : undefined)
          };

          if (row.folder_name) {
            if (!folderMap.has(row.folder_name)) {
              folderMap.set(row.folder_name, {
                type: 'folder',
                title: row.folder_name,
                thumbnail: row.thumbnail || (row.type === 'image' ? row.src : undefined),
                items: []
              });
            }
            folderMap.get(row.folder_name).items.push(item);
            
            if (!folderMap.get(row.folder_name).thumbnail) {
              folderMap.get(row.folder_name).thumbnail = row.thumbnail || (row.type === 'image' ? row.src : undefined);
            }
          } else {
            directItems.push(item);
          }
        });

        const finalItems = [...Array.from(folderMap.values()), ...directItems];

        setMessage('📂 Access Granted!');
        const timeoutId1 = setTimeout(() => {
          setGalleryItems(finalItems);
          setGalleryTitle(lowerQuery.toUpperCase());
          setView('gallery');
          setIsLoading(false);
        }, 800);
        timeoutIdsRef.current.push(timeoutId1);

      } else {
        const result = secretCodes[lowerQuery];
        if (result) {
          setMessage(result.msg);
          if (result.type === 'gallery' && result.items) {
            const timeoutId2 = setTimeout(() => {
              setGalleryItems(result.items!);
              setGalleryTitle(lowerQuery.toUpperCase());
              setView('gallery');
              setIsLoading(false);
            }, 800);
            timeoutIdsRef.current.push(timeoutId2);
          } else if (result.type === 'media') {
            const timeoutId3 = setTimeout(() => {
              setCurrentMedia({ type: result.mediaType!, src: result.src!, title: 'Secret Content' });
              setView('player');
              setIsLoading(false);
            }, 800);
            timeoutIdsRef.current.push(timeoutId3);
          }
        } else {
          setMessage('❌ Access Denied: Invalid Code');
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Database Error. Check connection.');
      setIsLoading(false);
    }
  };

  const openMedia = (item: MediaItem) => {
    if (item.type === 'folder' && item.items) {
      setGalleryHistory([...galleryHistory, { items: galleryItems, title: galleryTitle }]);
      setGalleryItems(item.items);
      setGalleryTitle(item.title);
    } else if (item.src) {
      setCurrentMedia(item as MediaItem & { src: string });
      setView('player');
    }
  };

  const handleBack = () => {
    const newHistory = [...galleryHistory];
    const prev = newHistory.pop();
    if (prev) {
      setGalleryItems(prev.items);
      setGalleryTitle(prev.title);
      setGalleryHistory(newHistory);
    }
  };

  // ── SEARCH VIEW ─────────────────────────────────────────────────────────────
  if (view === 'search') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#050505] text-slate-200">
        
        {/* 🌌 IMMERSIVE BACKGROUND ORBS */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="absolute z-50 flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all duration-300 border rounded-full top-6 left-6 bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* ── Search Box Container ── */}
        <div className="relative z-10 w-full max-w-xl mx-4 group">
          {/* Animated Glow Behind Box */}
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-xl opacity-50 transition duration-500 group-hover:opacity-100"></div>
          
          <div className="relative overflow-hidden border shadow-2xl bg-black/40 border-white/10 rounded-3xl backdrop-blur-2xl">
            
            {/* Input Header */}
            <div className="flex items-center px-6 py-6 border-b border-white/5 bg-white/[0.02]">
              <Command className={`w-6 h-6 mr-4 text-purple-400 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  disabled={isLoading}
                  placeholder="Enter access code..."
                  className="w-full text-xl font-bold tracking-wide text-white bg-transparent border-none outline-none placeholder:text-slate-600 disabled:opacity-50"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
              <kbd className="px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-md bg-white/5 text-slate-400 border border-white/10 shadow-inner">ESC</kbd>
            </div>

            {/* Message Area */}
            <div className="p-10 text-center min-h-[160px] flex flex-col items-center justify-center">
              {message ? (
                <div className="duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-4 text-purple-400 rounded-2xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    <Sparkles size={24} />
                  </div>
                  <p className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-200">
                    {message}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center duration-700 text-slate-500 animate-in fade-in">
                  <div className="p-4 mb-4 border rounded-2xl bg-white/[0.02] border-white/5 shadow-inner">
                    <Lock className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm font-bold tracking-widest uppercase text-slate-400">Restricted Area</p>
                  <p className="mt-2 text-xs font-medium tracking-wide opacity-50">Enter authorized passkey to continue</p>
                </div>
              )}
            </div>
            
            {/* Animated Bottom Line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  // ── GALLERY VIEW ─────────────────────────────────────────────────────────────
  if (view === 'gallery') {
    return (
      <div 
        className="fixed inset-0 h-screen bg-[#050505] text-slate-200 overflow-y-auto overflow-x-hidden overscroll-contain" 
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* 🌌 IMMERSIVE BACKGROUND ORBS */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-blue-600/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* ── Sticky Header ── */}
        <div className="sticky top-0 z-50 px-6 py-5 border-b bg-black/60 backdrop-blur-2xl border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-5">
              {galleryHistory.length > 0 && (
                <button
                  onClick={handleBack}
                  className="p-2.5 text-white transition-all rounded-xl bg-white/5 hover:bg-purple-600 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-white/10"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                <div className="p-2 border rounded-xl bg-purple-500/10 border-purple-500/20">
                  <Grid className="text-purple-400" size={20} />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  {galleryTitle}
                </span>
              </h2>
            </div>

            <button
              onClick={() => {
                setView('search');
                setGalleryHistory([]);
              }}
              className="p-2.5 transition-all rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:rotate-90 hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-6 p-6 pb-24 mx-auto duration-700 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-8">
          {galleryItems.map((item, idx) => {
            const thumbUrl = getThumbnail(item.src, item.thumbnail);
            return (
              <div
                key={idx}
                onClick={() => openMedia(item)}
                className="group relative overflow-hidden cursor-pointer bg-white/[0.02] border border-white/5 rounded-3xl aspect-video hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.4)] backdrop-blur-md"
              >
                <div className="relative w-full h-full">
                  {thumbUrl ? (
                    <>
                      <img
                        src={thumbUrl}
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center justify-center transition-all duration-500 border rounded-full shadow-2xl w-14 h-14 bg-black/40 backdrop-blur-md border-white/20 group-hover:bg-purple-600 group-hover:border-purple-400 group-hover:scale-125 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                            <Play className="w-5 h-5 ml-1 text-white" fill="currentColor" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full transition-colors bg-black/20 group-hover:bg-black/40">
                      {item.type === 'video' ? (
                        <div className="p-4 transition-all duration-500 border rounded-2xl bg-white/5 border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/40">
                          <Video className="w-8 h-8 transition-all text-slate-500 group-hover:text-purple-400 group-hover:scale-110" />
                        </div>
                      ) : item.type === 'folder' ? (
                        <div className="p-4 transition-all duration-500 border rounded-2xl bg-white/5 border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/40">
                          <Folder className="w-8 h-8 transition-all text-slate-500 group-hover:text-blue-400 group-hover:scale-110" />
                        </div>
                      ) : (
                        <img src={item.src} className="object-cover w-full h-full transition-opacity duration-500 opacity-60 group-hover:opacity-100" />
                      )}
                    </div>
                  )}
                </div>

                {/* Gradient Overlay & Title */}
                <div className="absolute inset-x-0 bottom-0 p-6 transition-all duration-500 translate-y-4 group-hover:translate-y-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-80 group-hover:opacity-100">
                  <h3 className="flex items-center gap-3 text-lg font-bold text-white truncate drop-shadow-md">
                    {item.title}
                    <ArrowRight className="w-4 h-4 text-purple-400 transition-all duration-500 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── PLAYER VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-500 bg-black/95 backdrop-blur-2xl animate-in fade-in">
      <button
        onClick={() => setView('gallery')}
        className="absolute z-50 p-3 transition-all duration-300 border rounded-full bg-white/5 text-slate-300 top-6 right-6 border-white/10 hover:bg-white/10 hover:text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md"
      >
        <X size={24} />
      </button>

      {currentMedia && (
        <div className="relative flex flex-col items-center w-full duration-500 max-w-7xl animate-in zoom-in-95">
          <div className="relative w-full overflow-hidden bg-black border shadow-2xl rounded-3xl border-white/10 ring-1 ring-white/5 shadow-purple-500/10">
            {currentMedia.type === 'video' ? (
              isExternalVideo(currentMedia.src) ? (
                <iframe src={currentMedia.src} className="w-full aspect-video max-h-[85vh] bg-white" allowFullScreen allow="autoplay; encrypted-media" />
              ) : (
                <video src={currentMedia.src} controls autoPlay className="w-full h-auto max-h-[85vh]" />
              )
            ) : (
              <img src={currentMedia.src} alt={currentMedia.title} className="w-full h-auto max-h-[85vh] object-contain" />
            )}
          </div>
          
          <div className="mt-8 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <h3 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {currentMedia.title}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultPage;