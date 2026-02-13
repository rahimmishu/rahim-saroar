import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 174; // 5.8s * 30fps = 174 frames
const SCROLL_PAGES = 6;

interface ScrollVideoIntroProps {
  onComplete: () => void;
  frameFolder?: string; // Path to frames folder
}

const ScrollVideoIntro = ({
  onComplete,
  frameFolder = "/frames", // e.g., /frames/frame_0001.jpg
}: ScrollVideoIntroProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  // ── Frame loading ──
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  // ── Animation refs ──
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const currentTranslateXRef = useRef(0);
  const currentTranslateYRef = useRef(0);
  const currentRotateRef = useRef(0);
  const animationRafRef = useRef<number | null>(null);

  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fadeToWhite, setFadeToWhite] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── 🎬 PRELOAD ALL FRAMES ──
  useEffect(() => {
    const loadFrames = async () => {
      const frames: HTMLImageElement[] = [];
      let loaded = 0;

      console.log(`Loading ${TOTAL_FRAMES} frames...`);

      // Load all frames
      const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          const frameNum = String(i + 1).padStart(4, '0'); // 0001, 0002, etc.
          img.src = `${frameFolder}/frame_${frameNum}.jpg`; // or .png
          
          img.onload = () => {
            frames[i] = img;
            loaded++;
            setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
            resolve();
          };
          
          img.onerror = () => {
            console.error(`Failed to load frame ${frameNum}`);
            resolve(); // Continue loading other frames
          };
        });
      });

      await Promise.all(promises);
      
      framesRef.current = frames;
      console.log(`✓ Loaded ${frames.length} frames`);
      setFramesLoaded(true);
      
      // Draw first frame
      drawFrame(0);
    };

    loadFrames();
  }, [frameFolder]);

  // ── 🎨 DRAW FRAME TO CANVAS (WITH COVER EFFECT) ──
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !framesRef.current[frameIndex]) return;

    const img = framesRef.current[frameIndex];
    
    // Get container dimensions
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Set canvas to full viewport size
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    
    // Calculate aspect ratios
    const imgRatio = img.width / img.height;
    const canvasRatio = containerWidth / containerHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    // Cover logic - ensure image fills entire canvas
    if (imgRatio > canvasRatio) {
      // Image is wider - fit to height
      drawHeight = containerHeight;
      drawWidth = drawHeight * imgRatio;
      offsetX = (containerWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller - fit to width
      drawWidth = containerWidth;
      drawHeight = drawWidth / imgRatio;
      offsetX = 0;
      offsetY = (containerHeight - drawHeight) / 2;
    }

    // Clear and draw with cover effect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // ── Redraw on resize ──
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Mouse tracking ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseXRef.current = (e.clientX - centerX) / (rect.width / 2);
      mouseYRef.current = (e.clientY - centerY) / (rect.height / 2);
    };

    const handleMouseLeave = () => {
      mouseXRef.current = 0;
      mouseYRef.current = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // ── ✨ IDLE BREATHING + PARALLAX ANIMATION ──
  useEffect(() => {
    const TRANSLATE_STRENGTH = 15;
    const ROTATE_STRENGTH = 0.4;
    const ANIMATION_LERP = 0.06;
    
    const IDLE_TRANSLATE_AMOUNT = 4;
    const IDLE_ROTATE_AMOUNT = 0.2;
    const IDLE_SPEED = 0.0008;

    const animationLoop = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationRafRef.current = requestAnimationFrame(animationLoop);
        return;
      }

      // Idle breathing
      const idleX = Math.sin(timestamp * IDLE_SPEED) * IDLE_TRANSLATE_AMOUNT;
      const idleY = Math.cos(timestamp * IDLE_SPEED * 0.7) * IDLE_TRANSLATE_AMOUNT;
      const idleRotate = Math.sin(timestamp * IDLE_SPEED * 0.5) * IDLE_ROTATE_AMOUNT;

      // Mouse parallax
      const mouseTranslateX = mouseXRef.current * TRANSLATE_STRENGTH;
      const mouseTranslateY = mouseYRef.current * TRANSLATE_STRENGTH;
      const mouseRotate = mouseXRef.current * ROTATE_STRENGTH;

      // Combine
      const targetTranslateX = idleX + mouseTranslateX;
      const targetTranslateY = idleY + mouseTranslateY;
      const targetRotate = idleRotate + mouseRotate;

      // Smooth lerp
      currentTranslateXRef.current += (targetTranslateX - currentTranslateXRef.current) * ANIMATION_LERP;
      currentTranslateYRef.current += (targetTranslateY - currentTranslateYRef.current) * ANIMATION_LERP;
      currentRotateRef.current += (targetRotate - currentRotateRef.current) * ANIMATION_LERP;

      // Apply transform with subtle scale
      canvas.style.transform = `
        translate(${currentTranslateXRef.current}px, ${currentTranslateYRef.current}px)
        rotate(${currentRotateRef.current}deg)
        scale(1.05)
      `;

      animationRafRef.current = requestAnimationFrame(animationLoop);
    };

    animationRafRef.current = requestAnimationFrame(animationLoop);

    return () => {
      if (animationRafRef.current) cancelAnimationFrame(animationRafRef.current);
    };
  }, []);

  // ── ⚡ SCROLL HANDLER WITH FRAME SWITCHING ──
  useEffect(() => {
    if (!framesLoaded) return;

    const handleScroll = () => {
      requestAnimationFrame(() => {
        const maxScroll = window.innerHeight * (SCROLL_PAGES - 1);
        const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));

        setScrollProgress(progress);
        
        // ⚡ Calculate frame index based on scroll
        const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
        
        // Only update if frame changed
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
          console.log(`Frame: ${frameIndex + 1}/${TOTAL_FRAMES}`);
        }

        // Complete at 98%
        if (progress >= 0.98 && !completedRef.current) {
          completedRef.current = true;
          setFadeToWhite(true);

          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "instant" });
            setIsDone(true);
            onComplete();
          }, 850);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [framesLoaded, onComplete]);

  if (isDone) return null;

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "#000",
          overflow: "hidden",
        }}
      >
        {/* ── Canvas for Frame Display (FULL COVERAGE) ── */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
            filter: "brightness(1.1) contrast(1.1) saturate(1.2)",
            willChange: "transform",
            transformOrigin: "center center",
          }}
        />

        {/* ── Subtle Glow Effect (LIGHTWEIGHT) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 1,
            mixBlendMode: "screen",
            opacity: framesLoaded ? 1 : 0,
            transition: "opacity 1.5s ease",
            animation: "subtleGlow 4s ease-in-out infinite",
          }}
        />

        {/* ── Light Particles (REDUCED TO 12) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            opacity: framesLoaded ? 0.6 : 0,
            transition: "opacity 1s ease",
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                background: i % 3 === 0 
                  ? "rgba(139,92,246,0.7)" 
                  : i % 3 === 1 
                    ? "rgba(236,72,153,0.7)" 
                    : "rgba(255,255,255,0.6)",
                borderRadius: "50%",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `lightFloat${i % 3} ${10 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
                filter: "blur(0.5px)",
                boxShadow: i % 3 === 0 
                  ? "0 0 10px rgba(139,92,246,0.5)" 
                  : i % 3 === 1 
                    ? "0 0 10px rgba(236,72,153,0.5)"
                    : "0 0 8px rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>

        {/* ── Minimal Sparkles (REDUCED TO 8) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 3,
            opacity: framesLoaded ? 0.5 : 0,
            transition: "opacity 1s ease",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "2px",
                height: "2px",
                background: "white",
                borderRadius: "50%",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                boxShadow: "0 0 6px rgba(255,255,255,0.8)",
              }}
            />
          ))}
        </div>

        {/* ── Film Grain ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
            pointerEvents: "none",
            zIndex: 2,
            mixBlendMode: "overlay",
            opacity: framesLoaded ? 0.15 : 0,
            transition: "opacity 1s ease",
          }}
        />

        {/* ── Loading Screen ── */}
        {!framesLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
              gap: "20px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                border: "3px solid rgba(255,255,255,0.08)",
                borderTop: "3px solid rgba(139,92,246,0.9)",
                borderRadius: "50%",
                animation: "svSpin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                boxShadow: "0 0 30px rgba(139,92,246,0.4)",
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600,
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
            >
              Loading Frames: {loadProgress}%
            </span>
          </div>
        )}

        {/* ── Progress Bar ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background: "rgba(255,255,255,0.03)",
            zIndex: 5,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${scrollProgress * 100}%`,
              background: "linear-gradient(90deg, rgba(139,92,246,0.8), rgba(236,72,153,0.9), rgba(139,92,246,1))",
              transition: "width 0.1s ease-out",
              boxShadow: "0 0 15px rgba(139,92,246,0.6), 0 0 30px rgba(236,72,153,0.4)",
            }}
          />
        </div>

        {/* ── Scroll Hint ── */}
        <div
          style={{
            position: "absolute",
            bottom: "45px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            pointerEvents: "none",
            opacity: !framesLoaded ? 0 : scrollProgress > 0.04 ? 0 : 1,
            transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 5,
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "13px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
              fontWeight: 600,
              textShadow: "0 4px 20px rgba(0,0,0,0.9), 0 0 15px rgba(139,92,246,0.5)",
            }}
          >
            Scroll to Begin
          </span>
          <div
            style={{
              width: "28px",
              height: "44px",
              border: "2.5px solid rgba(255,255,255,0.8)",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              padding: "7px 0",
              boxShadow: "0 6px 20px rgba(139,92,246,0.6), 0 0 35px rgba(236,72,153,0.4)",
              background: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "9px",
                background: "linear-gradient(180deg, rgba(139,92,246,1), rgba(236,72,153,0.9))",
                borderRadius: "2px",
                animation: "svDot 2s ease-in-out infinite",
                boxShadow: "0 0 12px rgba(139,92,246,1), 0 0 20px rgba(236,72,153,0.6)",
              }}
            />
          </div>
        </div>

        {/* ── Subtle Vignette ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, transparent 0%, transparent 30%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.4) 100%)",
            pointerEvents: "none",
            zIndex: 3,
            mixBlendMode: "multiply",
            opacity: framesLoaded ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />

        {/* ── White Fade ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#ffffff",
            opacity: fadeToWhite ? 1 : 0,
            transition: "opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </div>

      {/* Scroll space */}
      <div
        style={{
          height: `${SCROLL_PAGES * 100}vh`,
          pointerEvents: "none",
          background: "transparent",
        }}
      />

      <style>{`
        @keyframes svSpin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes svDot {
          0%   { transform: translateY(0);    opacity: 1;   }
          50%  { transform: translateY(14px); opacity: 0.3; }
          100% { transform: translateY(0);    opacity: 1;   }
        }
        
        @keyframes subtleGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0.5);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.3);
          }
        }
        
        @keyframes lightFloat0 {
          0%   { transform: translate(0, 0) scale(1);     opacity: 0; }
          10%  { opacity: 0.7; }
          50%  { transform: translate(20px, -100px) scale(1.1); opacity: 0.8; }
          90%  { opacity: 0.4; }
          100% { transform: translate(40px, -200px) scale(0.9); opacity: 0; }
        }
        
        @keyframes lightFloat1 {
          0%   { transform: translate(0, 0) scale(1);     opacity: 0; }
          15%  { opacity: 0.6; }
          50%  { transform: translate(-25px, -110px) scale(0.95); opacity: 0.75; }
          85%  { opacity: 0.45; }
          100% { transform: translate(-50px, -220px) scale(1.05); opacity: 0; }
        }
        
        @keyframes lightFloat2 {
          0%   { transform: translate(0, 0) scale(1);     opacity: 0; }
          12%  { opacity: 0.7; }
          50%  { transform: translate(15px, -120px) scale(1.05); opacity: 0.8; }
          88%  { opacity: 0.35; }
          100% { transform: translate(30px, -240px) scale(0.95); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default ScrollVideoIntro;