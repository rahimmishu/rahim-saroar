import { useEffect, useState } from 'react';

const BackgroundEffects = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in effects after mount
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <>
      {/* ── SMOOTH RADIAL GLOW (NO SQUARE!) ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(236,72,153,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 1,
          mixBlendMode: "screen",
          opacity: visible ? 0.7 : 0,
          transition: "opacity 2s ease",
        }}
      />

      {/* ── SMOOTH GRADIENT OVERLAY (FIXED SQUARE ISSUE) ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(135deg, rgba(139,92,246,0.04) 0%, rgba(236,72,153,0.03) 50%, rgba(251,191,36,0.04) 100%)",
          pointerEvents: "none",
          zIndex: 1,
          mixBlendMode: "overlay",
          opacity: visible ? 0.6 : 0,
          transition: "opacity 2s ease",
        }}
      />

      {/* ── FLOATING GLOW ORBS (SMOOTH ANIMATION) ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transition: "opacity 2s ease",
        }}
      >
        {[
          { size: "180px", color: "rgba(139,92,246,0.06)", top: "15%", left: "20%", blur: "70px", duration: "25s" },
          { size: "220px", color: "rgba(236,72,153,0.05)", top: "65%", left: "75%", blur: "80px", duration: "30s" },
          { size: "140px", color: "rgba(251,191,36,0.07)", top: "45%", left: "50%", blur: "60px", duration: "20s" },
          { size: "200px", color: "rgba(139,92,246,0.04)", top: "80%", left: "25%", blur: "75px", duration: "28s" },
        ].map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              top: orb.top,
              left: orb.left,
              transform: "translate(-50%, -50%)",
              filter: `blur(${orb.blur})`,
              animation: `floatOrb ${orb.duration} ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* ── GENTLE SPARKLE PARTICLES ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          opacity: visible ? 0.4 : 0,
          transition: "opacity 2s ease",
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: i % 3 === 0 
                ? "rgba(139,92,246,0.6)" 
                : i % 3 === 1 
                  ? "rgba(236,72,153,0.6)" 
                  : "rgba(255,255,255,0.5)",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `gentleFloat ${12 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: "blur(0.5px)",
              boxShadow: i % 3 === 0 
                ? "0 0 8px rgba(139,92,246,0.4)" 
                : i % 3 === 1 
                  ? "0 0 8px rgba(236,72,153,0.4)"
                  : "0 0 6px rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* ── SUBTLE LIGHT BEAMS ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            linear-gradient(45deg, transparent 48%, rgba(139,92,246,0.02) 49%, rgba(139,92,246,0.03) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(236,72,153,0.02) 49%, rgba(236,72,153,0.03) 51%, transparent 52%)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
          zIndex: 1,
          opacity: visible ? 0.3 : 0,
          transition: "opacity 2s ease",
          animation: "lightBeamsMove 25s linear infinite",
          filter: "blur(1.5px)",
        }}
      />

      <style>{`
        @keyframes floatOrb {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 1;
          }
        }

        @keyframes gentleFloat {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          50% {
            transform: translate(15px, -80px) scale(1.1);
            opacity: 0.7;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translate(30px, -160px) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes lightBeamsMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(80px, 80px);
          }
        }
      `}</style>
    </>
  );
};

export default BackgroundEffects;
