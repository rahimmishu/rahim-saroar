import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

/* ─────────────────────────────────────────────
   FALLBACK ASSETS  (replace with real imports)
───────────────────────────────────────────── */
const fallbackTelegramPic =
  'https://cdn.pixabay.com/photo/2017/02/12/11/44/telegram-icon-2059714_1280.png';
const fallbackFacebookPic =
  'https://w7.pngwing.com/pngs/318/1000/png-transparent-logo-facebook-fb-social-media-icon-interface-logos-icon-thumbnail.png';
const fallbackDefaultIcon =
  'https://cdn-icons-png.flaticon.com/512/81/81041.png';

/* ─────────────────────────────────────────────
   PLATFORM CONFIG
───────────────────────────────────────────── */
interface PlatformConfig {
  name: string;
  handle: string;
  url: string;
  profilePic: string;
  accent: string;        // hex for SVG / canvas usage
  accentTw: string;      // tailwind color name (text-*)
  ringFrom: string;
  ringTo: string;
  btnFrom: string;
  btnTo: string;
  aurora1: string;
  aurora2: string;
  icon: ReactNode;
  badge: string;
}

const platforms: Record<string, PlatformConfig> = {
  telegram: {
    name: 'Telegram',
    handle: '@rahim_saroar_mishu',
    url: 'https://t.me/rahim_saroar_mishu',
    profilePic: fallbackTelegramPic,
    accent: '#38bdf8',
    accentTw: 'sky',
    ringFrom: '#0ea5e9',
    ringTo: '#67e8f9',
    btnFrom: '#0284c7',
    btnTo: '#0369a1',
    aurora1: 'rgba(14,165,233,0.22)',
    aurora2: 'rgba(103,232,249,0.12)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.14 13.647l-2.95-.924c-.642-.204-.657-.642.136-.953l11.57-4.461c.537-.194 1.006.131.998.912z" />
      </svg>
    ),
    badge: 'Verified Channel',
  },
  facebook: {
    name: 'Facebook',
    handle: 'Rahim Saroar Mishu',
    url: 'https://www.facebook.com/rahimsaroar',
    profilePic: fallbackFacebookPic,
    accent: '#3b82f6',
    accentTw: 'blue',
    ringFrom: '#2563eb',
    ringTo: '#818cf8',
    btnFrom: '#1d4ed8',
    btnTo: '#1e40af',
    aurora1: 'rgba(37,99,235,0.22)',
    aurora2: 'rgba(129,140,248,0.14)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
    badge: 'Official Profile',
  },
};

/* ─────────────────────────────────────────────
   SVG RING COUNTDOWN
───────────────────────────────────────────── */
interface RingProps {
  countdown: number;
  total: number;
  from: string;
  to: string;
}

const RingCountdown: React.FC<RingProps> = ({ countdown, total, from, to }) => {
  const R = 52;
  const C = 2 * Math.PI * R;
  const progress = (countdown / total) * C;
  const id = 'ringGrad';

  return (
    <div className="relative flex items-center justify-center mx-auto mb-8 w-36 h-36">
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        {/* Progress */}
        <circle
          cx="60" cy="60" r={R}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${C}`}
          style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {/* Number */}
      <div className="relative z-10 text-center">
        <span
          className="block text-4xl font-black text-white tabular-nums"
          style={{ fontFamily: "'DM Mono', monospace", lineHeight: 1 }}
        >
          {countdown}
        </span>
        <span className="block text-[10px] tracking-[0.25em] uppercase text-white/40 mt-1">sec</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   AURORA CANVAS BACKGROUND
───────────────────────────────────────────── */
const AuroraCanvas: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      frame += 0.004;
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      // Orb 1
      const x1 = W * 0.25 + Math.sin(frame * 1.1) * W * 0.15;
      const y1 = H * 0.35 + Math.cos(frame * 0.8) * H * 0.18;
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, W * 0.45);
      g1.addColorStop(0, c1);
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      // Orb 2
      const x2 = W * 0.72 + Math.cos(frame * 0.9) * W * 0.18;
      const y2 = H * 0.62 + Math.sin(frame * 1.3) * H * 0.15;
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, W * 0.38);
      g2.addColorStop(0, c2);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [c1, c2]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }}
    />
  );
};

/* ─────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────── */
const Particles: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 18 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-0"
        style={{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          background: color,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `floatUp ${4 + Math.random() * 6}s ${Math.random() * 5}s ease-in infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes floatUp {
        0%   { opacity: 0; transform: translateY(0px) scale(1); }
        20%  { opacity: 0.7; }
        80%  { opacity: 0.4; }
        100% { opacity: 0; transform: translateY(-120px) scale(0.4); }
      }
      @keyframes cardIn {
        0%   { opacity: 0; transform: translateY(32px) scale(0.96); }
        100% { opacity: 1; transform: translateY(0px) scale(1); }
      }
      @keyframes avatarIn {
        0%   { opacity: 0; transform: scale(0.7) rotate(-6deg); }
        70%  { transform: scale(1.07) rotate(1deg); }
        100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes badgePop {
        0%   { opacity: 0; transform: scale(0.5); }
        70%  { transform: scale(1.15); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes scanline {
        0%   { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────────
   INVALID PAGE
───────────────────────────────────────────── */
const InvalidPage: React.FC = () => (
  <div className="relative flex items-center justify-center min-h-screen bg-[#080810] text-white overflow-hidden">
    <AuroraCanvas c1="rgba(239,68,68,0.18)" c2="rgba(168,85,247,0.12)" />
    <div
      className="relative z-10 max-w-sm px-8 py-12 mx-4 text-center rounded-3xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}
    >
      <div className="mb-5 text-6xl">⚠️</div>
      <h1 className="mb-3 text-2xl font-bold text-red-400">Invalid Link</h1>
      <p className="text-sm leading-relaxed text-white/50">
        সঠিক প্ল্যাটফর্ম পাওয়া যায়নি।
        <br />
        <code className="inline-block px-3 py-1 mt-2 text-xs rounded-lg text-white/30 bg-white/5">
          /link?platform=telegram
        </code>
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const TOTAL = 5;

const RedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedPlatform = (searchParams.get('platform') || '').toLowerCase();
  const cfg = platforms[requestedPlatform] ?? null;

  const [countdown, setCountdown] = useState(TOTAL);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!cfg) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = cfg.url;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cfg]);

  if (!cfg) return <InvalidPage />;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#05050d] overflow-hidden">

      {/* ── Aurora background ── */}
      <AuroraCanvas c1={cfg.aurora1} c2={cfg.aurora2} />

      {/* ── Subtle scanline overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
        }}
      />

      {/* ── Floating particles ── */}
      <Particles color={cfg.accent} />

      {/* ── Card ── */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          animation: mounted ? 'cardIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
          opacity: mounted ? undefined : 0,
        }}
      >
        <div
          className="rounded-[2rem] px-8 pt-10 pb-8 text-center"
          style={{
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(48px)',
            WebkitBackdropFilter: 'blur(48px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: `0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(0,0,0,0.4)`,
          }}
        >

          {/* ── Top pill label ── */}
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{
              background: `linear-gradient(90deg, ${cfg.ringFrom}22, ${cfg.ringTo}22)`,
              border: `1px solid ${cfg.accent}44`,
              color: cfg.accent,
            }}
          >
            {cfg.icon}
            {cfg.badge}
          </div>

          {/* ── Avatar ── */}
          <div
            className="relative w-24 h-24 mx-auto mb-5"
            style={{ animation: mounted ? 'avatarIn 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) both' : 'none' }}
          >
            {/* Glow ring behind avatar */}
            <div
              className="absolute inset-[-6px] rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${cfg.ringFrom}, ${cfg.ringTo}, ${cfg.ringFrom})`,
                animation: 'spin 4s linear infinite',
              }}
            />
            <div
              className="absolute inset-[3px] rounded-full"
              style={{ background: '#05050d' }}
            />
            <img
              src={cfg.profilePic}
              alt={cfg.name}
              className="absolute inset-[6px] w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-full object-cover"
            />
            {/* Verified dot */}
            <div
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px]"
              style={{
                background: `linear-gradient(135deg, ${cfg.ringFrom}, ${cfg.ringTo})`,
                border: '2.5px solid #05050d',
                animation: 'badgePop 0.5s 0.5s cubic-bezier(0.16,1,0.3,1) both',
                boxShadow: `0 0 12px ${cfg.accent}88`,
              }}
            >
              ✓
            </div>
          </div>

          {/* ── Name & handle ── */}
          <div className="mb-1">
            <h1
              className="text-2xl font-black tracking-tight text-white"
              style={{ fontFamily: "'DM Sans', 'Sora', sans-serif" }}
            >
              {cfg.name}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: cfg.accent, opacity: 0.8 }}>
              {cfg.handle}
            </p>
          </div>

          {/* ── Divider ── */}
          <div
            className="w-full h-px my-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${cfg.accent}33, transparent)`,
            }}
          />

          {/* ── Ring countdown ── */}
          <RingCountdown
            countdown={countdown}
            total={TOTAL}
            from={cfg.ringFrom}
            to={cfg.ringTo}
          />

          {/* ── Status text ── */}
          <p
            className="mb-6 text-xs tracking-wide uppercase text-white/40"
            style={{ letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace" }}
          >
            {countdown > 0
              ? `Redirecting to ${cfg.name} automatically…`
              : 'Opening now…'}
          </p>

          {/* ── CTA Button ── */}
          <a
            href={cfg.url}
            className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white font-bold text-base overflow-hidden transition-transform duration-200 hover:scale-[1.025] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${cfg.btnFrom}, ${cfg.btnTo})`,
              boxShadow: `0 8px 32px ${cfg.accent}44, inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          >
            {/* Shimmer sweep */}
            <span
              className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                backgroundSize: '200% auto',
                animation: 'shimmer 1.2s linear infinite',
              }}
            />
            <span className="relative flex items-center gap-2">
              {cfg.icon}
              এখনই Open করুন
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform duration-200 translate-x-0 group-hover:translate-x-1">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </a>

          {/* ── Footer note ── */}
          <p className="mt-5 text-[11px] text-white/20 leading-relaxed">
            আপনি{' '}
            <span className="text-white/40">mishu.dev</span>
            {' '}থেকে redirect হচ্ছেন &nbsp;·&nbsp; নিরাপদ ও ভেরিফাইড লিংক
          </p>
        </div>
      </div>

      {/* ── Keyframe for spinning conic ring ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RedirectPage;