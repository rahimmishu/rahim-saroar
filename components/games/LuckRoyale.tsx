import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './LuckRoyale.css';

interface LuckRoyaleProps {
  onClose: () => void;
}

const LuckRoyale: React.FC<LuckRoyaleProps> = ({ onClose }) => {
  const wheelRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ title: '', prize: '', code: '' });

  // Confetti Logic
  const launchConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ["#FFD700", "#FF5722", "#00E5FF", "#8BC34A", "#E040FB"];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -12 - 5,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 150
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = false;

      particles.forEach(p => {
        if (p.life > 0) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.3; // Gravity
          p.life--;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.rect(p.x, p.y, p.size, p.size);
          ctx.fill();
          activeParticles = true;
        }
      });

      if (activeParticles) requestAnimationFrame(animate);
    };
    animate();
  };

  const handleSpin = () => {
    if (isSpinning || !wheelRef.current) return;

    setIsSpinning(true);
    setShowResult(false);

    const isWin = Math.random() > 0.4; 
    const baseRot = 3600;
    const randomOffset = Math.floor(Math.random() * 360);
    const totalRotation = baseRot + randomOffset; 

    wheelRef.current.style.transition = "transform 4s cubic-bezier(0.1, 0, 0.2, 1)";
    wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      setResult({
        title: isWin ? "Congratulations!" : "Bad Luck!",
        prize: isWin ? "Rare Bundle Unlocked" : "Try Again Next Time",
        code: isWin ? `FF-${Math.floor(1000 + Math.random() * 9000)}-REWARD` : "----"
      });

      setShowResult(true);
      if (isWin) launchConfetti();
      
      setIsSpinning(false);
    }, 4000); 
  };

  return (
    <div className="luck-royale-wrapper animate-in fade-in zoom-in duration-300">
      <button onClick={onClose} className="close-game-btn">
        <X size={24} />
      </button>

      <div className="game-layout">
        <div className={`wheel-container ${showResult ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
          {/* 🔥 ফিক্স: পাথ থেকে '/images' সরানো হয়েছে এবং .jpg ব্যবহার করা হয়েছে */}
          <img 
            ref={wheelRef}
            src="/wheel.jpg" 
            className="wheel-image" 
            alt="Spin Wheel" 
          />
          {/* 🔥 ফিক্স: পাথ থেকে '/images' সরানো হয়েছে */}
          <img src="/arrow.png" className="wheel-pointer" alt="Pointer" />
          
          <button 
            className="spin-button" 
            onClick={handleSpin}
            disabled={isSpinning}
          >
            {isSpinning ? "..." : "SPIN"}
          </button>
        </div>

        <div className={`result-modal ${showResult ? 'active' : ''}`}>
          <div className="result-card">
            <h1 className="result-title">{result.title}</h1>
            <div className="prize-name">{result.prize}</div>
            <div className="redeem-code">{result.code}</div>
            <button onClick={onClose} className="redeem-btn">
              Collect & Exit
            </button>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} id="confettiCanvas" />
    </div>
  );
};

export default LuckRoyale;