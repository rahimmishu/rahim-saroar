import React, { useEffect, useRef, useState, useCallback } from 'react';
// 🛠️ FIX: 'Telescope' বাদ দিয়ে 'Globe' ব্যবহার করা হয়েছে যা নিরাপদ
import { Sparkles, Orbit, Rocket, Globe, Star } from 'lucide-react';

const ScienceSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(0);
  const [starCount, setStarCount] = useState(0);

  // Refs for animation loop
  const starsRef = useRef<any[]>([]);
  const shootingStarsRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // Configuration for Realistic Space
  const config = {
    // Realistic Star Colors (Blue giants, Red dwarfs, Yellow suns, White)
    starColors: [
        '255, 255, 255', // Pure White
        '210, 230, 255', // Pale Blue (Hot stars)
        '255, 240, 220', // Pale Gold (Sun-like)
        '255, 200, 200', // Reddish (Cool stars)
    ],
    starCountMobile: 150,
    starCountDesktop: 400, 
    baseSpeed: 0.02, // Very slow, majestic drift
  };

  const initSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 };

    // --- STAR CLASS (Realism Logic) ---
    class StarParticle {
      x: number; y: number;
      z: number; // Depth factor (0 = far, 1 = close)
      size: number;
      colorRgb: string;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.z = Math.random(); 
        
        // Closer stars are bigger and brighter
        this.size = (1 - this.z) * 1.5 + 0.5; 
        this.baseAlpha = (1 - this.z) * 0.7 + 0.3; 
        
        this.colorRgb = config.starColors[Math.floor(Math.random() * config.starColors.length)];
        
        // Randomize twinkling
        this.twinkleSpeed = Math.random() * 0.03 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2; 
      }

      draw(ctx: CanvasRenderingContext2D, time: number, mouseX: number, mouseY: number) {
        // Subtle Parallax (Mouse movement affects closer stars more)
        const parallaxX = (mouseX - canvas!.width / 2) * (1 - this.z) * 0.05;
        const parallaxY = (mouseY - canvas!.height / 2) * (1 - this.z) * 0.05;
        
        // Gentle Drift
        this.x -= config.baseSpeed * (1 - this.z) * 10;
        if (this.x < 0) this.x = canvas!.width;

        const finalX = this.x + parallaxX;
        const finalY = this.y + parallaxY;

        // Twinkle Calculation
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset);
        const alpha = Math.max(0.2, Math.min(1, this.baseAlpha + twinkle * 0.2));

        ctx.beginPath();
        ctx.arc(finalX, finalY, this.size, 0, Math.PI * 2);
        
        // Fill with color
        ctx.fillStyle = `rgba(${this.colorRgb}, ${alpha})`;
        
        // Add Glow to bright stars (The "Chok Chok" effect)
        if (this.z < 0.2 && alpha > 0.8) {
             ctx.shadowColor = `rgba(${this.colorRgb}, 1)`;
             ctx.shadowBlur = 10 * (1 - this.z);
        } else {
             ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for performance
      }
    }

    // --- SHOOTING STAR CLASS ---
    class ShootingStar {
      x: number; y: number;
      length: number;
      speed: number;
      active: boolean;
      timer: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas!.width + 200;
        this.y = Math.random() * canvas!.height * 0.5;
        this.length = Math.random() * 80 + 20;
        this.speed = Math.random() * 10 + 5;
        this.active = false;
        this.timer = Math.random() * 300; // Random delay
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!this.active) {
            if (this.timer > 0) this.timer--;
            else this.active = true;
            return;
        }

        this.x -= this.speed;
        this.y += this.speed * 0.5;

        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.length, this.y - this.length * 0.5);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y - this.length * 0.5);
        ctx.stroke();

        if (this.x < -100 || this.y > canvas!.height + 100) {
            this.reset();
        }
      }
    }

    // Initialize Objects
    starsRef.current = [];
    shootingStarsRef.current = [new ShootingStar(), new ShootingStar()]; // 2 Shooting stars

    const isDesktop = canvas.width > 768;
    const count = isDesktop ? config.starCountDesktop : config.starCountMobile;
    
    for (let i = 0; i < count; i++) {
        starsRef.current.push(new StarParticle());
    }
    setStarCount(count);

    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsTime = lastTime;

    // --- ANIMATION LOOP ---
    const animate = (time: number) => {
      if (!ctx) return;
      
      // FPS Calculation
      frameCount++;
      if (time - lastFpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsTime)));
        frameCount = 0; lastFpsTime = time;
      }

      // Background: Deep Dark Space Blue (Not just black)
      ctx.fillStyle = '#020617'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Draw Stars
      starsRef.current.forEach(star => star.draw(ctx, time, mouseX, mouseY));
      
      // Draw Shooting Stars
      shootingStarsRef.current.forEach(s => s.draw(ctx));

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate(performance.now());

  }, []);

  useEffect(() => {
    initSimulation();
    const handleResize = () => { 
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); 
        initSimulation(); 
    };
    window.addEventListener('resize', handleResize);
    return () => { 
        window.removeEventListener('resize', handleResize); 
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); 
    };
  }, [initSimulation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
    };
  };

  return (
    <section className="relative w-full h-[600px] bg-[#020617] overflow-hidden border-t border-b border-blue-900/30">
      
      {/* Nebula Overlay (CSS) */}
      <div className="absolute inset-0 z-0 opacity-40" 
           style={{ 
             background: 'radial-gradient(circle at center, rgba(30, 58, 138, 0.2) 0%, rgba(2, 6, 23, 0) 70%), radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, rgba(2, 6, 23, 0) 50%)',
           }}>
      </div>
      
      <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent via-[#020617]/60 to-[#020617] opacity-90"></div>

      {/* Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-10 cursor-crosshair">
        <canvas ref={canvasRef} className="block" onMouseMove={handleMouseMove} />
      </div>

      {/* Center Title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none w-full px-4">
        <div className="inline-block bg-[#020617]/40 backdrop-blur-sm border border-blue-500/10 p-8 rounded-full animate-in zoom-in duration-1000 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
            <div className="flex justify-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full text-[10px] font-mono text-blue-300 border border-blue-500/20">
                    <Orbit size={12} className="animate-spin-slow" />
                    <span className="tracking-wider">SOLAR SYSTEM</span>
                </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-500" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>Cosmos</span>
            </h2>
            <p className="text-blue-200/60 text-xs md:text-sm font-mono mt-4 tracking-widest uppercase">
                Explore the infinite starfield
            </p>
        </div>
      </div>

      {/* HUD Bar */}
      <div className="absolute bottom-0 left-0 w-full z-30 bg-[#020617]/80 backdrop-blur-md border-t border-blue-900/30 px-6 py-4 flex justify-between items-center text-[10px] font-mono text-blue-400/70 uppercase tracking-widest">
        <div className="flex gap-6">
            <div className="flex items-center gap-2">
                {/* 🛠️ REPLACED TELESCOPE WITH GLOBE */}
                <Globe size={14} className="text-blue-400" />
                <span>View: <span className="text-blue-200 font-bold">DEEP SPACE</span></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
                <Star size={14} className="text-yellow-200 animate-pulse" />
                <span>Visible Stars: <span className="text-white">{starCount}</span></span>
            </div>
        </div>
        
        <div className="flex gap-6">
             <div className="flex items-center gap-2">
                <Rocket size={14} className="text-purple-400" />
                <span>Parallax: <span className="text-purple-200">ENGAGED</span></span>
            </div>
            <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-white" />
                <span>FPS: <span className="text-white font-bold">{fps}</span></span>
            </div>
        </div>
      </div>

    </section>
  );
};

export default ScienceSimulation;