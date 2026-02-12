import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Heart, 
  ExternalLink, X, ListMusic 
} from 'lucide-react';

interface MusicPlayerProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

// 🎵 Track Type - Local বা YouTube
interface Track {
  title: string;
  artist: string;
  cover: string;
  type: 'local' | 'youtube';
  src?: string; // Local audio file path
  youtubeId?: string; // YouTube video ID
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, togglePlay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [barWidth, setBarWidth] = useState("0%");
  const [isFavorite, setIsFavorite] = useState(false);
  const [youtubeReady, setYoutubeReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // 🔥 হাইব্রিড প্লেলিস্ট (Local + YouTube)
  const playlist: Track[] = [
    // Local Songs (কিছু গান public folder এ রাখুন - হালকা রাখার জন্য ৩-৫টা)
    { title: "Airtel X Bhoot FM", artist: "Rahim Saroar", type: 'local', src: "/music/airlel-bhootfm.mp3", cover: "/music/airlel-bhootfm.jpg" },
    { title: "Airtel Phonk 3D", artist: "Rahim Saroar", type: 'local', src: "/music/phonk.mp3", cover: "/music/phonk.jpg" },
    { title: "Barbaad", artist: "Jubin Nautiyal",type: 'local', src: "/music/barbaad.mp3", cover: "/music/barbaad.jpg" },
    { title: "Saiyaara", artist: "Faheem Abdullah", type: 'local',src: "/music/saiyaara.mp3", cover: "/music/saiyaara.jpg" },
    { title: "Chale Aana", artist: "Arman Malik", type: 'local',src: "/music/chale-aana.mp3", cover: "/music/chale-aana.jpg" },
    { title: "Ek Mulaqat", artist: "Altamash Faridi", type: 'local',src: "/music/ek-mulaqat.mp3", cover: "/music/ek-mulaqat.jpg" },
    { title: "Fakira", artist: "Timir Biswas", type: 'local',src: "/music/fakira.mp3", cover: "/music/fakira.jpg" },
    { title: "Salamat", artist: "Arijit Singh", type: 'local',src: "/music/salamat.mp3", cover: "/music/salamat.jpg" },
    { title: "Sanam Re", artist: "Arijit Singh", type: 'local',src: "/music/sanam-re.mp3", cover: "/music/sanam-re.jpg" },
    { title: "Ishq", artist: "Faheem Abdullah", type: 'local',src: "/music/ishq.mp3", cover: "/music/ishq.jpg" },
    { title: "Jisko Jovi Milta Hai", artist: "Manisha Sharma", type: 'local', src: "/music/jisko.mp3", cover: "/music/jisko.jpg" },
    { title: "Teri Nazron Ka Dil", artist: "Faheem Abdullah", type: 'local', src: "/music/teri-nazar.mp3", cover: "/music/teri-nazar.jpg" },
    { title: "Dhun", artist: "Arijit Singh", type: 'local', src: "/music/dhun.mp3", cover: "/music/dhun.jpg" },
    { title: "Khola Janala", artist: "Faheem Abdullah", type: 'local', src: "/music/khola-janala.mp3", cover: "/music/khola-janala.jpg" },
    { title: "Pal Pal", artist: "Rahim Saroar", type: 'local', src: "/music/pal-pal.mp3", cover: "/music/pal-pal.jpg" },
    { title: "Pal Pal X Talwinder", artist: "Rahim Saroar", type: 'local', src: "/music/pal.mp3", cover: "/music/pal.jpg" },
    { title: "Tomar Chokhe Alash Amar", artist: "Arfin Rumey", type: 'local', src: "/music/priyotoma.mp3", cover: "/music/priyotoma.jpg" },
    { title: "Sahiba", artist: "Adrita Rikhari", type:'local', src: "/music/sahiba.mp3", cover: "/music/sahiba.jpg" },
    { title: "Shunno", artist:"Tanveer Evan", type:'local', src:"/music/shunno.mp3", cover:"/music/shunno.jpg"},
    { title:"Sun Saathiya", artist:"Priya Saraiya", type:'local', src:"/music/sun.mp3", cover:"/music/sun.jpg"},
    { title: "Zaalima", artist: "Shah Rukh Khan", type: 'local', src: "/music/zaalima.mp3", cover: "/music/zaalima.jpg" },
    { title: "Dharia", artist: "Sugar", type: 'local', src: "/music/dharia.mp3", cover: "/music/dharia.jpg" },
    { title: "Jhol", artist: "Annural Khalid", type: 'local', src: "/music/jhol.mp3", cover: "/music/jhol.jpg" },
    { title: "Lo Safar", artist: "Rahim Saroar", type: 'local', src: "/music/lo-safar.mp3", cover: "/music/lo-safar.jpg" },
    { title: "Tum Hi Aana", artist: "Jubin Nautiyal", type:'local', src:"/music/tum-hi-aana.mp3", cover:"/music/tum-hi-aana.jpg"},

    // ✨ YouTube Songs (YouTube Video ID দিয়ে - website heavy হবে না!)
    { 
      title: "Gulabi Aankhon", 
      artist: "Sanam Pur", 
      type: 'youtube',
      youtubeId: "hgi2MYAFgE8?si", // YouTube video ID
      cover: "https://img.youtube.com/vi/hgi2MYAFgE8/maxresdefault.jpg" 
    },
    { 
      title: "ain Agar Kahoon", 
      artist: "Shahrukh Khan", 
      type: 'youtube',
      youtubeId: "DAYszemgPxc?si",
      cover: "https://img.youtube.com/vi/DAYszemgPxc/maxresdefault.jpg" 
    },
    { 
      title: "Hamqadam", 
      artist: "Shrey Singhal", 
      type: 'youtube',
      youtubeId: "rS3dghN1P3I?si",
      cover: "https://img.youtube.com/vi/rS3dghN1P3I/maxresdefault.jpg" 
    },
    { 
      title: "KHAIRIYAT", 
      artist: "Arijit Singh", 
      type: 'youtube',
      youtubeId: "hoNb6HuNmU0?si",
      cover: "https://img.youtube.com/vi/hoNb6HuNmU0/maxresdefault.jpg" 
    },
    { 
      title: "Mere Mehboob Qayamat Hogi", 
      artist: "Kishore Kumar", 
      type: 'youtube',
      youtubeId: "M6Ul3ASaFLU?si",
      cover: "https://img.youtube.com/vi/M6Ul3ASaFLU/maxresdefault.jpg" 
    },
    { 
      title: "Zara Zara Bahekta Ha", 
      artist: "JalRaj (Jalaj)", 
      type: 'youtube',
      youtubeId: "NeXbmEnpSz0?si",
      cover: "https://img.youtube.com/vi/NeXbmEnpSz0/maxresdefault.jpg" 
    },
    { 
      title: "EK MULAQAT", 
      artist: "Jubin Nautiyal", 
      type: 'youtube',
      youtubeId: "_qrxVjvVp4M?si",
      cover: "https://img.youtube.com/vi/_qrxVjvVp4M/maxresdefault.jpg" 
    },
    { 
      title: "Tujhe Sochta Hoon", 
      artist: "K K", 
      type: 'youtube',
      youtubeId: "ZhYf7dlAwFw?si",
      cover: "https://img.youtube.com/vi/ZhYf7dlAwFw?si/maxresdefault.jpg" 
    },
    { 
      title: "Kesariya", 
      artist: "Arijit Singh", 
      type: 'youtube',
      youtubeId: "Dkk9gvTmCXY",
      cover: "https://img.youtube.com/vi/Dkk9gvTmCXY/maxresdefault.jpg" 
    },
    { 
      title: "Heeriye", 
      artist: "Arijit Singh", 
      type: 'youtube',
      youtubeId: "BvSB4kjNSmw",
      cover: "https://img.youtube.com/vi/BvSB4kjNSmw/maxresdefault.jpg" 
    },
    { 
      title: "Apna Bana Le", 
      artist: "Arijit Singh", 
      type: 'youtube',
      youtubeId: "qri-tha2pJQ",
      cover: "https://img.youtube.com/vi/qri-tha2pJQ/maxresdefault.jpg" 
    },
  ];

  const currentTrack = playlist[currentTrackIndex];
  const isYoutube = currentTrack?.type === 'youtube';

  // 🎬 Load YouTube IFrame API
  useEffect(() => {
    // Check if API already loaded
    if (window.YT && window.YT.Player) {
      setYoutubeReady(true);
      return;
    }

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // API ready callback
    (window as any).onYouTubeIframeAPIReady = () => {
      setYoutubeReady(true);
    };
  }, []);

  // 🎵 Initialize YouTube Player
  useEffect(() => {
    if (!youtubeReady || !isYoutube || !currentTrack.youtubeId) return;

    // Destroy previous player if exists
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.destroy();
    }

    // Create new player
    youtubePlayerRef.current = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: currentTrack.youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 0,
      },
      events: {
        onReady: (event: any) => {
          if (isPlaying) {
            event.target.playVideo();
          }
        },
        onStateChange: (event: any) => {
          // Auto play next when video ends
          if (event.data === window.YT.PlayerState.ENDED) {
            handleNext();
          }
        },
      },
    });

    return () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
    };
  }, [currentTrackIndex, youtubeReady]);

  // 🎵 Play/Pause Control
  useEffect(() => {
    if (isYoutube) {
      // YouTube player control
      if (youtubePlayerRef.current && youtubePlayerRef.current.playVideo) {
        if (isPlaying) {
          youtubePlayerRef.current.playVideo();
          setIsOpen(true);
        } else {
          youtubePlayerRef.current.pauseVideo();
        }
      }
    } else {
      // Local audio control
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
          setIsOpen(true);
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [isPlaying, currentTrackIndex, isYoutube]);

  // ⏱️ Update Progress Bar
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateProgress = () => {
      if (isYoutube && youtubePlayerRef.current && youtubePlayerRef.current.getCurrentTime) {
        const currentTime = youtubePlayerRef.current.getCurrentTime();
        const duration = youtubePlayerRef.current.getDuration();

        if (duration) {
          const width = (100 / duration) * currentTime;
          setBarWidth(`${width}%`);
          
          const curmin = Math.floor(currentTime / 60);
          const cursec = Math.floor(currentTime - curmin * 60);
          const durmin = Math.floor(duration / 60);
          const dursec = Math.floor(duration - durmin * 60);
          
          setCurrentTime(`${curmin < 10 ? '0' + curmin : curmin}:${cursec < 10 ? '0' + cursec : cursec}`);
          setDuration(`${durmin < 10 ? '0' + durmin : durmin}:${dursec < 10 ? '0' + dursec : dursec}`);
        }
      } else if (!isYoutube && audioRef.current) {
        const audio = audioRef.current;
        if (audio.duration) {
          const width = (100 / audio.duration) * audio.currentTime;
          setBarWidth(`${width}%`);
          
          const curmin = Math.floor(audio.currentTime / 60);
          const cursec = Math.floor(audio.currentTime - curmin * 60);
          const durmin = Math.floor(audio.duration / 60);
          const dursec = Math.floor(audio.duration - durmin * 60);
          
          setCurrentTime(`${curmin < 10 ? '0' + curmin : curmin}:${cursec < 10 ? '0' + cursec : cursec}`);
          setDuration(`${durmin < 10 ? '0' + durmin : durmin}:${dursec < 10 ? '0' + dursec : dursec}`);
        }
      }
    };

    if (isPlaying) {
      interval = setInterval(updateProgress, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isYoutube, currentTrackIndex]);

  // 🔄 Local Audio Events
  useEffect(() => {
    if (isYoutube) return;

    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isYoutube]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    if (!isPlaying) togglePlay();
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    if (!isPlaying) togglePlay();
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    if (!isPlaying) togglePlay();
    setShowPlaylist(false);
  };

  const clickProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const progress = progressRef.current;
      const position = e.pageX - progress.getBoundingClientRect().left;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) percentage = 100;
      if (percentage < 0) percentage = 0;

      if (isYoutube && youtubePlayerRef.current && youtubePlayerRef.current.getDuration) {
        const duration = youtubePlayerRef.current.getDuration();
        const seekTime = (duration * percentage) / 100;
        youtubePlayerRef.current.seekTo(seekTime, true);
      } else if (audioRef.current) {
        audioRef.current.currentTime = (audioRef.current.duration * percentage) / 100;
      }

      if (!isPlaying) togglePlay();
    }
  };

  return (
    <>
      {/* Local Audio Player */}
      {!isYoutube && <audio ref={audioRef} src={currentTrack?.src} />}
      
      {/* YouTube Player (Hidden) */}
      <div id="youtube-player" style={{ display: 'none' }}></div>

      {/* Main Player Widget */}
      {isOpen && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 md:left-10 md:transform-none z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500 w-full flex justify-center md:block pointer-events-none md:pointer-events-auto">
          
          <style>{`
            @import url('https://fonts.googleapis.com/css?family=Bitter:400,700&display=swap&subset=latin-ext');
            
            .player-card {
                background: #eef3f7;
                width: 380px; 
                min-height: 430px;
                box-shadow: 0px 15px 35px -5px rgba(50, 88, 130, 0.32);
                border-radius: 15px;
                padding: 30px;
                font-family: "Bitter", serif;
                position: relative;
                transition: all 0.3s ease;
                pointer-events: auto;
            }
            .dark .player-card {
                background: #1e293b;
                box-shadow: 0px 15px 35px -5px rgba(0, 0, 0, 0.5);
            }

            .player__top {
                display: flex;
                align-items: flex-start;
                position: relative;
                z-index: 4;
            }

            .player-cover {
                width: 250px;
                height: 250px;
                margin-left: -50px;
                flex-shrink: 0;
                position: relative;
                z-index: 2;
                border-radius: 15px;
                z-index: 1;
                transition: all 0.3s ease;
            }

            .player-cover__item {
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                width: 100%;
                height: 100%;
                border-radius: 15px;
                box-shadow: 0px 10px 24px 0px rgba(50, 88, 130, 0.40);
            }
            .dark .player-cover__item {
                box-shadow: 0px 10px 24px 0px rgba(0, 0, 0, 0.6);
            }

            .player-controls {
                flex: 1;
                padding-left: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .player-controls__item {
                display: inline-flex;
                font-size: 30px;
                padding: 5px;
                margin-bottom: 10px;
                color: #acb8cc;
                cursor: pointer;
                width: 50px;
                height: 50px;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all .3s ease-in-out;
            }
            .player-controls__item::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #fff;
                transform: scale(0.5);
                opacity: 0;
                box-shadow: 0px 5px 10px 0px rgba(50, 88, 130, 0.20);
                transition: all .3s ease-in-out;
                transition: all .3s ease-in-out;
            }
            .player-controls__item:hover {
                color: #532ab9;
            }
            .dark .player-controls__item:hover {
                color: #818cf8;
            }
            .player-controls__item:hover::before {
                opacity: 1;
                transform: scale(1.3);
            }
            .player-controls__item.-xl {
                margin-top: 0px;
                font-size: 95px;
                filter: drop-shadow(0 2px 8px rgba(83, 42, 185, 0.3));
                color: #532ab9;
                width: 65px;
                height: 65px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .dark .player-controls__item.-xl {
                color: #818cf8;
                filter: drop-shadow(0 2px 8px rgba(129, 140, 248, 0.4));
            }
            .player-controls__item.-favorite.active {
                color: #ff5e79;
            }

            .album-info {
                color: #71829e;
                flex: 1;
                padding-right: 60px;
            }
            .dark .album-info { color: #94a3b8; }

            .album-info__name {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 12px;
                line-height: 1.3em;
                color: #4a537f;
            }
            .dark .album-info__name { color: #e2e8f0; }

            .album-info__track {
                font-weight: 400;
                font-size: 14px;
                opacity: .7;
                line-height: 1.3em;
                min-height: 52px;
            }

            .progress {
                width: 100%;
                margin-top: 15px;
            }

            .progress__top {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
            }

            .progress__duration {
                color: #71829e;
                font-weight: 700;
                font-size: 20px;
                opacity: 0.5;
            }

            .progress__bar {
                height: 6px;
                width: 100%;
                cursor: pointer;
                background-color: #d0d8e6;
                display: inline-block;
                border-radius: 10px;
                margin-top: 10px;
            }
            .dark .progress__bar { background-color: #334155; }

            .progress__current {
                height: inherit;
                width: 0%;
                background-color: #a3b3ce;
                border-radius: 10px;
            }
            .dark .progress__current { background-color: #6366f1; }

            .progress__time {
                margin-top: 2px;
                color: #71829e;
                font-weight: 700;
                font-size: 16px;
                opacity: 0.7;
            }

            .close-btn {
                position: absolute;
                top: 10px;
                right: 15px;
                color: #acb8cc;
                cursor: pointer;
                z-index: 10;
            }
            .close-btn:hover { color: #ef4444; }

            .playlist-overlay {
                position: absolute;
                inset: 0;
                background: inherit;
                border-radius: 15px;
                z-index: 20;
                padding: 20px;
                overflow-y: auto;
            }
            .playlist-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                border-bottom: 1px solid rgba(0,0,0,0.05);
            }
            .playlist-item:hover { background: rgba(0,0,0,0.05); }
            .playlist-item.active { background: rgba(83, 42, 185, 0.1); }
            .dark .playlist-item.active { background: rgba(99, 102, 241, 0.2); }

            .youtube-badge {
                background: #ff0000;
                color: white;
                font-size: 9px;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: bold;
            }

            /* 🔥 MOBILE RESPONSIVE FIXES */
            @media screen and (max-width: 640px) {
                .player-card {
                    width: 350px;
                    padding: 20px;
                    padding-top: 50px;
                }
                .player-cover {
                    width: 140px; 
                    height: 190px;
                    margin-left: -20px; 
                    margin-top: -10px;
                }
                .player-controls__item {
                    font-size: 26px;
                    width: 45px;
                    height: 45px;
                    margin-bottom: 8px;
                }
                .player-controls {
                    padding-left: 10px;
                }
                .playlist-toggle {
                    top: 15px;
                    left: 20px;
                }
            }
          `}</style>

          <div className="player-card" ref={playerContainerRef}>
            {/* Close Button */}
            <div className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
            </div>

            {/* Playlist Toggle */}
            <div 
                className="absolute top-[15px] left-[20px] text-[#acb8cc] hover:text-[#532ab9] cursor-pointer z-10 playlist-toggle" 
                onClick={() => setShowPlaylist(!showPlaylist)}
            >
                <ListMusic size={22} />
            </div>

            {showPlaylist ? (
                <div className="playlist-overlay scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    <h3 className="mb-4 text-lg font-bold text-slate-700 dark:text-white">Playlist</h3>
                    {playlist.map((track, idx) => (
                        <div 
                            key={idx} 
                            className={`playlist-item ${currentTrackIndex === idx ? 'active' : ''}`}
                            onClick={() => selectTrack(idx)}
                        >
                            <img src={track.cover} className="object-cover w-10 h-10 rounded" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate text-slate-800 dark:text-white">{track.title}</div>
                                <div className="text-xs truncate text-slate-500 dark:text-slate-400">{track.artist}</div>
                            </div>
                            {track.type === 'youtube' && (
                                <span className="youtube-badge">YT</span>
                            )}
                            {currentTrackIndex === idx && isPlaying && (
                                <div className="w-2 h-2 bg-[#532ab9] rounded-full animate-pulse"></div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="player__top">
                        <div className="player-cover">
                            <div 
                                className="player-cover__item" 
                                style={{ backgroundImage: `url(${currentTrack.cover})` }}
                            ></div>
                        </div>
                        
                        <div className="player-controls">
                            <div 
                                className={`player-controls__item -favorite ${isFavorite ? 'active' : ''}`} 
                                onClick={() => setIsFavorite(!isFavorite)}
                            >
                                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                            </div>
                            
                            <a 
                                href={isYoutube ? `https://www.youtube.com/watch?v=${currentTrack.youtubeId}` : '#'} 
                                target={isYoutube ? "_blank" : "_self"}
                                className="player-controls__item"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink size={20} />
                            </a>
                            
                            <div className="player-controls__item" onClick={handlePrev}>
                                <SkipBack size={20} fill="currentColor" />
                            </div>
                            
                            <div className="player-controls__item" onClick={handleNext}>
                                <SkipForward size={20} fill="currentColor" />
                            </div>
                            
                            <div className="player-controls__item -xl" onClick={togglePlay}>
                                {isPlaying ? (
                                    <Pause size={30} fill="#532ab9" className="text-[#532ab9] dark:text-[#818cf8]" />
                                ) : (
                                    <Play size={30} fill="#532ab9" className="text-[#532ab9] dark:text-[#818cf8] ml-1" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="progress" ref={progressRef}>
                        <div className="progress__top">
                            <div className="album-info">
                                <div className="album-info__name">{currentTrack.title}</div>
                                <div className="album-info__track">{currentTrack.artist}</div>
                            </div>
                            <div className="progress__duration">{duration}</div>
                        </div>
                        
                        <div className="progress__bar" onClick={clickProgress}>
                            <div className="progress__current" style={{ width: barWidth }}></div>
                        </div>
                        
                        <div className="progress__time">{currentTime}</div>
                    </div>
                </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default MusicPlayer;