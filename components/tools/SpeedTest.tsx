import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import './SpeedTest.css';

interface SpeedTestProps {
  onClose: () => void;
}

const SpeedTest: React.FC<SpeedTestProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<'idle' | 'download' | 'upload' | 'complete'>('idle');
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [finalDl, setFinalDl] = useState('--');
  const [finalUl, setFinalUl] = useState('--');
  const [statusText, setStatusText] = useState('Ready');
  
  // Refs for tracking values without re-renders during high-frequency updates
  const totalBytesRef = useRef(0);
  const intervalIdRef = useRef<any>(null);
  const isRunningRef = useRef(false);

  const dlUrl = "https://speed.cloudflare.com/__down?bytes=25000000";
  const ulUrl = "https://speed.cloudflare.com/__up";
  const ARC_LENGTH = 330;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTest();
    };
  }, []);

  const stopTest = () => {
    isRunningRef.current = false;
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const startTest = () => {
    // Reset UI
    setFinalDl('--');
    setFinalUl('--');
    setLiveSpeed(0);
    setPhase('download');
    setStatusText('Initializing...');
    isRunningRef.current = true;

    runPhase('download');
  };

  const runPhase = (type: 'download' | 'upload') => {
    if (!isRunningRef.current) return;

    setPhase(type);
    setStatusText(type === 'download' ? "Downloading..." : "Uploading...");
    
    totalBytesRef.current = 0;
    const startTime = performance.now();

    // Safety timeout to detect connection issues
    const safety = setTimeout(() => {
      if (totalBytesRef.current === 0 && isRunningRef.current) {
        stopTest();
        setStatusText("Connection Failed");
        setPhase('idle');
      }
    }, 6000);

    // Launch multiple streams
    for (let i = 0; i < 4; i++) {
      if (type === 'download') downloadStream();
      else uploadStream();
    }

    // Update Speed Loop
    intervalIdRef.current = setInterval(() => {
      if (!isRunningRef.current) return;
      
      const duration = (performance.now() - startTime) / 1000;
      if (duration > 0.1 && totalBytesRef.current > 0) {
        clearTimeout(safety);
        const speed = (totalBytesRef.current * 8 / duration / 1000000); // Mbps
        setLiveSpeed(speed);
      }
    }, 100);

    // End Phase Timer
    setTimeout(() => {
      if (!isRunningRef.current) return;
      
      clearInterval(intervalIdRef.current);
      const duration = (performance.now() - startTime) / 1000;
      const finalSpeed = (totalBytesRef.current * 8 / duration / 1000000).toFixed(1);

      if (type === 'download') {
        setFinalDl(finalSpeed);
        setLiveSpeed(0); // Reset needle for next phase
        setTimeout(() => runPhase('upload'), 800);
      } else {
        setFinalUl(finalSpeed);
        finishTest();
      }
    }, type === 'download' ? 6000 : 8000);
  };

  const downloadStream = async () => {
    if (!isRunningRef.current) return;
    try {
      const response = await fetch(dlUrl + "&r=" + Math.random());
      const reader = response.body?.getReader();
      
      // ✅ Add null checking for reader before using it
      if (!reader) {
        console.warn("No reader available from response body");
        return;
      }

      while (isRunningRef.current) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytesRef.current += value.length;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadStream = () => {
    if (!isRunningRef.current) return;
    const data = "a".repeat(1024 * 1024); // 1MB chunk
    
    const loop = () => {
      if (!isRunningRef.current) return;
      fetch(ulUrl, { method: 'POST', mode: 'no-cors', body: data })
        .then(() => {
          if (!isRunningRef.current) return;
          totalBytesRef.current += data.length;
          loop();
        })
        .catch(() => {
          if (isRunningRef.current) loop();
        });
    };
    loop();
  };

  const finishTest = () => {
    setStatusText("Completed");
    setLiveSpeed(0);
    setPhase('complete');
    isRunningRef.current = false;
  };

  // UI Calculation
  const getGaugeStyles = () => {
    let percent = liveSpeed / 100; // Assuming 100 Mbps max for visual scaling
    if (percent > 1) percent = 1;
    
    const deg = percent * 270;
    const offset = ARC_LENGTH - (percent * ARC_LENGTH);
    
    return { deg, offset };
  };

  const gauge = getGaugeStyles();

  return (
    <div className="speed-test-wrapper animate-in zoom-in duration-300">
      <div className="st-glass-card">
        <button onClick={onClose} className="st-close-btn"><X size={24} /></button>
        <div className="st-brand">SpeedFlow Ultimate</div>

        <div className="st-gauge-wrapper">
          <svg className="st-gauge-svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="gradient-dl" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#00f3ff', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#0077ff', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="gradient-ul" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#bc13fe', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#8a00ff', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            <circle className="st-track-bg" cx="100" cy="100" r="70" />
            
            <circle 
              className="st-track-fill" 
              cx="100" cy="100" r="70"
              style={{ 
                strokeDashoffset: gauge.offset,
                stroke: phase === 'upload' ? 'url(#gradient-ul)' : 'url(#gradient-dl)',
                filter: phase === 'upload' ? 'drop-shadow(0 0 10px #bc13fe)' : 'drop-shadow(0 0 10px #00f3ff)'
              }} 
            />

            <g className="st-needle-group" style={{ transform: `rotate(${gauge.deg}deg)` }}>
              <polygon className="st-needle" points="100,96 155,100 100,104" />
              <circle className="st-needle" cx="100" cy="100" r="5" />
            </g>
          </svg>
        </div>

        <div className="st-readout">
          <div className="st-speed-value">{liveSpeed.toFixed(0)}</div>
          <div className="st-unit">Mbps</div>
          <div 
            className="st-status-pill" 
            style={{ color: phase === 'upload' ? 'var(--purple)' : phase === 'download' ? 'var(--cyan)' : 'var(--text-muted)' }}
          >
            {statusText}
          </div>
        </div>

        <div className="st-stats-grid">
          <div className={`st-stat-card ${phase === 'download' ? 'active-dl' : ''}`}>
            <div className="st-stat-label">DOWNLOAD</div>
            <div className="st-stat-num">{finalDl}</div>
          </div>
          <div className={`st-stat-card ${phase === 'upload' ? 'active-ul' : ''}`}>
            <div className="st-stat-label">UPLOAD</div>
            <div className="st-stat-num">{finalUl}</div>
          </div>
        </div>

        <button 
          className="st-start-btn" 
          onClick={startTest} 
          disabled={phase === 'download' || phase === 'upload'}
        >
          {phase === 'idle' ? 'Start Test' : phase === 'complete' ? 'Run Again' : 'Testing...'}
        </button>
      </div>
    </div>
  );
};

export default SpeedTest;