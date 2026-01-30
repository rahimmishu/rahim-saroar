import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, Play, Pause, SkipForward, SkipBack, X, 
  Volume2, VolumeX, Volume1, ListMusic 
} from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, togglePlay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 🔥 আপনার নতুন প্লেলিস্ট
  const playlist = [
    {
      title: "Airtel X Bhoot FM",
      artist: "Rahim Saroar",
      src: "/music/airlel-bhootfm.mp3",
      cover: "/music/airlel-bhootfm.jpg"
    },
    {
      title: "Airtel Phonk 3D",
      artist: "Rahim Saroar",
      src: "/music/phonk.mp3",
      cover: "/music/phonk.jpg"
    },
    {
      title: "Barbaad",
      artist: "Jubin Nautiyal",
      src: "/music/barbaad.mp3",
      cover: "/music/barbaad.jpg"
    },
    {
      title: "Saiyaara",
      artist: "Faheem Abdullah",
      src: "/music/saiyaara.mp3",
      cover: "/music/saiyaara.jpg"
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
    },
    {
      title: "Ishq",
      artist: "Faheem Abdullah",
      src: "/music/ishq.mp3",
      cover: "/music/ishq.jpg"
    },
    {
      title: "Jisko Jovi Milta Hai",
      artist: "Manisha Sharma",
      src: "/music/jisko.mp3",
      cover: "/music/jisko.jpg"
    },
    {
      title: "Teri Nazron Ka Dil",
      artist: "Faheem Abdullah",
      src: "/music/teri-nazar.mp3",
      cover: "/music/teri-nazar.jpg"
    },
    {
      title: "Dhun",
      artist: "Arijit Singh",
      src: "/music/dhun.mp3",
      cover: "/music/dhun.jpg"
    },
    {
      title: "Khola Janala",
      artist: "Faheem Abdullah",
      src: "/music/khola-janala.mp3",
      cover: "/music/khola-janala.jpg"
    },
    {
      title: "Pal Pal",
      artist: "Rahim Saroar",
      src: "/music/pal-pal.mp3",
      cover: "/music/pal-pal.jpg"
    },
    {
      title: "Pal Pal X Talwinder",
      artist: "Rahim Saroar",
      src: "/music/pal.mp3",
      cover: "/music/pal.jpg"
    },
    {
      title: "Tomar Chokhe Alash Amar",
      artist: "Arfin Rumey",
      src: "/music/priyotoma.mp3",
      cover: "/music/priyotoma.jpg"
    },
    {
      title: "Sahiba",
      artist: "Adrita Rikhari",
      src: "/music/sahiba.mp3",
      cover: "/music/sahiba.jpg"
    },
    {
      title: "Shunno",
      artist: "Tanveer Evan",
      src: "/music/shunno.mp3",
      cover: "/music/shunno.jpg"
    },
    {
      title: "Sun Saathiya",
      artist: "Priya Saraiya",
      src: "/music/sun.mp3",
      cover: "/music/sun.jpg"
    },
    {
      title: "Zaalima",
      artist: "Shah Rukh Khan",
      src: "/music/zaalima.mp3",
      cover: "/music/zaalima.jpg"
    },
    {
      title: "Dharia",
      artist: "Sugar",
      src: "/music/dharia.mp3",
      cover: "/music/dharia.jpg"
    },
    {
      title: "Jhol",
      artist: "Annural Khalid",
      src: "/music/jhol.mp3",
      cover: "/music/jhol.jpg"
    },
    {
      title: "Lo Safar",
      artist: "Rahim Saroar",
      src: "/music/lo-safar.mp3",
      cover: "/music/lo-safar.jpg"
    },
    {
      title: "Tum Hi Aana",
      artist: "Jubin Nautiyal",
      src: "/music/tum-hi-aana.mp3",
      cover: "/music/tum-hi-aana.jpg"
    }
  ];

  // Play/Pause হ্যান্ডলার
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
        setIsOpen(true); // গান বাজলে প্লেয়ার ওপেন হবে
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // ভলিউম হ্যান্ডলার
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    if (!isPlaying) togglePlay();
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    if (!isPlaying) togglePlay();
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    if (!isPlaying) togglePlay();
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
    <>
      <audio 
        ref={audioRef} 
        src={playlist[currentTrack]?.src} 
        onEnded={handleNext}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[100] w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl animate-in slide-in-from-left-10 fade-in duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setShowPlaylist(!showPlaylist)} 
              className={`p-1.5 rounded-full transition-colors ${showPlaylist ? 'bg-pink-100 text-pink-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
            >
              <ListMusic size={18} />
            </button>

            <span className="flex items-center gap-2 text-[10px] font-bold text-pink-500 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span> 
              {showPlaylist ? "Playlist" : "Now Playing"}
            </span>

            <button onClick={() => setIsOpen(false)} className="transition-colors text-slate-400 hover:text-red-500">
                <X size={18} />
            </button>
          </div>
          
          <div className="p-4">
            {showPlaylist ? (
              <div className="h-48 pr-1 mb-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
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
                    <img src={track.cover} alt="art" className="object-cover w-8 h-8 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${currentTrack === index ? 'text-pink-600 dark:text-pink-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {track.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
                   <img src={playlist[currentTrack]?.cover} alt="Cover" className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                   <h3 className="text-sm font-bold truncate text-slate-900 dark:text-white">{playlist[currentTrack]?.title}</h3>
                   <p className="text-xs truncate text-slate-500 dark:text-slate-400">{playlist[currentTrack]?.artist}</p>
                </div>
              </div>
            )}

            <div className="mb-3">
              <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek}
                className="w-full h-1 transition-all rounded-lg cursor-pointer appearance-none bg-slate-200 dark:bg-slate-700 accent-pink-500 hover:h-1.5"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <button onClick={handlePrev} className="p-2 transition-colors text-slate-500 dark:text-slate-400 hover:text-pink-500"><SkipBack size={20} /></button>
                   
                   <button onClick={togglePlay} className="p-3 text-white transition-all rounded-full shadow-lg shadow-pink-500/30 bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-110 active:scale-95">
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                   </button>
                   
                   <button onClick={handleNext} className="p-2 transition-colors text-slate-500 dark:text-slate-400 hover:text-pink-500"><SkipForward size={20} /></button>
                </div>

                <div className="flex items-center gap-2 group bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full px-3">
                   <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white">
                     {volume === 0 ? <VolumeX size={16} /> : volume < 0.5 ? <Volume1 size={16} /> : <Volume2 size={16} />}
                   </button>
                   <input 
                     type="range" 
                     min="0" 
                     max="1" 
                     step="0.05" 
                     value={volume} 
                     onChange={(e) => setVolume(Number(e.target.value))}
                     className="w-16 h-1 rounded-lg appearance-none cursor-pointer bg-slate-300 dark:bg-slate-600 accent-slate-500"
                   />
                </div>
             </div>
           </div>
        </div>
      )}
    </>
  );
};

export default AudioPlayer;