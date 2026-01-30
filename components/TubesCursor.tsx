import React, { useEffect, useRef } from 'react';

const TubesCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // অটো কালার চেঞ্জিং-এর জন্য Hue Ref
  const hueRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    let mouse = { x: width / 2, y: height / 2 };
    let points: { x: number; y: number }[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      points.push({ x: mouse.x, y: mouse.y });
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      points.push({ x: mouse.x, y: mouse.y });
    };

    // পাথ আঁকার ফাংশন
    const drawPath = () => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    };

    const animate = () => {
      // ট্রেইল কন্ট্রোল
      if (points.length > 50) {
        points.shift();
      }

      ctx.clearRect(0, 0, width, height);

      // 🔥 অটো কালার আপডেট (RGB Effect)
      hueRef.current += 0.5; // স্পিড কন্ট্রোল (0.5 = স্লো, 1 = ফাস্ট)
      const color1 = `hsl(${hueRef.current}, 100%, 50%)`;
      const color2 = `hsl(${hueRef.current + 60}, 100%, 50%)`;

      if (points.length > 1) {
        const gradient = ctx.createLinearGradient(
          points[0].x, points[0].y,
          points[points.length - 1].x, points[points.length - 1].y
        );
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // LAYER 1: Outer Glow
        drawPath();
        ctx.lineWidth = 60;
        ctx.shadowBlur = 80;
        ctx.shadowColor = color1;
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // LAYER 2: Main Body
        drawPath();
        ctx.lineWidth = 30;
        ctx.shadowBlur = 40;
        ctx.shadowColor = color2;
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // LAYER 3: White Core
        ctx.globalCompositeOperation = 'source-over';
        drawPath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      // 🔥 Z-Index বাড়িয়ে দেওয়া হয়েছে যাতে সবার উপরে থাকে
      style={{ 
        zIndex: 9999, 
        opacity: 1 
      }} 
    />
  );
};

export default TubesCursor;