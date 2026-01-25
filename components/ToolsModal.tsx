import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, RefreshCw, QrCode, Type, Hash, Check, X, 
  Clock, Play, Pause, RotateCcw, Maximize2, ArrowLeft 
} from 'lucide-react';

interface ToolsModalProps {
  onClose: () => void;
}

const ToolsModal: React.FC<ToolsModalProps> = ({ onClose }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<'menu' | 'focus'>('menu');

  // Password Generator State
  const [passLength, setPassLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // QR Generator State
  const [qrText, setQrText] = useState('');
  const [qrImage, setQrImage] = useState('');

  // Word Counter State
  const [textInput, setTextInput] = useState('');

  // Focus Timer State
  const [customTime, setCustomTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

  // --- Password Logic ---
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let allowed = chars;
    if (includeNumbers) allowed += nums;
    if (includeSymbols) allowed += syms;

    let generated = '';
    for (let i = 0; i < passLength; i++) {
      generated += allowed.charAt(Math.floor(Math.random() * allowed.length));
    }
    setPassword(generated);
    setCopied(false);
  };

  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- QR Logic ---
  const generateQR = () => {
    if (qrText.trim()) {
      setQrImage(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`);
    }
  };

  // --- Timer Logic ---
  const startFocusSession = () => {
      setTimeLeft(customTime * 60);
      setIsActive(true);
      setActiveView('focus');
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Handle Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(customTime * 60);
  };

  const enterFullscreen = async () => {
    if (timerRef.current) {
      try {
        await timerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    }
  };

  const exitFullscreen = async () => {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Close Modal ---
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white dark:bg-slate-900 w-full max-w-6xl ${activeView === 'menu' ? 'max-h-[90vh]' : 'h-auto'} overflow-y-auto rounded-2xl shadow-2xl relative border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200`}>
        
        {/* Header - Only show if NOT in focus view */}
        {activeView === 'menu' && (
          <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Developer Tools</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Quick utilities for your daily tasks</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* --- MENU VIEW --- */}
        {activeView === 'menu' && (
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* 1. Password Generator */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-primary">
                    <Hash size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Password Gen</h3>
                </div>

                <div className="flex-grow space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl flex justify-between items-center border border-slate-200 dark:border-slate-700 h-14">
                    <span className="font-mono text-base text-slate-800 dark:text-slate-200 truncate pr-4">
                      {password || 'Click Generate'}
                    </span>
                    {password && (
                      <button onClick={copyPassword} className="text-slate-500 hover:text-primary transition-colors">
                        {copied ? <Check size={20} className="text-green-500"/> : <Copy size={20} />}
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block flex justify-between">
                        <span>Length</span>
                        <span>{passLength}</span>
                      </label>
                      <input 
                        type="range" 
                        min="8" 
                        max="32" 
                        value={passLength} 
                        onChange={(e) => setPassLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                      />
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={includeNumbers} 
                          onChange={(e) => setIncludeNumbers(e.target.checked)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Numbers</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={includeSymbols} 
                          onChange={(e) => setIncludeSymbols(e.target.checked)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Symbols</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={generatePassword}
                  className="mt-6 w-full py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} /> Generate
                </button>
              </div>

              {/* 2. Focus Timer Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock size={100} />
                 </div>
                 <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Focus Timer</h3>
                </div>

                <div className="flex-grow space-y-4 relative z-10">
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Boost productivity with the Pomodoro technique. Set your time below.
                  </p>
                  
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Set Minutes</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            min="1" 
                            max="180"
                            value={customTime}
                            onChange={(e) => setCustomTime(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full text-2xl font-mono font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none border-b-2 border-slate-200 focus:border-orange-500 transition-colors py-1"
                        />
                        <span className="text-slate-400 font-medium">min</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={startFocusSession}
                  className="mt-6 w-full py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 relative z-10"
                >
                  <Play size={18} /> Start Focus
                </button>
              </div>

              {/* 3. QR Generator */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                    <QrCode size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">QR Code</h3>
                </div>

                <div className="flex-grow space-y-4">
                  <input 
                    type="text" 
                    placeholder="Enter text or URL" 
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white text-sm"
                  />
                  
                  <div className="flex justify-center items-center h-40 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden">
                    {qrImage ? (
                      <img src={qrImage} alt="QR Code" className="w-32 h-32 object-contain" />
                    ) : (
                       <span className="text-slate-400 text-xs">QR Preview</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={generateQR}
                  className="mt-6 w-full py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode size={18} /> Create QR
                </button>
              </div>

              {/* 4. Word Counter */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                    <Type size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Word Counter</h3>
                </div>

                <div className="flex-grow">
                   <textarea 
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type or paste text..."
                      className="w-full h-40 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white resize-none text-sm"
                   ></textarea>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                   <div className="bg-white dark:bg-slate-900 p-2 rounded-lg text-center border border-slate-200 dark:border-slate-700">
                      <span className="block text-xl font-bold text-slate-800 dark:text-white">
                        {textInput.trim().split(/\s+/).filter(w => w.length > 0).length}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Words</span>
                   </div>
                   <div className="bg-white dark:bg-slate-900 p-2 rounded-lg text-center border border-slate-200 dark:border-slate-700">
                      <span className="block text-xl font-bold text-slate-800 dark:text-white">
                        {textInput.length}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chars</span>
                   </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- FOCUS VIEW (ZEN MODE) --- */}
        {activeView === 'focus' && (
           <div 
             ref={timerRef}
             onDoubleClick={isFullscreen ? exitFullscreen : undefined}
             className={`
               flex flex-col items-center justify-center 
               transition-all duration-500
               ${isFullscreen ? 'bg-black cursor-none select-none' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl min-h-[600px] p-8'}
             `}
           >
             {/* Controls Header (Only visible if NOT fullscreen) */}
             {!isFullscreen && (
               <div className="absolute top-6 left-6">
                 <button 
                   onClick={() => setActiveView('menu')}
                   className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium"
                 >
                   <ArrowLeft size={20} /> Back
                 </button>
               </div>
             )}
             {!isFullscreen && (
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
             )}

             <div className="text-center w-full h-full flex flex-col items-center justify-center">
                
                {/* Timer Display */}
                {isFullscreen ? (
                    // Zen Mode Typography
                    <div className="flex items-center justify-center h-screen w-screen">
                        <span className="text-[15vw] font-black text-white leading-none tracking-tighter">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                ) : (
                    // Normal Mode Typography
                    <>
                        <h3 className="uppercase tracking-[0.3em] font-medium mb-8 text-slate-400">
                          Focus Timer
                        </h3>
                        <div className="text-8xl md:text-9xl font-light tabular-nums leading-none tracking-tight mb-12 select-none text-slate-900 dark:text-white">
                          {formatTime(timeLeft)}
                        </div>
                    </>
                )}

                {/* Controls - ONLY show if NOT fullscreen */}
                {!isFullscreen && (
                    <>
                        <div className="flex items-center gap-6 mb-12">
                           <button 
                              onClick={toggleTimer}
                              className={`
                                w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                                ${isActive 
                                   ? 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700' 
                                   : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30'
                                }
                              `}
                           >
                              {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                           </button>
                           
                           <button 
                              onClick={resetTimer}
                              className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all duration-300"
                           >
                              <RotateCcw size={24} />
                           </button>
                        </div>

                        <button 
                           onClick={enterFullscreen}
                           className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                           <Maximize2 size={16} /> Enter Zen Mode
                        </button>
                        
                        <p className="mt-8 text-xs text-slate-400">
                            Tip: In Zen Mode, double-click anywhere to exit.
                        </p>
                    </>
                )}
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default ToolsModal;