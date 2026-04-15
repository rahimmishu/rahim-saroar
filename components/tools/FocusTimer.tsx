import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Play, Pause, Maximize, Minimize } from 'lucide-react';
import './FocusTimer.css'; 

interface FocusTimerProps {
  onClose: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'focus' | 'short' | 'long' | 'custom'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isEditing, setIsEditing] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const modes = {
    focus: { label: 'Focus', time: 25 * 60 },
    short: { label: 'Short Break', time: 5 * 60 },
    long: { label: 'Long Break', time: 15 * 60 },
    custom: { label: 'Custom', time: customMinutes * 60 },
  };

  const switchMode = (newMode: 'focus' | 'short' | 'long') => {
    setMode(newMode);
    setTimeLeft(modes[newMode].time);
    setIsActive(false);
    setIsEditing(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'custom' ? customMinutes * 60 : modes[mode].time);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // ✅ Handle Fullscreen Controls Visibility with proper cleanup
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isFullScreen) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  // ✅ Fullscreen change listener with cleanup
  useEffect(() => {
    const handleEsc = () => {
      if (!document.fullscreenElement) setIsFullScreen(false);
    };
    document.addEventListener('fullscreenchange', handleEsc);
    
    // ✅ Cleanup: Remove listener on unmount
    return () => document.removeEventListener('fullscreenchange', handleEsc);
  }, []);

  // ✅ Timer interval with cleanup
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    
    // ✅ Cleanup: Clear interval on unmount or dependency change
    return () => { 
      if (timerRef.current) clearInterval(timerRef.current); 
    };
  }, [isActive, timeLeft]);

  // ✅ Cleanup controlsTimeoutRef on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = null;
      }
    };
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCustomMinutes(val === '' ? 0 : parseInt(val));
  };

  const saveCustomTime = () => {
    setIsEditing(false);
    let finalMinutes = customMinutes;
    if (finalMinutes <= 0) finalMinutes = 1; 
    setCustomMinutes(finalMinutes);
    setMode('custom');
    setTimeLeft(finalMinutes * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`focus-wrapper animate-in zoom-in duration-300 ${isFullScreen ? 'zen-mode' : ''}`}
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      <div className={`focus-card-enhanced ${!showControls && isFullScreen ? 'hidden-controls' : ''}`}>
        
        {/* Header Section */}
        <div className="focus-header-section">
            {!isFullScreen ? (
            <div className="focus-modes-enhanced">
                {(['focus', 'short', 'long'] as const).map((m) => (
                <button 
                    key={m}
                    className={`mode-btn-enhanced ${mode === m ? 'active' : ''}`}
                    onClick={() => switchMode(m)}
                >
                    {modes[m].label}
                </button>
                ))}
            </div>
            ) : <div></div>}

            <div className="top-icon-controls">
                <button onClick={toggleFullScreen} className="icon-btn" title="Toggle Fullscreen">
                    {isFullScreen ? <Minimize size={22} /> : <Maximize size={22} />}
                </button>
                <button onClick={onClose} className="icon-btn close-btn" title="Close">
                    <X size={22} />
                </button>
            </div>
        </div>

        {/* Timer Display */}
        <div className="timer-container-enhanced">
            {isEditing ? (
            <div className="custom-time-input-wrapper">
                <input 
                autoFocus
                type="text" 
                inputMode="numeric"
                value={customMinutes || ''} 
                onChange={handleTimeChange}
                onBlur={saveCustomTime}
                onKeyDown={(e) => e.key === 'Enter' && saveCustomTime()}
                className="time-input-enhanced"
                placeholder="Min"
                />
                <span className="input-label">minutes</span>
            </div>
            ) : (
            <div 
                className={`timer-display-enhanced ${isFullScreen ? 'timer-zen' : ''}`}
                onClick={() => { if(!isFullScreen) { setIsEditing(true); setIsActive(false); }}}
                title={!isFullScreen ? "Click to Edit Time" : ""}
            >
                {formatTime(timeLeft)}
            </div>
            )}
        </div>

        {/* Controls */}
        <div className={`control-group-enhanced transition-all duration-500 ${!showControls && isFullScreen ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100'}`}>
          <button 
            className={`main-control-btn ${isActive ? 'active state-running' : 'state-paused'}`} 
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{marginLeft:'4px'}} />}
          </button>

          <button className="reset-icon-btn" onClick={resetTimer} title="Reset Timer">
            <RotateCcw size={24} />
          </button>
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        /* --- NORMAL MODE STYLES --- */
        .focus-card-enhanced {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            padding: 40px;
            border-radius: 35px;
            box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            width: 100%;
            max-width: 450px;
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 20px;
            transition: all 0.3s ease;
        }

        .focus-header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            min-height: 44px;
        }

        .top-icon-controls { display: flex; gap: 10px; z-index: 20; }

        .focus-modes-enhanced {
            display: flex; gap: 8px; background: rgba(0,0,0,0.25); padding: 6px; border-radius: 18px;
        }
        .mode-btn-enhanced {
            background: transparent; border: none; color: #94a3b8; padding: 8px 16px;
            border-radius: 14px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.3s;
        }
        .mode-btn-enhanced.active {
            background: #3b82f6; color: white; box-shadow: 0 2px 12px rgba(59, 130, 246, 0.4);
        }

        .timer-container-enhanced {
            min-height: 140px; display: flex; align-items: center; justify-content: center;
        }
        .timer-display-enhanced {
            font-size: 6.5rem; font-weight: 800; font-variant-numeric: tabular-nums;
            color: #93c5fd; cursor: pointer; transition: all 0.3s; line-height: 1;
        }
        
        .custom-time-input-wrapper { display: flex; flex-direction: column; align-items: center; }
        .time-input-enhanced {
            background: transparent; border: none; border-bottom: 3px solid #60a5fa;
            color: white; font-size: 4.5rem; font-weight: 800; text-align: center; width: 160px; outline: none;
        }
        .input-label { color: #94a3b8; font-size: 1rem; margin-top: 10px; }

        .icon-btn {
            background: rgba(255,255,255,0.1); border: none; color: #e2e8f0; width: 44px; height: 44px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
        }
        .icon-btn:hover { background: rgba(255,255,255,0.25); color: white; transform: scale(1.05); }
        .close-btn:hover { background: #ef4444; }
        .reset-icon-btn {
            background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 10px; transition: all 0.3s;
        }
        .reset-icon-btn:hover { color: white; transform: rotate(90deg) scale(1.1); }

        .control-group-enhanced { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .main-control-btn {
            border: none; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s; box-shadow: 0 0 25px rgba(255, 255, 255, 0.15);
        }
        .state-paused { background: #3b82f6; color: white; }
        .state-running { background: #ef4444; color: white; box-shadow: 0 0 25px rgba(239, 68, 68, 0.4); }

        /* --- ZEN MODE (PURE BLACK & WHITE) --- */
        .focus-wrapper.zen-mode {
            position: fixed !important;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100vw; height: 100vh;
            background-color: #000000 !important; /* Pure Black Background */
            z-index: 99999;
            border-radius: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .zen-mode .focus-card-enhanced {
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
            max-width: none;
            padding: 0;
            width: 100%;
            height: 100%;
            justify-content: center;
        }

        /* Pure White Timer Text in Zen Mode */
        .zen-mode .timer-display-enhanced.timer-zen {
            color: #FFFFFF !important;
            font-size: 25vw; /* Huge Text */
            font-weight: 900;
            text-shadow: none !important;
            cursor: default;
        }

        .zen-mode .focus-header-section {
            position: absolute; top: 30px; right: 30px; width: auto;
        }
        
        .zen-mode .control-group-enhanced {
             position: absolute; bottom: 80px; width: 100%;
        }

        /* Hide controls when inactive */
        .hidden-controls .top-icon-controls,
        .hidden-controls .control-group-enhanced {
            opacity: 0;
            pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default FocusTimer;