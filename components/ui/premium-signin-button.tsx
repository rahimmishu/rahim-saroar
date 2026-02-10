// 📁 src/components/ui/premium-signin-button.tsx
// ─────────────────────────────────────────────
// Usage in AppNavbar: replace the existing Sign In <button> block with:
//   <PremiumSignInButton onClick={() => setAuthModalOpen(true)} />

import React, { useRef, useState } from "react";
import { LogIn, Sparkles } from "lucide-react";

interface RippleItem {
  id: number;
  x: number;
  y: number;
}

interface Props {
  onClick?: () => void;
  className?: string;
}

export function PremiumSignInButton({ onClick, className = "" }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  /* ── Ripple on click ── */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    onClick?.();
  };

  return (
    <>
      <style>{`
        /* ── Idle: periodic shimmer sweep ── */
        @keyframes psb-sweep {
          0%   { transform: translateX(-200%) skewX(-12deg); }
          100% { transform: translateX(400%)  skewX(-12deg); }
        }
        /* ── Border gradient spin ── */
        @keyframes psb-spin {
          to { transform: rotate(360deg); }
        }
        /* ── Outer glow breathing ── */
        @keyframes psb-glow {
          0%,100% { opacity: 0.55; transform: scale(1);    }
          50%     { opacity: 0.85; transform: scale(1.08); }
        }
        /* ── Icon bounce on hover ── */
        @keyframes psb-icon-in {
          0%   { transform: translateX(0)    scale(1);    }
          40%  { transform: translateX(3px)  scale(1.15); }
          70%  { transform: translateX(-1px) scale(1.05); }
          100% { transform: translateX(1px)  scale(1.1);  }
        }
        /* ── Sparkle burst ── */
        @keyframes psb-spark {
          0%   { opacity: 1; transform: translate(0,0) scale(1);   }
          100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0); }
        }
        /* ── Ripple expand ── */
        @keyframes psb-ripple {
          0%   { transform: scale(0); opacity: 0.45; }
          100% { transform: scale(4); opacity: 0;    }
        }

        .psb-sweep {
          animation: psb-sweep 2.8s ease-in-out 1.5s infinite;
        }
        .psb-border-ring {
          animation: psb-spin 3s linear infinite;
        }
        .psb-glow {
          animation: psb-glow 3s ease-in-out infinite;
        }
        .psb-ripple-anim {
          animation: psb-ripple 0.65s ease-out forwards;
        }
        .psb-spark {
          animation: psb-spark 0.55s ease-out forwards;
        }

        /* hover: icon animation */
        .psb-btn:hover .psb-icon {
          animation: psb-icon-in 0.4s ease forwards;
        }
        /* hover: show sparkles */
        .psb-btn:hover .psb-sparkle-dot {
          animation: psb-spark 0.5s ease-out forwards;
        }
      `}</style>

      <div className={`relative hidden sm:flex items-center justify-center ${className}`}>

        {/* ── Outer breathing glow ── */}
        <div
          className="psb-glow pointer-events-none absolute inset-0 rounded-2xl blur-xl
                     bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-indigo-500/40"
        />

        {/* ── Spinning border ring ── */}
        <div className="pointer-events-none absolute -inset-[1.5px] rounded-2xl overflow-hidden">
          <div
            className="psb-border-ring absolute w-[200%] h-[200%] -top-1/2 -left-1/2
                       bg-[conic-gradient(from_0deg,transparent_50%,#22d3ee,#6366f1,transparent_100%)]"
          />
        </div>

        {/* ── Button ── */}
        <button
          ref={btnRef}
          onClick={handleClick}
          className="psb-btn group relative flex items-center gap-2.5 px-6 py-2.5
                     text-xs font-bold text-white rounded-2xl overflow-hidden
                     transition-all duration-300 active:scale-95 hover:scale-[1.06]
                     hover:shadow-[0_0_28px_rgba(99,102,241,0.55)]"
        >
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600
                          bg-[length:200%_auto] animate-gradient-x" />

          {/* Hover brightness layer */}
          <div className="absolute inset-0 transition-opacity duration-400 opacity-0 group-hover:opacity-100
                          bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-indigo-400/30" />

          {/* Periodic shimmer sweep */}
          <div className="psb-sweep absolute inset-0
                          bg-gradient-to-r from-transparent via-white/30 to-transparent
                          w-1/3 pointer-events-none" />

          {/* Ripples */}
          {ripples.map((r) => (
            <span
              key={r.id}
              className="psb-ripple-anim absolute rounded-full
                         bg-white/30 pointer-events-none w-10 h-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: r.x, top: r.y }}
            />
          ))}

          {/* Sparkle dots (show on hover, hidden otherwise) */}
          {[
            { sx: "-16px", sy: "-12px", delay: "0s"    },
            { sx:  "14px", sy: "-14px", delay: "0.06s" },
            { sx: "-12px", sy:  "14px", delay: "0.12s" },
            { sx:  "18px", sy:  "10px", delay: "0.04s" },
          ].map((s, i) => (
            <span
              key={i}
              className="psb-sparkle-dot pointer-events-none absolute left-1/2 top-1/2
                         w-1.5 h-1.5 rounded-full bg-white opacity-0"
              style={{
                "--sx": s.sx,
                "--sy": s.sy,
                animationDelay: s.delay,
              } as React.CSSProperties}
            />
          ))}

          {/* Icon */}
          <LogIn
            size={14}
            className="psb-icon relative z-10 transition-transform duration-300"
          />

          {/* Label */}
          <span className="relative z-10 tracking-wide">Sign In</span>

          {/* Tiny sparkle icon (idle hint) */}
          <Sparkles
            size={9}
            className="relative z-10 opacity-60 group-hover:opacity-100
                       transition-all duration-300 group-hover:scale-125 group-hover:rotate-12"
          />
        </button>
      </div>
    </>
  );
}
