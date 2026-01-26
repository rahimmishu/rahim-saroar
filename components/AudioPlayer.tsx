import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX, Volume1, ListMusic } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false); // 🔥 নতুন স্টেট: প্লে-লিস্ট দেখানোর জন্য
  
  // সময় এবং ভলিউমের স্টেট
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 🎵 আপনার প্লেলিস্ট
  const playlist = [
    {
      title: "Airtel X Bhoot FM",
      artist: "Rahim Saroar",
      src: "/music/airlel-bhootfm.mp3",
      cover: "/music/airlel-bhootfm.jpg"
    },
    {
      title: "Barbaad",
      artist: "Jubin Nautiyal",
      src: "/music/barbaad.mp3",
      cover: "/music/barbaad.jpg"
    },
    {
      title: "Chale Aana",
      artist: "Arman Malik",
      src: "/music/chale-aana.mp3", 
      cover: "/music/chale-aana.jpg"
    },
    {
      title: "Ek Mulaqat",
      artist: "Altamash Faridi",
      src: "/music/ek-mulaqat.mp3", 
      cover: "/music/ek-mulaqat.jpg"
    },
    {
      title: "Fakira",
      artist: "Timir Biswas",
      src: "/music/fakira.mp3", 
      cover: "/music/fakira.jpg"
    },
    {
      title: "Salamat",
      artist: "Arijit Singh",
      src: "/music/salamat.mp3", 
      cover: "/music/salamat.jpg"
    },
    {
      title: "Sanam Re",
      artist: "Arijit Singh",
      src: "/music/sanam-re.mp3", 
      cover: "/music/sanam-re.jpg"
    }
  ];

  // Play/Pause হ্যান্ডলার
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // ভলিউম হ্যান্ডলার
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setIsMuted(volume === 0);
    }
  }, [volume]);

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  // লিস্ট থেকে গান সিলেক্ট করার ফাংশন
  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    // setShowPlaylist(false); // চাইলে গান সিলেক্ট করার পর লিস্ট বন্ধ করতে এই লাইনটি আনকমেন্ট করুন
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <div className="fixed bottom-[10.5rem] right-6 z-50 flex flex-col items-end gap-4">
      
      <audio 
        ref={audioRef} 
        src={playlist[currentTrack]?.src} 
        onEnded={handleNext}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />

      {isOpen && (
        <div className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 mb-2">
           
           {/* Header: Playlist Toggle & Close */}
           <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            
            {/* 🔥 LIST BUTTON */}
            <button 
              onClick={() => setShowPlaylist(!showPlaylist)} 
              className={`p-1.5 rounded-full transition-colors ${showPlaylist ? 'bg-pink-100 text-pink-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
              title="Playlist"
            >
              <ListMusic size={20} />
            </button>

            <span className="text-xs font-bold text-pink-500 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span> 
              {showPlaylist ? "Playlist" : "Now Playing"}
            </span>

            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
          </div>
          
          {/* 🔥 CONDITIONAL RENDERING: LIST OR ALBUM ART */}
          {showPlaylist ? (
            // --- Playlist View ---
            <div className="h-40 overflow-y-auto mb-4 pr-1 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              {playlist.map((track, index) => (
                <div 
                  key={index}
                  onClick={() => selectTrack(index)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    currentTrack === index 
                      ? 'bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/30' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <img src={track.cover} alt="art" className="w-8 h-8 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${currentTrack === index ? 'text-pink-600 dark:text-pink-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {track.title}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{track.artist}</p>
                  </div>
                  {currentTrack === index && (
                    <div className="flex space-x-[2px]">
                      <div className="w-[2px] h-2 bg-pink-500 animate-pulse"></div>
                      <div className="w-[2px] h-3 bg-pink-500 animate-pulse delay-75"></div>
                      <div className="w-[2px] h-2 bg-pink-500 animate-pulse delay-150"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // --- Album Art View (Default) ---
            <div className="flex gap-4 items-center mb-4">
              <div className={`w-14 h-14 rounded-lg overflow-hidden shadow-md ${isPlaying ? 'animate-spin-slow' : ''}`}>
                 <img src={playlist[currentTrack]?.cover} alt="Cover" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                 <h3 className="text-slate-900 dark:text-white font-bold text-sm truncate">{playlist[currentTrack]?.title}</h3>
                 <p className="text-slate-500 text-xs truncate">{playlist[currentTrack]?.artist}</p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-3">
            <input 
              type="range" 
              min="0" 
              max={duration} 
              value={currentTime} 
              onChange={handleSeek}
              className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:h-1.5 transition-all"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-2 px-3">
             <button onClick={handlePrev} className="p-2 text-slate-600 dark:text-slate-300 hover:text-pink-500"><SkipBack size={18} /></button>
             
             <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
             </button>
             
             <button onClick={handleNext} className="p-2 text-slate-600 dark:text-slate-300 hover:text-pink-500"><SkipForward size={18} /></button>

             {/* Volume Control */}
             <div className="flex items-center gap-1 group ml-2 relative">
                <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  {volume === 0 ? <VolumeX size={16} /> : volume < 0.5 ? <Volume1 size={16} /> : <Volume2 size={16} />}
                </button>
                <div className="w-0 group-hover:w-16 overflow-hidden transition-all duration-300 flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-14 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-500 ml-1"
                  />
                </div>
             </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
        >
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-pink-500 border-r-rose-400 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Music size={24} className={`text-slate-700 dark:text-white transition-colors group-hover:text-pink-500 ${isPlaying ? 'animate-bounce' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default MusicPlayer;