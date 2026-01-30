import React, { useEffect, useRef } from 'react';

const TubesCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef(0);
  // 🔥 মোবাইলের জন্য ফ্রেম কাউন্টার
  const frameCounter = useRef(0);

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

    // পিসির জন্য মাউস মুভ (স্বাভাবিক থাকবে)
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      points.push({ x: mouse.x, y: mouse.y });
    };

    // 🔥 ফিক্সড: মোবাইলের জন্য টাচ মুভ হ্যান্ডলার (Throttle করা হয়েছে)
    const handleTouchMove = (e: TouchEvent) => {
      frameCounter.current += 1;
      
      // প্রতি ৩টি টাচ ইভেন্টের মধ্যে মাত্র ১টি গ্রহণ করবে।
      // এটি মোবাইলে ল্যাগ কমাবে এবং আঁকা স্মুথ করবে।
      if (frameCounter.current % 3 !== 0) {
        return; 
      }

      const touch = e.touches[0];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      points.push({ x: mouse.x, y: mouse.y });
    };

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
      // ট্রেইলের দৈর্ঘ্য একটু কমানো হলো (৫০ থেকে ৪০) পারফরম্যান্সের জন্য
      if (points.length > 40) {
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
    // প্যাসিভ ট্রু থাকবে যাতে স্ক্রল ঠিক থাকে
    window.addEventListener('touchmove', handleTouchMove, { passive: true }); 

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
      style={{ 
        zIndex: 9999, 
        opacity: 1,
        touchAction: 'none'
      }} 
    />
  );
};

export default TubesCursor;