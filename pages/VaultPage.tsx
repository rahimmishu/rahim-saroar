import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // 🔥 Supabase ডাটাবেস ইমপোর্ট
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

  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [view, setView] = useState<'search' | 'gallery' | 'player'>('search');
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [galleryHistory, setGalleryHistory] = useState<{items: MediaItem[], title: string}[]>([]);

  useEffect(() => { inputRef.current?.focus(); }, []);

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
    const lowerQuery = query.toLowerCase().trim();
    setIsLoading(true);
    setMessage('🔄 Checking Database...');

    try {
      // ১. ডাটাবেস থেকে ভিডিও খোঁজা
      const { data, error } = await supabase
        .from('vault_items')
        .select('*')
        .eq('secret_code', lowerQuery);

      if (error) throw error;

      if (data && data.length > 0) {
        // ডাটা পাওয়া গেলে ফোল্ডার অনুযায়ী সাজানো হবে
        const folderMap = new Map();
        const directItems: MediaItem[] = [];

        data.forEach((row: any) => {
          // 🔥 ডাটাবেসের thumbnail কলাম যুক্ত করা হলো
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
        setTimeout(() => {
          setGalleryItems(finalItems);
          setGalleryTitle(lowerQuery.toUpperCase());
          setView('gallery');
          setIsLoading(false);
        }, 800);

      } else {
        // ২. ডাটাবেসে না পেলে লোকাল কোড চেক করবে (magic, intro ইত্যাদি)
        const result = secretCodes[lowerQuery];
        if (result) {
          setMessage(result.msg);
          if (result.type === 'gallery' && result.items) {
            setTimeout(() => {
              setGalleryItems(result.items!);
              setGalleryTitle(lowerQuery.toUpperCase());
              setView('gallery');
              setIsLoading(false);
            }, 800);
          } else if (result.type === 'media') {
            setTimeout(() => {
              setCurrentMedia({ type: result.mediaType!, src: result.src!, title: 'Secret Content' });
              setView('player');
              setIsLoading(false);
            }, 800);
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
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(168,85,247,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_center,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:28px_28px]" />

        <button
          onClick={() => navigate('/')}
          className="absolute flex items-center gap-2 px-4 py-2 text-sm transition-all duration-300 border rounded-full top-6 left-6 bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Home</span>
        </button>

        <div className="w-full max-w-xl mx-4 relative overflow-hidden bg-[#0a0a0a]/80 border border-white/10 shadow-2xl rounded-2xl backdrop-blur-2xl ring-1 ring-white/5">
          <div className="flex items-center px-6 py-5 border-b border-white/5">
            <Command className={`w-6 h-6 mr-4 text-purple-500 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
            <form onSubmit={handleSearch} className="flex-1">
              <input
                ref={inputRef}
                type="text"
                disabled={isLoading}
                placeholder="Enter access code..."
                className="w-full text-xl font-medium tracking-wide text-white bg-transparent border-none outline-none placeholder:text-neutral-500 disabled:opacity-50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
            <kbd className="px-2 py-1 text-[10px] font-bold tracking-wider rounded bg-white/5 text-neutral-400 border border-white/5">ESC</kbd>
          </div>

          <div className="p-8 text-center min-h-[140px] flex flex-col items-center justify-center">
            {message ? (
              <div className="duration-300 animate-in fade-in slide-in-from-bottom-2">
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
          <div className="w-full h-px opacity-50 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>
      </div>
    );
  }

  // ── GALLERY VIEW ─────────────────────────────────────────────────────────────
  if (view === 'gallery') {
    return (
      <div 
        className="fixed inset-0 h-screen bg-[#050505] text-white overflow-y-auto overflow-x-hidden overscroll-contain" 
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="sticky top-0 z-50 px-6 py-4 border-b bg-black/80 backdrop-blur-xl border-white/10">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              {galleryHistory.length > 0 && (
                <button
                  onClick={handleBack}
                  className="p-2 text-white transition-all rounded-full bg-white/10 hover:bg-purple-600"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white">
                <Grid className="text-purple-500" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                  {galleryTitle}
                </span>
              </h2>
            </div>

            <button
              onClick={() => {
                setView('search');
                setGalleryHistory([]);
              }}
              className="p-2 transition-all rounded-full text-neutral-400 hover:bg-white/10 hover:text-white hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 p-6 pb-20 mx-auto md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, idx) => {
            const thumbUrl = getThumbnail(item.src, item.thumbnail);
            return (
              <div
                key={idx}
                onClick={() => openMedia(item)}
                className="group relative overflow-hidden cursor-pointer bg-neutral-900 border border-white/5 rounded-3xl aspect-video hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1"
              >
                <div className="relative w-full h-full">
                  {thumbUrl ? (
                    <>
                      <img
                        src={thumbUrl}
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                      />
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
                      {item.type === 'video' ? (
                        <Video className="w-12 h-12 transition-colors text-neutral-600 group-hover:text-purple-500" />
                      ) : item.type === 'folder' ? (
                        <Folder className="w-12 h-12 transition-colors text-neutral-600 group-hover:text-purple-500" />
                      ) : (
                        <img src={item.src} className="object-cover w-full h-full opacity-60 group-hover:opacity-100" />
                      )}
                    </div>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-300 translate-y-2 group-hover:translate-y-0 bg-gradient-to-t from-black via-black/80 to-transparent">
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
    );
  }

  // ── PLAYER VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <button
        onClick={() => setView('gallery')}
        className="absolute z-50 p-3 transition-all border border-transparent rounded-full text-white/50 top-6 right-6 hover:bg-white/10 hover:text-white hover:border-white/10"
      >
        <X size={32} />
      </button>

      {currentMedia && (
        <div className="relative flex flex-col items-center w-full max-w-7xl">
          <div className="relative w-full overflow-hidden bg-black border shadow-2xl rounded-2xl border-white/10">
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
          <h3 className="mt-6 text-2xl font-bold tracking-wide text-white">
            {currentMedia.title}
          </h3>
        </div>
      )}
    </div>
  );
};

export default VaultPage;