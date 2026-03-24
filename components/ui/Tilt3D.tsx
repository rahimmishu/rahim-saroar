import React, { useRef, useState } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
}

const Tilt3D: React.FC<Tilt3DProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Rotation Logic (Center is 0,0)
    const centerX = width / 2;
    const centerY = height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });

    // Glare Logic
    setGlare({
      x: (x / width) * 100,
      y: (y / height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 }); // Reset position
    setGlare(prev => ({ ...prev, opacity: 0 })); // Hide glare
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out transform-gpu ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
      }}
    >
      {children}

      {/* Holographic Glare Effect */}
      <div
        className="absolute inset-0 z-50 pointer-events-none rounded-3xl mix-blend-overlay"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
          opacity: glare.opacity,
          transition: 'opacity 0.5s ease',
        }}
      />
    </div>
  );
};

export default Tilt3D;