import React, { useState, useEffect } from 'react';
import { Search, X, Lock, Grid, Play, Video, Sparkles, Command, ArrowRight, Folder, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MediaItem {
  type: 'image' | 'video' | 'folder';
  src?: string;
  title: string;
  thumbnail?: string;
  items?: MediaItem[];
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
  const [galleryHistory, setGalleryHistory] = useState<{items: MediaItem[], title: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const secretCodes: { [key: string]: { 
      msg: string, type: 'text' | 'media' | 'gallery', src?: string, mediaType?: 'image' | 'video', items?: MediaItem[], action?: () => void 
  } } = {
    "magic": { msg: "✨ You found the hidden magic!", type: 'text' },
    "intro": { msg: "🎬 Playing Intro...", type: 'media', mediaType: 'video', src: '/intro.mp4' },
  };

  const openSecretSearch = () => {
    setIsOpen(true);
    setMessage('');
    setQuery('');
    setShowGallery(false);
    setShowPlayer(false);
    setGalleryHistory([]);
  };

  const closeAll = () => {
    if (showPlayer) setShowPlayer(false);
    else if (showGallery) setShowGallery(false);
    else setIsOpen(false);
    setGalleryHistory([]);
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

  const getThumbnail = (src?: string, manualThumbnail?: string) => {
    if (manualThumbnail) return manualThumbnail;
    if (!src) return null; 
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      let videoId: string | null = null;
      
      // ✅ Add proper validation for string split results
      if (src.includes('embed/')) {
        const embedParts = src.split('embed/');
        videoId = (embedParts[1]?.split('?')[0]) || null;
      }
      else if (src.includes('v=')) {
        const vParts = src.split('v=');
        videoId = (vParts[1]?.split('&')[0]) || null;
      }
      else {
        const pathParts = src.split('/');
        videoId = (pathParts.length > 0 ? pathParts[pathParts.length - 1] : null) || null;
      }
      
      // ✅ Ensure videoId is not empty before using
      if (videoId && videoId.trim()) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    return null;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
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
          setShowGallery(true);
          setIsLoading(false);
        }, 800);

      } else {
        const result = secretCodes[lowerQuery];
        if (result) {
          setMessage(result.msg);
          if (result.type === 'gallery' && result.items) {
            setTimeout(() => {
              setGalleryItems(result.items!);
              setGalleryTitle(lowerQuery.toUpperCase());
              setShowGallery(true);
              setIsLoading(false);
            }, 800);
          } else if (result.type === 'media') {
            setTimeout(() => {
              setCurrentMedia({ type: result.mediaType!, src: result.src!, title: 'Secret Content' });
              setShowPlayer(true);
              setIsLoading(false);
            }, 800);
          } else if (result.action) {
            setTimeout(() => {
                result.action!();
                setIsLoading(false);
            }, 1000);
          }
        } else {
          setMessage("❌ Access Denied: Invalid Code");
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
      setShowPlayer(true);
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

  const isExternalVideo = (src?: string) => {
    if (!src) return false; 
    return src.includes('youtube') || src.includes('youtu.be') || src.includes('vimeo') || src.includes('drive.google.com');
  };

  if (!isOpen && !showGallery && !showPlayer) return null;

  return (
    <>
      {isOpen && !showGallery && !showPlayer && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xl flex items-start justify-center pt-[20vh] animate-in fade-in duration-300">
          <div className="absolute top-[20vh] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="w-full max-w-xl mx-4 relative overflow-hidden bg-[#0a0a0a]/80 border border-white/10 shadow-2xl rounded-2xl backdrop-blur-2xl ring-1 ring-white/5 transform transition-all">
            <div className="flex items-center px-6 py-5 border-b border-white/5">
              <Command className={`w-6 h-6 mr-4 text-purple-500 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
              <form onSubmit={handleSearch} className="flex-1">
                <input 
                  type="text" 
                  autoFocus 
                  disabled={isLoading}
                  placeholder="Enter access code..." 
                  className="w-full text-xl font-medium tracking-wide text-white bg-transparent border-none outline-none placeholder:text-neutral-500 disabled:opacity-50" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />
              </form>
              <div className="flex items-center gap-2">
                 <button onClick={closeAll} className="px-2 py-1 text-[10px] font-bold tracking-wider rounded bg-white/5 text-neutral-400 border border-white/5 hover:bg-white/10 transition-colors">ESC</button>
              </div>
            </div>
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
            <div className="w-full h-1 opacity-50 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </div>
        </div>
      )}

      {showGallery && (
        <div className="fixed inset-0 z-[100000] h-screen bg-[#050505] animate-in zoom-in-95 duration-500 overflow-y-auto overflow-x-hidden overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="sticky top-0 z-50 px-6 py-4 border-b bg-black/80 backdrop-blur-xl border-white/10">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        {galleryHistory.length > 0 && (
                            <button onClick={handleBack} className="p-2 text-white transition-all rounded-full bg-white/10 hover:bg-purple-600">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white">
                            <Grid className="text-purple-500" /> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">{galleryTitle}</span>
                        </h2>
                    </div>
                    <button onClick={() => setShowGallery(false)} className="p-2 transition-all rounded-full text-neutral-400 hover:bg-white/10 hover:text-white hover:rotate-90">
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="grid w-full max-w-6xl grid-cols-1 gap-6 p-6 pb-20 mx-auto md:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map((item, idx) => {
                    const thumbUrl = getThumbnail(item.src, item.thumbnail);
                    return (
                        <div key={idx} onClick={() => openMedia(item)} className="group relative overflow-hidden cursor-pointer bg-neutral-900 border border-white/5 rounded-3xl aspect-video hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1">
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

      {showPlayer && currentMedia && (
        <div className="fixed inset-0 z-[100001] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <button onClick={() => setShowPlayer(false)} className="absolute z-50 p-3 transition-all border border-transparent rounded-full text-white/50 top-6 right-6 hover:bg-white/10 hover:text-white hover:border-white/10">
                <X size={32} />
            </button>
            <div className="relative flex flex-col items-center w-full max-w-7xl">
                <div className="relative w-full overflow-hidden bg-black border shadow-2xl rounded-2xl border-white/10">
                    {currentMedia.type === 'video' || currentMedia.type === 'folder' ? (
                        isExternalVideo(currentMedia.src) || currentMedia.type === 'folder' ? 
                        <iframe src={currentMedia.src} className="w-full aspect-video max-h-[85vh] bg-white" allowFullScreen allow="autoplay; encrypted-media"></iframe> : 
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