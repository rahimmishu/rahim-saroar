import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 🎵 আপনার প্লেলিস্ট (public ফোল্ডারে গান থাকলে হুবহু নাম লিখুন)
  const playlist = [
    {
      title: "My Favorite Song",
      artist: "Artist Name",
      src: "/song1.mp3", // নিশ্চিত করুন public ফোল্ডারে এই নামের গান আছে
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop"
    },
    {
      title: "Coding Mode",
      artist: "Focus Music",
      src: "/song2.mp3",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.log("Autoplay blocked:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <audio 
        ref={audioRef} 
        src={playlist[currentTrack]?.src} 
        onEnded={handleNext}
      />

      {isOpen && (
        <div className="w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-blue-500 uppercase">Now Playing</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-4 items-center mb-4">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200">
              <img src={playlist[currentTrack]?.cover} alt="Cover" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 dark:text-white font-bold text-sm truncate">{playlist[currentTrack]?.title}</h3>
              <p className="text-slate-500 text-xs truncate">{playlist[currentTrack]?.artist}</p>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-2">
            <button onClick={handlePrev} className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-500">
              <SkipBack size={18} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button onClick={handleNext} className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-500">
              <SkipForward size={18} />
            </button>
            <button onClick={toggleMute} className="p-2 text-slate-400 hover:text-slate-600 ml-1 border-l border-slate-300 dark:border-slate-700 pl-3">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all"
        >
          <Music size={20} className={`text-slate-700 dark:text-white ${isPlaying ? 'animate-bounce' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default MusicPlayer;