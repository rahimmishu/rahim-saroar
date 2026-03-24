import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Heart, 
  ExternalLink, X, ListMusic, Volume2, VolumeX,
  Shuffle, Repeat, Repeat1, RotateCcw, RotateCw
} from 'lucide-react';
import { useCloudStateDebounced } from '../../hooks/useCloudState';

interface MusicPlayerProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

// 🎵 Track Type - Local or YouTube
interface Track {
  title: string;
  artist: string;
  cover: string;
  type: 'local' | 'youtube';
  src?: string;
  youtubeId?: string;
  category: 'songs' | 'ghosts' | 'gojol';
}

type FolderType = 'songs' | 'ghosts' | 'gojol';

type RepeatMode = 'off' | 'all' | 'one';

// 💾 Cloud-persistent state type
interface CloudMusicState {
  currentTrackIndex: number;
  volume: number;
  isMuted: boolean;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  activeFolder: FolderType;
  savedPosition: number; // YouTube position in seconds — resume এর জন্য
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, togglePlay }) => {
  // ── UI-only state (cloud এ save করার দরকার নেই) ──
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [barWidth, setBarWidth] = useState("0%");
  const [isFavorite, setIsFavorite] = useState(false);
  const [youtubeReady, setYoutubeReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [playHistory, setPlayHistory] = useState<number[]>([]);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const hasResumed = useRef(false); // একবারই resume করার জন্য

  // ☁️ Cloud-persistent state — user ফিরে আসলে এখান থেকে resume হবে
  const [cloudState, setCloudState, isSynced] = useCloudStateDebounced<CloudMusicState>(
    'music_player',
    {
      currentTrackIndex: 0,
      volume: 70,
      isMuted: false,
      shuffleMode: false,
      repeatMode: 'off',
      activeFolder: 'songs',
      savedPosition: 0,
    },
    5000 // ৫ সেকেন্ড debounce — API overuse হবে না
  );

  // Destructure for clean usage — existing code এ কোনো পরিবর্তন লাগবে না
  const { currentTrackIndex, volume, isMuted, shuffleMode, repeatMode, activeFolder } = cloudState;

  // Wrapper setters — original code এর মতোই call করা যাবে
  const setCurrentTrackIndex = (index: number | ((prev: number) => number)) => {
    setCloudState(prev => ({
      ...prev,
      currentTrackIndex: typeof index === 'function' ? index(prev.currentTrackIndex) : index,
      savedPosition: 0, // নতুন track এ position reset
    }));
  };
  const setVolume = (v: number) => setCloudState(prev => ({ ...prev, volume: v }));
  const setIsMuted = (m: boolean | ((prev: boolean) => boolean)) =>
    setCloudState(prev => ({ ...prev, isMuted: typeof m === 'function' ? m(prev.isMuted) : m }));
  const setShuffleMode = (s: boolean | ((prev: boolean) => boolean)) =>
    setCloudState(prev => ({ ...prev, shuffleMode: typeof s === 'function' ? s(prev.shuffleMode) : s }));
  const setRepeatMode = (r: RepeatMode | ((prev: RepeatMode) => RepeatMode)) =>
    setCloudState(prev => ({ ...prev, repeatMode: typeof r === 'function' ? r(prev.repeatMode) : r }));
  const setActiveFolder = (f: FolderType) => setCloudState(prev => ({ ...prev, activeFolder: f }));

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  // 🔥 Complete Playlist
  const playlist: Track[] = [
    // ──────────────── 🎵 SONGS ────────────────
    { title: "Airtel X Bhoot FM", artist: "Rahim Saroar", type: 'youtube',youtubeId: "-mrYeA_G9QA", cover: "https://img.youtube.com/vi/-mrYeA_G9QA/maxresdefault.jpg", category: 'songs' },
    { title: "Airtel Phonk 3D", artist: "Rahim Saroar", type: 'youtube', youtubeId: "3pqQrvoj7DY", cover: "https://img.youtube.com/vi/3pqQrvoj7DY/maxresdefault.jpg", category: 'songs' },
    { title: "Barbaad", artist: "Jubin Nautiyal", type: 'youtube', youtubeId: "k_L9ppnuNnY", cover: "https://img.youtube.com/vi/k_L9ppnuNnY/maxresdefault.jpg", category: 'songs' },
    { title: "Saiyaara", artist: "Faheem Abdullah", type: 'youtube', youtubeId: "asG7cwxi1sA", cover: "https://img.youtube.com/vi/asG7cwxi1sA/maxresdefault.jpg", category: 'songs' },
    { title: "Chale Aana", artist: "Arman Malik", type: 'youtube', youtubeId: "5AZld1nu5Yg", cover: "https://img.youtube.com/vi/5AZld1nu5Yg/maxresdefault.jpg", category: 'songs' },
    { title: "Ek Mulaqat", artist: "Altamash Faridi", type: 'youtube', youtubeId: "guP-Ic_8C9w", cover: "https://img.youtube.com/vi/guP-Ic_8C9w/maxresdefault.jpg", category: 'songs' },
    { title: "Fakira", artist: "Timir Biswas", type: 'youtube', youtubeId: "u7ausTLgMjY", cover: "https://img.youtube.com/vi/u7ausTLgMjY/maxresdefault.jpg", category: 'songs' },
    { title: "Salamat", artist: "Arijit Singh", type: 'youtube', youtubeId: "xhczjhFxhDg", cover: "https://img.youtube.com/vi/xhczjhFxhDg/maxresdefault.jpg", category: 'songs' },
    { title: "Sanam Re", artist: "Arijit Singh", type: 'youtube', youtubeId: "D7ZkekFRUmo", cover: "https://img.youtube.com/vi/D7ZkekFRUmo/maxresdefault.jpg", category: 'songs' },
    { title: "Ishq", artist: "Faheem Abdullah", type: 'youtube', youtubeId: "gKD1AhmpOoU", cover: "https://img.youtube.com/vi/IJeSR-LJBnk/maxresdefault.jpg", category: 'songs' },
    { title: "Jisko Jovi Milta Hai", artist: "Manisha Sharma", type: 'youtube', youtubeId: "q0wCFUH7WXU", cover: "https://img.youtube.com/vi/q0wCFUH7WXU/maxresdefault.jpg", category: 'songs' },
    { title: "Teri Nazron Ka Dil", artist: "Faheem Abdullah", type: 'youtube', youtubeId: "C3njz8sf4aM", cover: "https://img.youtube.com/vi/C3njz8sf4aM/maxresdefault.jpg", category: 'songs' },
    { title: "Dhun", artist: "Arijit Singh", type: 'youtube', youtubeId: "zprEnjrSD2E", cover: "https://img.youtube.com/vi/xH4daEJvaZY/maxresdefault.jpg", category: 'songs' },
    { title: "Khola Janala", artist: "Faheem Abdullah", type: 'youtube', youtubeId: "bzsWmfFCqQk", cover: "https://img.youtube.com/vi/EsyEgt7riYE/maxresdefault.jpg", category: 'songs' },
    { title: "Pal Pal", artist: "Rahim Saroar", type: 'youtube', youtubeId: "ZeWbaSXrHus", cover: "https://img.youtube.com/vi/ZeWbaSXrHus/maxresdefault.jpg", category: 'songs' },
    { title: "Pal Pal X Talwinder", artist: "Rahim Saroar", type: 'youtube', youtubeId: "3_136AnE6YE", cover: "https://img.youtube.com/vi/3_136AnE6YE/maxresdefault.jpg", category: 'songs' },
    { title: "Tomar Chokhe Alash Amar", artist: "Arfin Rumey", type: 'youtube', youtubeId: "XWt48T5mwXk", cover: "https://img.youtube.com/vi/XWt48T5mwXk/maxresdefault.jpg", category: 'songs' },
    { title: "Sahiba", artist: "Adrita Rikhari", type: 'youtube',youtubeId: "_eTShi_wzQU", cover: "https://img.youtube.com/vi/_eTShi_wzQU/maxresdefault.jpg", category: 'songs' },
    { title: "Shunno", artist: "Tanveer Evan", type: 'youtube', youtubeId: "xeMciJSSYf8", cover: "https://img.youtube.com/vi/xeMciJSSYf8/maxresdefault.jpg", category: 'songs' },
    { title: "Sun Saathiya", artist:"Priya Saraiya ", type:'youtube', youtubeId:"WIjra2HHRFM", cover:"https://img.youtube.com/vi/WIjra2HHRFM/maxresdefault.jpg", category: 'songs'},
    { title: "Zaalima", artist: "Shah Rukh Khan", type: 'youtube', youtubeId: "Gxvh8x_bHDs", cover: "https://img.youtube.com/vi/Gxvh8x_bHDs/maxresdefault.jpg", category: 'songs' },
    { title: "Dharia", artist: "Sugar", type: 'youtube', youtubeId: "X-cQSTPie14", cover: "https://img.youtube.com/vi/S0Xn1Nlxue8/maxresdefault.jpg", category: 'songs' },
    { title: "Jhol", artist: "Annural Khalid", type: 'youtube', youtubeId: "0fB0gr_M7Pw", cover: "https://img.youtube.com/vi/0fB0gr_M7Pw/maxresdefault.jpg", category: 'songs' },
    { title: "Lo Safar", artist: "Rahim Saroar", type: 'youtube', youtubeId: "LCWrDvUr7mE", cover: "https://img.youtube.com/vi/jcV7i0WM9jU/maxresdefault.jpg", category: 'songs' },
    { title: "Tum Hi Aana", artist: "Ranveer Singh", type: 'youtube', youtubeId: "_StxqkgwBiQ", cover: "https://img.youtube.com/vi/_StxqkgwBiQ/maxresdefault.jpg", category: 'songs' },
    { title: "Gulabi Aankhon", artist: "Sanam Pur", type: 'youtube', youtubeId: "hgi2MYAFgE8", cover: "https://img.youtube.com/vi/hgi2MYAFgE8/maxresdefault.jpg", category: 'songs' },
    { title: "Main Agar Kahoon", artist: "Shahrukh Khan", type: 'youtube', youtubeId: "DAYszemgPxc", cover: "https://img.youtube.com/vi/DAYszemgPxc/maxresdefault.jpg", category: 'songs' },
    { title: "Hamqadam", artist: "Shrey Singhal", type: 'youtube', youtubeId: "rS3dghN1P3I", cover: "https://img.youtube.com/vi/rS3dghN1P3I/maxresdefault.jpg", category: 'songs' },
    { title: "Khairiyat", artist: "Arijit Singh", type: 'youtube', youtubeId: "hoNb6HuNmU0", cover: "https://img.youtube.com/vi/hoNb6HuNmU0/maxresdefault.jpg", category: 'songs' },
    { title: "Mere Mehboob Qayamat Hogi", artist: "Kishore Kumar", type: 'youtube', youtubeId: "M6Ul3ASaFLU", cover: "https://img.youtube.com/vi/M6Ul3ASaFLU/maxresdefault.jpg", category: 'songs' },
    { title: "Zara Zara Bahekta Hai", artist: "JalRaj (Jalaj)", type: 'youtube', youtubeId: "NeXbmEnpSz0", cover: "https://img.youtube.com/vi/NeXbmEnpSz0/maxresdefault.jpg", category: 'songs' },
    { title: "Ek Mulaqat", artist: "Jubin Nautiyal", type: 'youtube', youtubeId: "_qrxVjvVp4M", cover: "https://img.youtube.com/vi/_qrxVjvVp4M/maxresdefault.jpg", category: 'songs' },
    { title: "Sanam ree", artist: "Arijit Singh", type: 'youtube', youtubeId: "rRKAJ6tLBSw", cover: "https://img.youtube.com/vi/rRKAJ6tLBSw/maxresdefault.jpg", category: 'songs' },
    { title: "Kesariya", artist: "Arijit Singh", type: 'youtube', youtubeId: "Dkk9gvTmCXY", cover: "https://img.youtube.com/vi/Dkk9gvTmCXY/maxresdefault.jpg", category: 'songs' },
    { title: "Dil Sambhal Jaa Zara", artist: "Parwan Khan", type: 'youtube', youtubeId: "uHbKAnli9DE", cover: "https://img.youtube.com/vi/uHbKAnli9DE/maxresdefault.jpg", category: 'songs' },
    { title: "Dil Ka Jo Haal Hai", artist: "Arijit Singh", type: 'youtube', youtubeId: "udgrClXV26Y", cover: "https://img.youtube.com/vi/udgrClXV26Y/maxresdefault.jpg", category: 'songs' },
    { title: "Mann Meera", artist: "Arijit Singh", type: 'youtube', youtubeId: "HP2zqQsrsyg", cover: "https://img.youtube.com/vi/HP2zqQsrsyg/maxresdefault.jpg", category: 'songs' },
    { title: "Falak Tak Chal Sath Mere", artist: "Arijit Singh", type: 'youtube', youtubeId: "0pOq8ag0Z0Y", cover: "https://img.youtube.com/vi/0pOq8ag0Z0Y/maxresdefault.jpg", category: 'songs' },
    { title: "Haule Haule", artist: "Sharukh Khan", type: 'youtube', youtubeId: "XgdY_s1LsZc", cover: "https://img.youtube.com/vi/XgdY_s1LsZc/maxresdefault.jpg", category: 'songs' },
    { title: "Dekhte Dekhte", artist: "Arijit Singh", type: 'youtube', youtubeId: "eZHaumDApl0", cover: "https://img.youtube.com/vi/eZHaumDApl0/maxresdefault.jpg", category: 'songs' },
    { title: "Wajah Tum Ho", artist: "Arijit Singh", type: 'youtube', youtubeId: "hk5IqAhOrnY", cover: "https://img.youtube.com/vi/hk5IqAhOrnY/maxresdefault.jpg", category: 'songs' },
    { title: "Uska Hi Banana", artist: "Arijit Singh", type: 'youtube', youtubeId: "q-RP99S_qK0", cover: "https://img.youtube.com/vi/q-RP99S_qK0/maxresdefault.jpg", category: 'songs' },
    { title: "Banjaara", artist: "Arijit Singh", type: 'youtube', youtubeId: "0NFxcNheoLc", cover: "https://img.youtube.com/vi/0NFxcNheoLc/maxresdefault.jpg", category: 'songs' },
    { title: "Pehle Bhi Main", artist: "Arijit Singh", type: 'youtube', youtubeId: "kZGpkkfk2lA", cover: "https://img.youtube.com/vi/kZGpkkfk2lA/maxresdefault.jpg", category: 'songs' },
    { title: "Tu Hi Hai Aashiqui Male Version", artist: "Arijit Singh", type: 'youtube', youtubeId: "GDyiNKZuQYs", cover: "https://img.youtube.com/vi/GDyiNKZuQYs/maxresdefault.jpg", category: 'songs' },
    { title: "Tere liye", artist: "Arijit Singh", type: 'youtube', youtubeId: "G3fsvJ95wHg", cover: "https://img.youtube.com/vi/G3fsvJ95wHg/maxresdefault.jpg", category: 'songs' },
    { title: "Labon Ko", artist: "Arijit Singh", type: 'youtube', youtubeId: "3OYrJWVx7F0", cover: "https://img.youtube.com/vi/3OYrJWVx7F0/maxresdefault.jpg", category: 'songs' },
    { title: "Fallin for you", artist: "Arijit Singh", type: 'youtube', youtubeId: "sVzKavzIKDI", cover: "https://img.youtube.com/vi/sVzKavzIKDI/maxresdefault.jpg", category: 'songs' },
    { title: "Pasoori", artist: "Coke Studio", type: 'youtube', youtubeId: "5Eqb_-j3FDA", cover: "https://img.youtube.com/vi/5Eqb_-j3FDA/maxresdefault.jpg", category: 'songs' },
    { title: "Teri Meri Kahaani", artist: "Arijit Singh", type: 'youtube', youtubeId: "cB_waHMBtn0", cover: "https://img.youtube.com/vi/cB_waHMBtn0/maxresdefault.jpg", category: 'songs' },
    { title: "Aye khuda", artist: "Arijit Singh", type: 'youtube', youtubeId: "HGfc06RZyjQ", cover: "https://img.youtube.com/vi/HGfc06RZyjQ/maxresdefault.jpg", category: 'songs' },
    { title: "Ae Dil Hai Mushki", artist: "Arijit Singh", type: 'youtube', youtubeId: "vrqFJ-yjkRw", cover: "https://img.youtube.com/vi/vrqFJ-yjkRw/maxresdefault.jpg", category: 'songs' },
    { title: "Dil Mein Chhupa Loonga", artist: "Arijit Singh", type: 'youtube', youtubeId: "qUvPzjSWMSM", cover: "https://img.youtube.com/vi/qUvPzjSWMSM/maxresdefault.jpg", category: 'songs' },
    { title: "Dhun X Baarish - Mashup", artist: "Arijit Singh", type: 'youtube', youtubeId: "kvLKeqOswEg", cover: "https://img.youtube.com/vi/kvLKeqOswEg/maxresdefault.jpg", category: 'songs' },
    { title: "Hale Dil", artist: "Emran Hashmi", type: 'youtube', youtubeId: "acdKE2hja7w", cover: "https://img.youtube.com/vi/acdKE2hja7w/maxresdefault.jpg", category: 'songs' },
    { title: "Chand Sifarish", artist: "Arijit Singh", type: 'youtube', youtubeId: "zWEOx7TSM6I", cover: "https://img.youtube.com/vi/zWEOx7TSM6I/maxresdefault.jpg", category: 'songs' },
    { title: "Ek din meri bahoo me", artist: "Ranveer Singh", type: 'youtube', youtubeId: "Gf3NhIkdfRs", cover: "https://img.youtube.com/vi/Gf3NhIkdfRs/maxresdefault.jpg", category: 'songs' },
    { title: "Ki Nesha", artist: "Arijit Singh", type: 'youtube', youtubeId: "ArpxYeFTnws", cover: "https://img.youtube.com/vi/ArpxYeFTnws/maxresdefault.jpg", category: 'songs' },
    { title: "Milne Hai Mujhse Aayi - Lofi", artist: "Arijit Singh", type: 'youtube', youtubeId: "rTvVuLoOq0I", cover: "https://img.youtube.com/vi/rTvVuLoOq0I/maxresdefault.jpg", category: 'songs' },
    { title: "Jo Tum Mere Ho (Slowed + Reverb)", artist: "Anuv Jain", type: 'youtube', youtubeId: "uK7Ovgs44Uk", cover: "https://img.youtube.com/vi/uK7Ovgs44Uk/maxresdefault.jpg", category: 'songs' },
    { title: "O Mere Dil Ke Chain", artist: "Sanam", type: 'youtube', youtubeId: "o9F7oUgmyg0", cover: "https://img.youtube.com/vi/o9F7oUgmyg0/maxresdefault.jpg", category: 'songs' },
    { title: "Bekhayali", artist: "Arijit Singh", type: 'youtube', youtubeId: "Ps4aVpIESkc", cover: "https://img.youtube.com/vi/Ps4aVpIESkc/maxresdefault.jpg", category: 'songs' },
    { title: "Lut Gaye", artist: "Emran Hashmi", type: 'youtube', youtubeId: "sCbbMZ-q4-I", cover: "https://img.youtube.com/vi/sCbbMZ-q4-I/maxresdefault.jpg", category: 'songs' },
    { title: "Suno Na Sangemarmar", artist: "Ranveer Singh", type: 'youtube', youtubeId: "v7jiFpX5SU4", cover: "https://img.youtube.com/vi/v7jiFpX5SU4/maxresdefault.jpg", category: 'songs' },
    { title: "Jeene Laga Hoon", artist: "Arijit Singh", type: 'youtube', youtubeId: "qpIdoaaPa6U", cover: "https://img.youtube.com/vi/qpIdoaaPa6U/maxresdefault.jpg", category: 'songs' },
    { title: "Janam Janam", artist: "Shahrukh Khan", type: 'youtube', youtubeId: "pIBoAh4OXhQ", cover: "https://img.youtube.com/vi/pIBoAh4OXhQ/maxresdefault.jpg", category: 'songs' },
    { title: "Yeh Raaten Yeh Mausam", artist: "Arijit Singh", type: 'youtube', youtubeId: "4HRC6c5-2lQ", cover: "https://img.youtube.com/vi/4HRC6c5-2lQ/maxresdefault.jpg", category: 'songs' },
    { title: "Bom Diggy Diggy", artist: "Sunny", type: 'youtube', youtubeId: "U4K9guxEix4", cover: "https://img.youtube.com/vi/U4K9guxEix4/maxresdefault.jpg", category: 'songs' },
    { title: "Nashe Si Chadh Gayi", artist: "Ranveer Singh", type: 'youtube', youtubeId: "Wd2B8OAotU8", cover: "https://img.youtube.com/vi/Wd2B8OAotU8/maxresdefault.jpg", category: 'songs' },

    // ──────────────── 👻 BHOOT ER GOLPO ────────────────
    // ⚠️ নিচের youtubeId গুলো তোমার পছন্দের Bhoot FM / ভূতের গল্পের YouTube video ID দিয়ে replace করো
    { title: "Bhoot.com - আফ্রিকার এই অভিশপ্ত ভবন এক অন্য পৃথিবী", artist: "RJ Russell", type: 'youtube', youtubeId: "0qdXKb7-dEk", cover: "https://img.youtube.com/vi/0qdXKb7-dEk/maxresdefault.jpg", category: 'ghosts' },
    { title: "Bhoot.com - কানকুরং (আত্মাবন্দি জাদু পর্ব ২)", artist: "RJ Russell", type: 'youtube', youtubeId: "YZZa7LuP0ko", cover: "https://img.youtube.com/vi/YZZa7LuP0ko/maxresdefault.jpg", category: 'ghosts' },
    { title: "Bhoot.com - ঘোড়াখাং", artist: "RJ Russell", type: 'youtube', youtubeId: "lensL6CzsT0", cover: "https://img.youtube.com/vi/lensL6CzsT0/maxresdefault.jpg", category: 'ghosts' },
    { title: "Bhoot.com - টুকু কবিরাজ", artist: "RJ Russell", type: 'youtube', youtubeId: "IzaAqjtqs-0", cover: "https://img.youtube.com/vi/IzaAqjtqs-0/maxresdefault.jpg", category: 'ghosts' },
    { title: "Bhoot.com - প্রেত কুয়া (সুকান্ত মাইতি)", artist: "RJ Russell", type: 'youtube', youtubeId: "TabyySgySvw", cover: "https://img.youtube.com/vi/TabyySgySvw/maxresdefault.jpg", category: 'ghosts' },
    { title: "Bhoot.com - ভয়ঙ্কর নৌকা যাত্রা", artist: "RJ Russell", type: 'youtube', youtubeId: "TabyySgySvw", cover: "https://img.youtube.com/vi/TabyySgySvw/maxresdefault.jpg", category: 'ghosts' },
    { title: "Bhoot.com - কবর বন্দি জ্বীন", artist: "RJ Russell", type: 'youtube', youtubeId: "lioJ9PxQXlw", cover: "https://img.youtube.com/vi/lioJ9PxQXlw/maxresdefault.jpg", category: 'ghosts' },
    { title: "Bhoot.com - Phire ase sayatan", artist: "RJ Russell", type: 'youtube', youtubeId: "u9Ni5VdIXhc", cover: "https://img.youtube.com/vi/u9Ni5VdIXhc/maxresdefault.jpg", category: 'ghosts' },
    { title: "Bhoot.com - জ্বিন সেফাতাজ", artist: "RJ Russell", type: 'youtube', youtubeId: "NCKhxSNiqPU", cover: "https://img.youtube.com/vi/NCKhxSNiqPU/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - সর্প পিশাচিনী!", artist: "Afnan Vai", type: 'youtube', youtubeId: "oqlQQN7c1J4", cover: "https://img.youtube.com/vi/oqlQQN7c1J4/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - আলাউদ্দিন কবিরাজ!!", artist: "Afnan Vai", type: 'youtube', youtubeId: "zgnyb7xgsus", cover: "https://img.youtube.com/vi/zgnyb7xgsus/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - অভিরাম তান্ত্রিক!!", artist: "Afnan Vai", type: 'youtube', youtubeId: "TNU-iRSgf7w", cover: "https://img.youtube.com/vi/TNU-iRSgf7w/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - ফোলের বিল!!", artist: "Afnan Vai", type: 'youtube', youtubeId: "2ytSeniNgQs", cover: "https://img.youtube.com/vi/2ytSeniNgQs/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - নাহুদ ফেদালা!!", artist: "Afnan Vai", type: 'youtube', youtubeId: "wyngYNzjBrE", cover: "https://img.youtube.com/vi/wyngYNzjBrE/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - ভেলাদ কাফ্রিয়ান!!", artist: "Afnan Vai", type: 'youtube', youtubeId: "9u0UBIyI7NQ", cover: "https://img.youtube.com/vi/SpCbK1reW1I/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - ইছাসা!!", artist: "Afnan Vai", type: 'youtube', youtubeId: "RQ-ta3Bo7zs", cover: "https://img.youtube.com/vi/RQ-ta3Bo7zs/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - ইয়াসার বড় পুকুরের রাক্ষস", artist: "Afnan Vai", type: 'youtube', youtubeId: "9c5fO8hB8Yc", cover: "https://img.youtube.com/vi/9c5fO8hB8Yc/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - আরারাত", artist: "Afnan Vai", type: 'youtube', youtubeId: "EizP8qRmgsw", cover: "https://img.youtube.com/vi/EizP8qRmgsw/maxresdefault.jpg", category: 'ghosts' },
    { title: "Afnan The Horror World - সেমহুরেশ ", artist: "Afnan Vai", type: 'youtube', youtubeId: "HFJ9XacTcdA", cover: "https://img.youtube.com/vi/HFJ9XacTcdA/maxresdefault.jpg", category: 'ghosts' },
    
    // ──────────────── 🕌 GOJOL (Islamic Devotional Songs) ────────────────
    { title: "The Way of The Tears", artist: "Muhammad al Muqit", type: 'youtube', youtubeId: "YiSQ_db-Dcw", cover: "https://img.youtube.com/vi/YiSQ_db-Dcw/maxresdefault.jpg", category: 'gojol' },
    { title: "The Beauty of Existence", artist: "Muhammad al Muqit", type: 'youtube', youtubeId: "NrsCej6SVxM", cover: "https://img.youtube.com/vi/NrsCej6SVxM/maxresdefault.jpg", category: 'gojol' },
    { title: "Wedding Nasheed ", artist: "Muhammad al Muqit", type: 'youtube', youtubeId: "ivrumxRUz_Y", cover: "https://img.youtube.com/vi/ivrumxRUz_Y/maxresdefault.jpg", category: 'gojol' },
    { title: "Assubhu Bada", artist: "Kalarab", type: 'youtube', youtubeId: "rpQFuuoAxTc", cover: "https://img.youtube.com/vi/rpQFuuoAxTc/maxresdefault.jpg", category: 'gojol' },
    { title: "Muhammed Nabina", artist: "Sami Yusuf", type: 'youtube', youtubeId: "xthIEcrbM8A", cover: "https://img.youtube.com/vi/8-NbT05VykQ/maxresdefault.jpg", category: 'gojol' },
    { title: "Rahman Ya Rahman", artist: "Mishary Rashid Alafasy", type: 'youtube', youtubeId: "Exh3tHQLHWE", cover: "https://img.youtube.com/vi/Exh3tHQLHWE/maxresdefault.jpg", category: 'gojol' },
    { title: "হাদির জিন্দাবাদ", artist: "Abu Ubayda", type: 'youtube', youtubeId: "oNtZnaocEkQ", cover: "https://img.youtube.com/vi/oNtZnaocEkQ/maxresdefault.jpg", category: 'gojol' },
    { title: "O Nodire", artist: "Tune Hut", type: 'youtube', youtubeId: "Aj1wu1L5glA", cover: "https://img.youtube.com/vi/Aj1wu1L5glA/maxresdefault.jpg", category: 'gojol' },
    { title: "Maula Ya Salli", artist: "Sami Yusuf", type: 'youtube', youtubeId: "40nEFfCzb0U", cover: "https://img.youtube.com/vi/40nEFfCzb0U/maxresdefault.jpg", category: 'gojol' },
    { title: "My Hope (Allah)", artist: "Muhammad al Muqit", type: 'youtube', youtubeId: "slkyMimmb1M", cover: "https://img.youtube.com/vi/slkyMimmb1M/maxresdefault.jpg", category: 'gojol' },
    { title: "My Favourite Nasheed", artist: "Muhammad al Muqit", type: 'youtube', youtubeId: "_MKfJzqTi4U", cover: "https://img.youtube.com/vi/_MKfJzqTi4U/maxresdefault.jpg", category: 'gojol' },
    { title: "Liyakun Yawmuka", artist: "Harris J", type: 'youtube', youtubeId: "mawJQfplpnk", cover: "https://img.youtube.com/vi/mawJQfplpnk/maxresdefault.jpg", category: 'gojol' },
    { title: "asheed Ya Adheeman", artist: "Ahmed Bukhatir", type: 'youtube', youtubeId: "71hi9H6fZuc", cover: "https://img.youtube.com/vi/71hi9H6fZuc/maxresdefault.jpg", category: 'gojol' },
    { title: "Allahu (Heart Touching Nasheed)", artist: "Harris J", type: 'youtube', youtubeId: "m_tjxz4yS_U", cover: "https://img.youtube.com/vi/m_tjxz4yS_U/maxresdefault.jpg", category: 'gojol' },
    { title: "Rahmatun Lil Alameen", artist: "Maher Zain", type: 'youtube', youtubeId: "tBbdSzwxqyY", cover: "https://img.youtube.com/vi/tBbdSzwxqyY/maxresdefault.jpg", category: 'gojol' },
    { title: "Kun Anta", artist: "Humood", type: 'youtube', youtubeId: "qKVW_wJs91Q", cover: "https://img.youtube.com/vi/qKVW_wJs91Q/maxresdefault.jpg", category: 'gojol' },
    { title: "Hasbi Rabbi", artist: "Sami Yusuf", type: 'youtube', youtubeId: "7jMNpnQel74", cover: "https://img.youtube.com/vi/7jMNpnQel74/maxresdefault.jpg", category: 'gojol' },
    { title: "Ya Quluban", artist: "Abdullah Al Sinani", type: 'youtube', youtubeId: "5HefSO_hboQ", cover: "https://img.youtube.com/vi/5HefSO_hboQ/maxresdefault.jpg", category: 'gojol' },
    { title: "Beloved Naasheds", artist: "Rahatul Islam", type: 'youtube', youtubeId: "pbbyCOZgH-A", cover: "https://img.youtube.com/vi/pbbyCOZgH-A/maxresdefault.jpg", category: 'gojol' },
    { title: "Tasbih", artist: "Ayisha Abdul Basith", type: 'youtube', youtubeId: "IKRJAIcdock", cover: "https://img.youtube.com/vi/IKRJAIcdock/maxresdefault.jpg", category: 'gojol' },
    { title: "Meherban Tumi Meherban", artist: "Munaem Billah", type: 'youtube', youtubeId: "PqJlOhR_aNc", cover: "https://img.youtube.com/vi/PqJlOhR_aNc/maxresdefault.jpg", category: 'gojol' },
    { title: "হৃদয় মাঝে মালা গাঁথি", artist: "Holy Tune", type: 'youtube', youtubeId: "QyRRrKQP7fo", cover: "https://img.youtube.com/vi/QyRRrKQP7fo/maxresdefault.jpg", category: 'gojol' },
    { title: "Hridoyer Rojonigondha", artist: "Hossain Adnan", type: 'youtube', youtubeId: "H1nPe60uPYw", cover: "https://img.youtube.com/vi/H1nPe60uPYw/maxresdefault.jpg", category: 'gojol' },
    { title: "এলো মাহে রমজান", artist: "Holy Tune", type: 'youtube', youtubeId: "UrC50KP_08o", cover: "https://img.youtube.com/vi/UrC50KP_08o/maxresdefault.jpg", category: 'gojol' },
    { title: "ওগো মা", artist: "Tune Hut", type: 'youtube', youtubeId: "HrYleYeY_8U", cover: "https://img.youtube.com/vi/HrYleYeY_8U/maxresdefault.jpg", category: 'gojol' },
    { title: "Ami Dekhini Tomay", artist: "Holy Tune", type: 'youtube', youtubeId: "lIQNPWskjuk", cover: "https://img.youtube.com/vi/lIQNPWskjuk/maxresdefault.jpg", category: 'gojol' },
    ];

  const currentTrack = playlist[currentTrackIndex];
  const isYoutube = currentTrack?.type === 'youtube';
  const isGhostStory = currentTrack?.category === 'ghosts';

  // 📂 Folder filtered view
  const filteredPlaylist = playlist
    .map((track, globalIdx) => ({ track, globalIdx }))
    .filter(({ track }) => track.category === activeFolder);

  // 🔁 Cloud sync হলে last saved position এ resume করো (একবারই)
  useEffect(() => {
    if (!isSynced || hasResumed.current) return;
    if (cloudState.savedPosition > 5 && playerReady && youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.seekTo(cloudState.savedPosition, true);
        console.log(`[MusicPlayer] Resumed from ${Math.floor(cloudState.savedPosition)}s`);
      } catch (e) {
        // Silent fail
      }
      hasResumed.current = true;
    }
  }, [isSynced, playerReady]);

  // 🎬 Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setYoutubeReady(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (existingScript) return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      setYoutubeReady(true);
    };
  }, []);

  // 🎵 Initialize YouTube Player - FIXED VERSION
  useEffect(() => {
    if (!youtubeReady || !isYoutube || !currentTrack.youtubeId) return;

    const initTimeout = setTimeout(() => {
      try {
        if (youtubePlayerRef.current) {
          youtubePlayerRef.current.destroy();
          youtubePlayerRef.current = null;
        }

        setPlayerReady(false);
        setBarWidth("0%");
        setCurrentTime("00:00");

        youtubePlayerRef.current = new window.YT.Player('youtube-player', {
          height: '0',
          width: '0',
          videoId: currentTrack.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              event.target.setVolume(isMuted ? 0 : volume);
              
              // Auto-play if isPlaying OR shouldAutoPlay is true
              if (isPlaying || shouldAutoPlay) {
                setTimeout(() => {
                  event.target.playVideo();
                  if (shouldAutoPlay && !isPlaying) {
                    togglePlay(); // Sync the play state
                  }
                  setShouldAutoPlay(false);
                }, 100);
              }
            },
            onStateChange: (event: any) => {
              // Auto play next when video ends
              if (event.data === 0) {
                handleTrackEnd();
              }
            },
            onError: (event: any) => {
              console.error('YouTube Error:', event.data);
              handleNext(true);
            },
          },
        });
      } catch (error) {
        console.error('Error creating YouTube player:', error);
      }
    }, 100);

    return () => clearTimeout(initTimeout);
  }, [currentTrackIndex, youtubeReady]);

  // 🎵 Play/Pause Control - IMPROVED
  useEffect(() => {
    const attemptPlay = async () => {
      if (isYoutube) {
        if (youtubePlayerRef.current && playerReady) {
          try {
            if (isPlaying) {
              youtubePlayerRef.current.playVideo();
              setIsOpen(true);
            } else {
              youtubePlayerRef.current.pauseVideo();
            }
          } catch (error) {
            console.error('YouTube control error:', error);
          }
        }
      } else {
        if (audioRef.current) {
          try {
            if (isPlaying) {
              await audioRef.current.play();
              setIsOpen(true);
            } else {
              audioRef.current.pause();
            }
          } catch (error) {
            console.error('Audio play error:', error);
          }
        }
      }
    };

    attemptPlay();
  }, [isPlaying, playerReady, isYoutube]);

  // ⏱️ Update Progress Bar
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const updateProgress = () => {
      if (isYoutube && youtubePlayerRef.current && playerReady) {
        try {
          const currentTime = youtubePlayerRef.current.getCurrentTime();
          const duration = youtubePlayerRef.current.getDuration();

          if (duration && duration > 0) {
            const width = (100 / duration) * currentTime;
            setBarWidth(`${width}%`);
            
            const curmin = Math.floor(currentTime / 60);
            const cursec = Math.floor(currentTime - curmin * 60);
            const durmin = Math.floor(duration / 60);
            const dursec = Math.floor(duration - durmin * 60);
            
            setCurrentTime(`${curmin < 10 ? '0' + curmin : curmin}:${cursec < 10 ? '0' + cursec : cursec}`);
            setDuration(`${durmin < 10 ? '0' + durmin : durmin}:${dursec < 10 ? '0' + dursec : dursec}`);
          }
        } catch (error) {
          // Silently ignore
        }
      } else if (!isYoutube && audioRef.current) {
        const audio = audioRef.current;
        if (audio.duration && audio.duration > 0) {
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
      updateProgress();
      intervalRef.current = setInterval(updateProgress, 100);
    }

    // ⏱️ প্রতি 5 সেকেন্ডে YouTube position cloud এ save করো
    let positionSaveInterval: NodeJS.Timeout | null = null;
    if (isPlaying && isYoutube && playerReady) {
      positionSaveInterval = setInterval(() => {
        try {
          if (youtubePlayerRef.current) {
            const pos = youtubePlayerRef.current.getCurrentTime();
            if (pos > 0) {
              setCloudState(prev => ({ ...prev, savedPosition: pos }));
            }
          }
        } catch (_) {}
      }, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (positionSaveInterval) clearInterval(positionSaveInterval);
    };
  }, [isPlaying, isYoutube, playerReady, currentTrackIndex]);

  // 🔄 Local Audio Events
  useEffect(() => {
    if (isYoutube || !audioRef.current) return;

    const handleEnded = () => handleTrackEnd();
    audioRef.current.addEventListener('ended', handleEnded);

    // Auto-play local audio if shouldAutoPlay is set
    if (shouldAutoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        if (!isPlaying) togglePlay();
        setShouldAutoPlay(false);
      }).catch(err => {
        console.error('Auto-play error:', err);
        setShouldAutoPlay(false);
      });
    }

    return () => {
      audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isYoutube, repeatMode, shouldAutoPlay]);

  // 🔊 Volume Control
  useEffect(() => {
    if (isYoutube && youtubePlayerRef.current && playerReady) {
      youtubePlayerRef.current.setVolume(isMuted ? 0 : volume);
    } else if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, isYoutube, playerReady]);

  // 🔀 Shuffle helper
  const getNextShuffleIndex = (): number => {
    const availableIndices = playlist.map((_, i) => i).filter(i => i !== currentTrackIndex);
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  };

  // 🔚 Handle track end
  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      // Replay current track
      if (isYoutube && youtubePlayerRef.current) {
        youtubePlayerRef.current.seekTo(0);
        youtubePlayerRef.current.playVideo();
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all' || currentTrackIndex < playlist.length - 1) {
      handleNext(true);
    } else {
      // End of playlist, stop
      if (!isPlaying) togglePlay();
    }
  };

  // ⏭️ FIXED Next handler
  const handleNext = (autoPlay: boolean = false) => {
    let nextIndex: number;
    
    if (shuffleMode) {
      nextIndex = getNextShuffleIndex();
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }

    setPlayHistory(prev => [...prev, currentTrackIndex]);
    
    // If currently playing, mark that we should continue playing
    if (isPlaying) {
      setShouldAutoPlay(true);
    }
    
    setCurrentTrackIndex(nextIndex);
    
    // If not playing and autoPlay requested, start playback
    if (!isPlaying && autoPlay) {
      setShouldAutoPlay(true);
    }
  };

  // ⏮️ FIXED Previous handler
  const handlePrev = () => {
    let prevIndex: number;
    
    // Go to previous track in history if available
    if (playHistory.length > 0) {
      prevIndex = playHistory[playHistory.length - 1];
      setPlayHistory(prev => prev.slice(0, -1));
    } else {
      prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    }

    // If currently playing, mark that we should continue playing
    if (isPlaying) {
      setShouldAutoPlay(true);
    }
    
    setCurrentTrackIndex(prevIndex);
  };

  // ⏪ Skip 10 seconds backward (for ghost stories)
  const skip10SecondsBack = () => {
    if (isYoutube && youtubePlayerRef.current && playerReady) {
      try {
        const currentTime = youtubePlayerRef.current.getCurrentTime();
        youtubePlayerRef.current.seekTo(Math.max(0, currentTime - 10));
      } catch (error) {
        console.error('Skip back error:', error);
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  // ⏩ Skip 10 seconds forward (for ghost stories)
  const skip10SecondsForward = () => {
    if (isYoutube && youtubePlayerRef.current && playerReady) {
      try {
        const currentTime = youtubePlayerRef.current.getCurrentTime();
        const duration = youtubePlayerRef.current.getDuration();
        youtubePlayerRef.current.seekTo(Math.min(duration, currentTime + 10));
      } catch (error) {
        console.error('Skip forward error:', error);
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    }
  };

  // 🎯 Select track from playlist
  const selectTrack = (index: number) => {
    setPlayHistory(prev => [...prev, currentTrackIndex]);
    setShouldAutoPlay(true); // Always auto-play when selecting from playlist
    setCurrentTrackIndex(index);
    setShowPlaylist(false);
    // Switch folder tab to match selected track's category
    setActiveFolder(playlist[index].category);
  };

  // 📍 Progress bar click
  const clickProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const progress = progressRef.current;
      const position = e.pageX - progress.getBoundingClientRect().left;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) percentage = 100;
      if (percentage < 0) percentage = 0;

      if (isYoutube && youtubePlayerRef.current && playerReady) {
        try {
          const duration = youtubePlayerRef.current.getDuration();
          const seekTime = (duration * percentage) / 100;
          youtubePlayerRef.current.seekTo(seekTime, true);
        } catch (error) {
          console.error('Seek error:', error);
        }
      } else if (audioRef.current) {
        audioRef.current.currentTime = (audioRef.current.duration * percentage) / 100;
      }

      if (!isPlaying) togglePlay();
    }
  };

  // 🔊 Volume control
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeRef.current) {
      const volumeBar = volumeRef.current;
      const position = e.pageX - volumeBar.getBoundingClientRect().left;
      let percentage = (100 * position) / volumeBar.offsetWidth;
      if (percentage > 100) percentage = 100;
      if (percentage < 0) percentage = 0;
      setVolume(Math.round(percentage));
      if (isMuted && percentage > 0) setIsMuted(false);
    }
  };

  // 🔁 Toggle repeat mode
  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  return (
    <>
      {/* Local Audio Player */}
      {!isYoutube && <audio ref={audioRef} src={currentTrack?.src} />}
      
      {/* YouTube Player (Hidden) */}
      <div id="youtube-player" style={{ display: 'none', position: 'absolute', top: -9999 }}></div>

      {/* Main Player Widget */}
      {isOpen && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 md:left-10 md:transform-none z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500 w-full flex justify-center md:block pointer-events-none md:pointer-events-auto">
          
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            /* Base player card - Mobile first (compact) */
            .player-card {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                width: 340px; 
                min-height: 400px;
                box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);
                border-radius: 20px;
                padding: 20px;
                font-family: "Inter", sans-serif;
                position: relative;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                backdrop-filter: blur(10px);
            }
            .dark .player-card {
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
            }
            
            /* Desktop animations and effects */
            @media screen and (min-width: 768px) {
                .player-card {
                    width: 420px;
                    min-height: 500px;
                    padding: 32px;
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .dark .player-card {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
                }
                
                /* Hover effects - Desktop only */
                .player-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.4);
                }
                .dark .player-card:hover {
                    box-shadow: 0 35px 70px -15px rgba(99, 102, 241, 0.3);
                }
                
                /* Playing glow effect - Desktop only */
                .player-card.is-playing {
                    animation: playerGlow 3s ease-in-out infinite;
                }
                @keyframes playerGlow {
                    0%, 100% {
                        box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.2);
                    }
                    50% {
                        box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.4), 
                                    0 0 80px -20px rgba(99, 102, 241, 0.3);
                    }
                }
                .dark .player-card.is-playing {
                    animation: playerGlowDark 3s ease-in-out infinite;
                }
                @keyframes playerGlowDark {
                    0%, 100% {
                        box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.3);
                    }
                    50% {
                        box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.5), 
                                    0 0 100px -20px rgba(99, 102, 241, 0.4);
                    }
                }
            }

            .player__top {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
                position: relative;
                z-index: 4;
            }
            
            @media screen and (min-width: 768px) {
                .player__top {
                    gap: 24px;
                }
            }

            /* Cover - Mobile (compact) */
            .player-cover {
                width: 200px;
                height: 200px;
                flex-shrink: 0;
                position: relative;
                border-radius: 16px;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Cover - Desktop (larger with effects) */
            @media screen and (min-width: 768px) {
                .player-cover {
                    width: 280px;
                    height: 280px;
                    border-radius: 20px;
                }
                
                /* Playing pulse effect - Desktop only */
                .player-cover.is-playing {
                    animation: coverPulse 2s ease-in-out infinite;
                }
                @keyframes coverPulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.02);
                    }
                }
            }

            .player-cover__item {
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                width: 100%;
                height: 100%;
                border-radius: 16px;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            @media screen and (min-width: 768px) {
                .player-cover__item {
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }
            }
            
            .player-cover__item::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
                border-radius: inherit;
            }
            
            .dark .player-cover__item {
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
            }
            
            @media screen and (min-width: 768px) {
                .dark .player-cover__item {
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
                }
                
                /* Desktop hover effect */
                .player-cover:hover .player-cover__item {
                    transform: scale(1.03);
                    box-shadow: 0 25px 50px rgba(99, 102, 241, 0.4);
                }
            }

            /* Removed rotating animation */

            .player-controls {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin-top: 4px;
            }
            
            @media screen and (min-width: 768px) {
                .player-controls {
                    gap: 16px;
                    margin-top: 8px;
                }
            }

            /* Mobile compact buttons */
            .player-controls__item {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: #64748b;
                background: rgba(255, 255, 255, 0.5);
            }
            
            /* Desktop larger buttons with animations */
            @media screen and (min-width: 768px) {
                .player-controls__item {
                    width: 48px;
                    height: 48px;
                }
                
                /* Desktop hover animations */
                .player-controls__item:hover {
                    background: rgba(99, 102, 241, 0.15);
                    color: #6366f1;
                    transform: scale(1.15) translateY(-2px);
                    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
                }
                
                /* Active state animation */
                .player-controls__item:active {
                    transform: scale(0.95);
                }
            }
            
            .dark .player-controls__item {
                background: rgba(255, 255, 255, 0.05);
                color: #94a3b8;
            }
            
            @media screen and (min-width: 768px) {
                .dark .player-controls__item:hover {
                    background: rgba(99, 102, 241, 0.2);
                    color: #818cf8;
                }
            }

            /* Play button - Mobile */
            .player-controls__item.-xl {
                width: 54px;
                height: 54px;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
                box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
            }
            
            /* Play button - Desktop with glow */
            @media screen and (min-width: 768px) {
                .player-controls__item.-xl {
                    width: 64px;
                    height: 64px;
                    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
                }
                
                .player-controls__item.-xl:hover {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    transform: scale(1.2) translateY(-3px);
                    box-shadow: 0 15px 35px rgba(99, 102, 241, 0.5);
                }
                
                /* Playing pulse effect */
                .player-controls__item.-xl.is-playing {
                    animation: playButtonPulse 1.5s ease-in-out infinite;
                }
                @keyframes playButtonPulse {
                    0%, 100% {
                        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
                    }
                    50% {
                        box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5), 
                                    0 0 30px rgba(99, 102, 241, 0.3);
                    }
                }
            }

            .player-controls__item.-favorite.active {
                color: #ef4444;
            }
            .player-controls__item.-shuffle.active,
            .player-controls__item.-repeat.active {
                color: #6366f1;
                background: rgba(99, 102, 241, 0.15);
            }
            .dark .player-controls__item.-shuffle.active,
            .dark .player-controls__item.-repeat.active {
                color: #818cf8;
                background: rgba(99, 102, 241, 0.25);
            }

            /* Skip buttons styling (for -10s and +10s in Bhoot FM) */
            .player-controls__item.-skip {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                padding: 6px;
                transition: all 0.3s ease;
            }
            
            @media screen and (min-width: 768px) {
                .player-controls__item.-skip {
                    padding: 8px;
                }
                .player-controls__item.-skip:hover {
                    transform: scale(1.1);
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 8px;
                }
            }
            
            .player-controls__item.-skip .skip-label {
                font-size: 9px;
                font-weight: 600;
                opacity: 0.8;
                margin-top: -2px;
            }
            
            @media screen and (min-width: 768px) {
                .player-controls__item.-skip .skip-label {
                    font-size: 10px;
                }
            }
            
            .player-controls__item.-skip:active {
                transform: scale(0.95);
            }
            
            @keyframes skipPulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.7;
                }
            }
            
            .player-controls__item.-skip:active svg {
                animation: skipPulse 0.3s ease;
            }

            .progress {
                margin-top: 16px;
            }
            
            @media screen and (min-width: 768px) {
                .progress {
                    margin-top: 24px;
                }
            }

            .progress__top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            @media screen and (min-width: 768px) {
                .progress__top {
                    margin-bottom: 12px;
                }
            }

            .album-info {
                flex: 1;
                min-width: 0;
            }

            .album-info__name {
                font-size: 15px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            @media screen and (min-width: 768px) {
                .album-info__name {
                    font-size: 18px;
                    margin-bottom: 4px;
                }
            }
            
            .dark .album-info__name {
                color: #f1f5f9;
            }

            .album-info__track {
                font-size: 12px;
                color: #64748b;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            @media screen and (min-width: 768px) {
                .album-info__track {
                    font-size: 14px;
                }
            }
            
            .dark .album-info__track {
                color: #94a3b8;
            }

            .progress__duration {
                font-size: 12px;
                font-weight: 600;
                color: #475569;
                margin-left: 12px;
            }
            
            @media screen and (min-width: 768px) {
                .progress__duration {
                    font-size: 14px;
                    margin-left: 16px;
                }
            }
            
            .dark .progress__duration {
                color: #cbd5e1;
            }

            .progress__bar {
                height: 5px;
                background: rgba(100, 116, 139, 0.2);
                border-radius: 3px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: height 0.2s;
            }
            
            @media screen and (min-width: 768px) {
                .progress__bar {
                    height: 6px;
                    border-radius: 4px;
                }
                
                .progress__bar:hover {
                    height: 8px;
                }
            }
            
            .dark .progress__bar {
                background: rgba(148, 163, 184, 0.1);
            }

            .progress__current {
                height: 100%;
                background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
                border-radius: 3px;
                position: relative;
                transition: width 0.1s linear;
            }
            
            @media screen and (min-width: 768px) {
                .progress__current {
                    border-radius: 4px;
                }
                
                /* Desktop glow effect when playing */
                .is-playing .progress__current {
                    animation: progressGlow 2s ease-in-out infinite;
                }
                @keyframes progressGlow {
                    0%, 100% {
                        box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
                    }
                }
            }
            
            .progress__current::after {
                content: '';
                position: absolute;
                right: -2px;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
                opacity: 0;
                transition: opacity 0.2s;
            }
            
            @media screen and (min-width: 768px) {
                .progress__current::after {
                    width: 14px;
                    height: 14px;
                }
                
                .progress__bar:hover .progress__current::after {
                    opacity: 1;
                }
            }

            .progress__time {
                font-size: 11px;
                color: #64748b;
                margin-top: 6px;
                font-weight: 500;
            }
            
            @media screen and (min-width: 768px) {
                .progress__time {
                    font-size: 13px;
                    margin-top: 8px;
                }
            }
            
            .dark .progress__time {
                color: #94a3b8;
            }

            /* Volume Control - Mobile compact */
            .volume-control {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 12px;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 10px;
            }
            
            @media screen and (min-width: 768px) {
                .volume-control {
                    gap: 12px;
                    margin-top: 16px;
                    padding: 12px 16px;
                    border-radius: 12px;
                }
            }
            
            .dark .volume-control {
                background: rgba(255, 255, 255, 0.05);
            }

            .volume-icon {
                cursor: pointer;
                color: #64748b;
                transition: all 0.3s;
            }
            
            @media screen and (min-width: 768px) {
                .volume-icon:hover {
                    color: #6366f1;
                    transform: scale(1.1);
                }
            }
            
            .dark .volume-icon {
                color: #94a3b8;
            }
            .dark .volume-icon:hover {
                color: #818cf8;
            }

            .volume-bar {
                flex: 1;
                height: 4px;
                background: rgba(100, 116, 139, 0.2);
                border-radius: 2px;
                cursor: pointer;
                position: relative;
            }
            .dark .volume-bar {
                background: rgba(148, 163, 184, 0.1);
            }

            .volume-current {
                height: 100%;
                background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
                border-radius: 2px;
                transition: width 0.1s;
            }
            
            @media screen and (min-width: 768px) {
                /* Desktop volume glow */
                .volume-current {
                    box-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
                }
            }

            .volume-percent {
                font-size: 11px;
                font-weight: 600;
                color: #64748b;
                min-width: 32px;
                text-align: right;
            }
            
            @media screen and (min-width: 768px) {
                .volume-percent {
                    font-size: 12px;
                    min-width: 35px;
                }
            }
            
            .dark .volume-percent {
                color: #94a3b8;
            }

            .close-btn {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
                z-index: 10;
                color: #64748b;
            }
            
            @media screen and (min-width: 768px) {
                .close-btn {
                    top: 16px;
                    right: 16px;
                    width: 36px;
                    height: 36px;
                }
                
                .close-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    transform: rotate(90deg) scale(1.1);
                }
            }
            
            .dark .close-btn {
                background: rgba(255, 255, 255, 0.1);
                color: #94a3b8;
            }

            .playlist-toggle {
                position: absolute;
                top: 12px;
                left: 12px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
                z-index: 10;
                color: #64748b;
            }
            
            @media screen and (min-width: 768px) {
                .playlist-toggle {
                    top: 16px;
                    left: 16px;
                    width: 36px;
                    height: 36px;
                }
                
                .playlist-toggle:hover {
                    background: rgba(99, 102, 241, 0.15);
                    color: #6366f1;
                    transform: scale(1.1);
                }
            }
            
            .dark .playlist-toggle {
                background: rgba(255, 255, 255, 0.1);
                color: #94a3b8;
            }
            .dark .playlist-toggle:hover {
                background: rgba(99, 102, 241, 0.2);
                color: #818cf8;
            }

            .playlist-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 50px 16px 16px;
                overflow-y: auto;
                z-index: 5;
                animation: slideIn 0.3s ease-out;
            }
            
            @media screen and (min-width: 768px) {
                .playlist-overlay {
                    border-radius: 24px;
                    padding: 60px 24px 24px;
                }
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .dark .playlist-overlay {
                background: rgba(15, 23, 42, 0.98);
            }

            .playlist-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid transparent;
            }
            
            @media screen and (min-width: 768px) {
                .playlist-item {
                    gap: 12px;
                    padding: 12px;
                    border-radius: 12px;
                }
                
                .playlist-item:hover {
                    background: rgba(99, 102, 241, 0.05);
                    border-color: rgba(99, 102, 241, 0.1);
                    transform: translateX(4px);
                }
            }
            
            .playlist-item.active {
                background: rgba(99, 102, 241, 0.1);
                border-color: rgba(99, 102, 241, 0.2);
            }
            .dark .playlist-item:hover {
                background: rgba(99, 102, 241, 0.1);
            }
            .dark .playlist-item.active {
                background: rgba(99, 102, 241, 0.15);
                border-color: rgba(99, 102, 241, 0.3);
            }

            .youtube-badge {
                background: #ff0000;
                color: white;
                font-size: 9px;
                padding: 3px 6px;
                border-radius: 6px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            
            @media screen and (min-width: 768px) {
                .youtube-badge {
                    padding: 3px 7px;
                }
            }

            /* Folder Tabs */
            .folder-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 14px;
                background: rgba(0,0,0,0.04);
                padding: 4px;
                border-radius: 12px;
            }
            .dark .folder-tabs {
                background: rgba(255,255,255,0.05);
            }
            .folder-tab {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 8px 10px;
                border-radius: 9px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
                transition: all 0.25s ease;
                white-space: nowrap;
            }
            .dark .folder-tab {
                color: #94a3b8;
            }
            .folder-tab.active-songs {
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
            }
            .folder-tab.active-ghosts {
                background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(76, 29, 149, 0.45);
            }
            .folder-tab.active-gojol {
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35);
            }
            .folder-tab:not(.active-songs):not(.active-ghosts):not(.active-gojol):hover {
                background: rgba(99, 102, 241, 0.08);
                color: #6366f1;
            }
            .dark .folder-tab:not(.active-songs):not(.active-ghosts):not(.active-gojol):hover {
                background: rgba(99, 102, 241, 0.15);
                color: #818cf8;
            }
            .folder-count {
                font-size: 10px;
                font-weight: 700;
                opacity: 0.75;
                background: rgba(0,0,0,0.15);
                padding: 1px 5px;
                border-radius: 8px;
            }

            /* Ghost story special styling */
            .playlist-item.ghost-item.active {
                background: rgba(76, 29, 149, 0.12);
                border-color: rgba(76, 29, 149, 0.3);
            }
            .dark .playlist-item.ghost-item.active {
                background: rgba(76, 29, 149, 0.2);
                border-color: rgba(76, 29, 149, 0.4);
            }
            .ghost-badge {
                background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%);
                color: white;
                font-size: 9px;
                padding: 3px 6px;
                border-radius: 6px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            /* Active playing bars - ghost color */
            .ghost-bars div {
                background-color: #7c3aed !important;
            }

            /* Scrollbar styling */
            .playlist-overlay::-webkit-scrollbar {
                width: 6px;
            }
            
            @media screen and (min-width: 768px) {
                .playlist-overlay::-webkit-scrollbar {
                    width: 8px;
                }
            }
            
            .playlist-overlay::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.05);
                border-radius: 4px;
            }
            .playlist-overlay::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.3);
                border-radius: 4px;
            }
            .playlist-overlay::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.5);
            }
          `}</style>

          <div className={`player-card ${isPlaying ? 'is-playing' : ''}`}>
            {/* Close Button */}
            <div className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={18} />
            </div>

            {/* Playlist Toggle */}
            <div className="playlist-toggle" onClick={() => setShowPlaylist(!showPlaylist)}>
                <ListMusic size={18} />
            </div>

            {showPlaylist ? (
                <div className="playlist-overlay">
                    {/* Folder Tabs */}
                    <div className="folder-tabs">
                        <div
                            className={`folder-tab ${activeFolder === 'songs' ? 'active-songs' : ''}`}
                            onClick={() => setActiveFolder('songs')}
                        >
                            🎵 Songs
                            <span className="folder-count">
                                {playlist.filter(t => t.category === 'songs').length}
                            </span>
                        </div>
                        <div
                            className={`folder-tab ${activeFolder === 'ghosts' ? 'active-ghosts' : ''}`}
                            onClick={() => setActiveFolder('ghosts')}
                        >
                            👻 Bhoot FM
                            <span className="folder-count">
                                {playlist.filter(t => t.category === 'ghosts').length}
                            </span>
                        </div>
                        <div
                            className={`folder-tab ${activeFolder === 'gojol' ? 'active-gojol' : ''}`}
                            onClick={() => setActiveFolder('gojol')}
                        >
                            🕌 Gojol
                            <span className="folder-count">
                                {playlist.filter(t => t.category === 'gojol').length}
                            </span>
                        </div>
                    </div>

                    {/* Track List */}
                    {filteredPlaylist.map(({ track, globalIdx }) => (
                        <div 
                            key={globalIdx} 
                            className={`playlist-item ${track.category === 'ghosts' ? 'ghost-item' : ''} ${currentTrackIndex === globalIdx ? 'active' : ''}`}
                            onClick={() => selectTrack(globalIdx)}
                        >
                            <img 
                              src={track.cover} 
                              className="object-cover w-10 h-10 rounded-lg shadow-sm md:w-12 md:h-12" 
                              alt={track.title}
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate text-slate-800 dark:text-white">
                                  {track.title}
                                </div>
                                <div className="text-xs truncate text-slate-500 dark:text-slate-400">
                                  {track.artist}
                                </div>
                            </div>
                            {track.category === 'ghosts' ? (
                                <span className="ghost-badge">👻</span>
                            ) : track.type === 'youtube' ? (
                                <span className="youtube-badge">YT</span>
                            ) : null}
                            {currentTrackIndex === globalIdx && isPlaying && (
                                <div className={`flex gap-0.5 ${track.category === 'ghosts' ? 'ghost-bars' : ''}`}>
                                  <div className={`w-1 h-3 ${track.category === 'ghosts' ? 'bg-purple-600 dark:bg-purple-400' : 'bg-[#6366f1] dark:bg-[#818cf8]'} rounded-full animate-pulse`}></div>
                                  <div className={`w-1 h-4 ${track.category === 'ghosts' ? 'bg-purple-600 dark:bg-purple-400' : 'bg-[#6366f1] dark:bg-[#818cf8]'} rounded-full animate-pulse`} style={{animationDelay: '0.2s'}}></div>
                                  <div className={`w-1 h-3 ${track.category === 'ghosts' ? 'bg-purple-600 dark:bg-purple-400' : 'bg-[#6366f1] dark:bg-[#818cf8]'} rounded-full animate-pulse`} style={{animationDelay: '0.4s'}}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="player__top">
                        <div className={`player-cover ${isPlaying ? 'is-playing' : ''}`}>
                            <div 
                                className="player-cover__item" 
                                style={{ backgroundImage: `url(${currentTrack.cover})` }}
                            ></div>
                        </div>
                        
                        <div className="player-controls">
                            <div 
                                className={`player-controls__item -shuffle ${shuffleMode ? 'active' : ''}`}
                                onClick={() => setShuffleMode(!shuffleMode)}
                                title="Shuffle"
                            >
                                <Shuffle size={18} />
                            </div>
                            
                            <div className="player-controls__item" onClick={handlePrev} title="Previous">
                                <SkipBack size={20} />
                            </div>
                            
                            {/* Add -10s button for ghost stories */}
                            {isGhostStory && (
                                <div 
                                    className="player-controls__item -skip"
                                    onClick={skip10SecondsBack}
                                    title="Go back 10 seconds"
                                >
                                    <RotateCcw size={18} />
                                    <span className="skip-label">10s</span>
                                </div>
                            )}
                            
                            <div className={`player-controls__item -xl ${isPlaying ? 'is-playing' : ''}`} onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                                {isPlaying ? (
                                    <Pause size={28} />
                                ) : (
                                    <Play size={28} style={{marginLeft: '2px'}} />
                                )}
                            </div>
                            
                            {/* Add +10s button for ghost stories */}
                            {isGhostStory && (
                                <div 
                                    className="player-controls__item -skip"
                                    onClick={skip10SecondsForward}
                                    title="Skip 10 seconds"
                                >
                                    <RotateCw size={18} />
                                    <span className="skip-label">10s</span>
                                </div>
                            )}
                            
                            <div className="player-controls__item" onClick={() => handleNext()} title="Next">
                                <SkipForward size={20} />
                            </div>
                            
                            <div 
                                className={`player-controls__item -repeat ${repeatMode !== 'off' ? 'active' : ''}`}
                                onClick={toggleRepeat}
                                title={`Repeat: ${repeatMode}`}
                            >
                                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                            </div>
                        </div>
                    </div>

                    <div className="progress">
                        <div className="progress__top">
                            <div className="album-info">
                                <div className="album-info__name">{currentTrack.title}</div>
                                <div className="album-info__track">
                                  {currentTrack.category === 'ghosts' && <span className="mr-1">👻</span>}
                                  {currentTrack.category === 'gojol' && <span className="mr-1">🕌</span>}
                                  {currentTrack.artist}
                                  {isYoutube && playerReady && <span className="ml-2 text-xs opacity-50">(Streaming)</span>}
                                  {isYoutube && !playerReady && <span className="ml-2 text-xs opacity-50">(Loading...)</span>}
                                </div>
                            </div>
                            <div className="progress__duration">{duration}</div>
                        </div>
                        
                        <div className="progress__bar" ref={progressRef} onClick={clickProgress}>
                            <div className="progress__current" style={{ width: barWidth }}></div>
                        </div>
                        
                        <div className="progress__time">{currentTime}</div>
                    </div>

                    {/* Volume Control */}
                    <div className="volume-control">
                        <div className="volume-icon" onClick={() => setIsMuted(!isMuted)}>
                            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </div>
                        <div className="volume-bar" ref={volumeRef} onClick={handleVolumeChange}>
                            <div className="volume-current" style={{ width: `${isMuted ? 0 : volume}%` }}></div>
                        </div>
                        <div className="volume-percent">{isMuted ? 0 : volume}%</div>
                    </div>

                    {/* Secondary Controls */}
                    <div className="flex justify-center gap-2 mt-3 md:gap-3 md:mt-4">
                        <div 
                            className={`player-controls__item -favorite ${isFavorite ? 'active' : ''}`}
                            onClick={() => setIsFavorite(!isFavorite)}
                            title="Add to favorites"
                        >
                            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                        </div>
                        
                        <a 
                            href={isYoutube ? `https://www.youtube.com/watch?v=${currentTrack.youtubeId}` : '#'} 
                            target={isYoutube ? "_blank" : "_self"}
                            className="player-controls__item"
                            rel="noopener noreferrer"
                            title="Open in YouTube"
                        >
                            <ExternalLink size={18} />
                        </a>
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