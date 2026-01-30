import React, { useEffect, useRef } from 'react';

const TubesCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef(0);

  useEffect(() => {
    // 🔥 চেক: যদি স্ক্রিন সাইজ ৭৬৮ পিক্সেলের কম হয় (মোবাইল), তবে কোড রান করবে না
    if (window.innerWidth < 768) return;

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
      
      // রিসাইজ করলে যদি মোবাইল সাইজ হয়ে যায়, ক্যানভাস ক্লিয়ার করে দেব
      if (window.innerWidth < 768) {
        ctx.clearRect(0, 0, width, height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      points.push({ x: mouse.x, y: mouse.y });
    };

    // ❌ টাচ ইভেন্ট রিমুভ করে দিয়েছি কারণ ফোনে এটি দরকার নেই

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
      // মোবাইল স্ক্রিন হলে এনিমেশন লুপ থামিয়ে দেবে (Performance Optimization)
      if (window.innerWidth < 768) return;

      if (points.length > 50) {
        points.shift();
      }

      ctx.clearRect(0, 0, width, height);

      hueRef.current += 0.5;
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

        // LAYER 1
        drawPath();
        ctx.lineWidth = 60;
        ctx.shadowBlur = 80;
        ctx.shadowColor = color1;
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // LAYER 2
        drawPath();
        ctx.lineWidth = 30;
        ctx.shadowBlur = 40;
        ctx.shadowColor = color2;
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // LAYER 3
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
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // 🔥 'hidden md:block' ক্লাস যোগ করা হয়েছে
      // hidden = সব ডিভাইসে লুকানো
      // md:block = শুধুমাত্র মিডিয়াম (ট্যাবলেট/পিসি) স্ক্রিনে দেখাবে
      className="fixed top-0 left-0 hidden w-full h-full pointer-events-none md:block"
      style={{ 
        zIndex: 9999, 
        opacity: 1 
      }} 
    />
  );
};

export default TubesCursor;