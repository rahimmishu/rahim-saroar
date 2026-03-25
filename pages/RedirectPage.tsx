import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

// ── Local profile images (alada alada platform er jonno)
import telegramProfilePic from '../assets/images/telegram_profile.png';
import facebookProfilePic from '../assets/images/facebook_cover.png';
import redirectLogo from '../assets/images/redirect_logo.png';

/* ─────────────────────────────────────────────
   PLATFORM CONFIG
───────────────────────────────────────────── */
interface PlatformConfig {
  name: string;
  fullName: string;
  handle: string;
  url: string;
  profilePic: string;
  accent: string;
  gradientStart: string;
  gradientEnd: string;
  glowColor: string;
  bgDark: string;
  bgDarker: string;
  particleColor: string;
  icon: ReactNode;
  badge: string;
  description: string;
  followers: string;
}

const platforms: Record<string, PlatformConfig> = {
  telegram: {
    name: 'Telegram',
    fullName: 'Rahim Saroar Mishu',
    handle: '@rahim_saroar_mishu',
    url: 'https://t.me/rahim_saroar_mishu',
    profilePic: telegramProfilePic,
    accent: '#24A1DE',
    gradientStart: '#0B2540',
    gradientEnd: '#0A1628',
    glowColor: 'rgba(36,161,222,0.35)',
    bgDark: '#061220',
    bgDarker: '#030C18',
    particleColor: '#24A1DE',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    badge: 'Official Channel',
    description: 'টেলিগ্রামে Join করুন — Exclusive content, updates & more',
    followers: '2.4K+ Members',
  },
  facebook: {
    name: 'Facebook',
    fullName: 'Rahim Saroar Mishu',
    handle: 'rahimsaroar',
    url: 'https://www.facebook.com/rahimsaroar',
    profilePic: facebookProfilePic,
    accent: '#1877F2',
    gradientStart: '#0F1B35',
    gradientEnd: '#0A1020',
    glowColor: 'rgba(24,119,242,0.35)',
    bgDark: '#080F20',
    bgDarker: '#040810',
    particleColor: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
    badge: 'Verified Profile',
    description: 'ফেসবুকে Follow করুন — Latest updates, posts & activities',
    followers: '9K+ Followers',
  },
};

/* ─────────────────────────────────────────────
   ANIMATED BACKGROUND ORBS
───────────────────────────────────────────── */
const BackgroundOrbs: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '60%',
        height: '60%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        animation: 'orbFloat1 12s ease-in-out infinite',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '55%',
        height: '55%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
        animation: 'orbFloat2 15s ease-in-out infinite',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '60%',
        width: '30%',
        height: '30%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}0e 0%, transparent 70%)`,
        animation: 'orbFloat3 9s ease-in-out infinite',
      }}
    />
  </div>
);

/* ─────────────────────────────────────────────
   GRID LINES BACKGROUND
───────────────────────────────────────────── */
const GridLines: React.FC<{ color: string }> = ({ color }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `
        linear-gradient(${color}08 1px, transparent 1px),
        linear-gradient(90deg, ${color}08 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }}
  />
);

/* ─────────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────────── */
const FloatingDots: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: `${Math.random() * 2.5 + 1}px`,
          height: `${Math.random() * 2.5 + 1}px`,
          borderRadius: '50%',
          background: color,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0,
          animation: `particleRise ${5 + Math.random() * 8}s ${Math.random() * 6}s ease-in infinite`,
        }}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   RING COUNTDOWN
───────────────────────────────────────────── */
interface RingProps {
  countdown: number;
  total: number;
  accent: string;
}

const RingCountdown: React.FC<RingProps> = ({ countdown, total, accent }) => {
  const R = 34;
  const C = 2 * Math.PI * R;
  const progress = (countdown / total) * C;

  return (
    <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 80 80"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
      >
        <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${C}`}
          style={{
            filter: `drop-shadow(0 0 6px ${accent}88)`,
            transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {countdown}
        </span>
        <span
          style={{
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '3px',
          }}
        >
          sec
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STAT PILL
───────────────────────────────────────────── */
const StatPill: React.FC<{ icon: string; label: string; accent: string }> = ({ icon, label, accent }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '999px',
      background: `${accent}12`,
      border: `1px solid ${accent}28`,
      fontSize: '12px',
      color: accent,
      fontWeight: 600,
      letterSpacing: '0.01em',
    }}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </div>
);

/* ─────────────────────────────────────────────
   INVALID PAGE
───────────────────────────────────────────── */
const InvalidPage: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050510',
      fontFamily: 'sans-serif',
    }}
  >
    <div
      style={{
        textAlign: 'center',
        padding: '48px 40px',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        maxWidth: '380px',
      }}
    >
      <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚠️</div>
      <h1 style={{ color: '#f87171', fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>
        Invalid Link
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.7 }}>
        সঠিক প্ল্যাটফর্ম পাওয়া যায়নি।
        <br />
        <code
          style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '11px',
          }}
        >
          /link?platform=telegram
        </code>
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const TOTAL = 5;

const RedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedPlatform = (searchParams.get('platform') || '').toLowerCase();
  const cfg = platforms[requestedPlatform] ?? null;

  const [countdown, setCountdown] = useState(TOTAL);
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse 120% 100% at 50% -10%, ${cfg.gradientStart} 0%, ${cfg.bgDarker} 60%)`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
      }}
    >

      {/* ── Background layers ── */}
      <GridLines color={cfg.accent} />
      <BackgroundOrbs color={cfg.accent} />
      <FloatingDots color={cfg.particleColor} />

      {/* ── Top subtle bar ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)`,
          zIndex: 50,
          opacity: 0.8,
        }}
      />

      {/* ── Redirect logo top-left ── */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '24px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}
      >
        <img
          src={redirectLogo}
          alt="mishu.dev"
          style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          mishu.dev
        </span>
      </div>

      {/* ── Secure badge top-right ── */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}
      >
        <span style={{ fontSize: '11px' }}>🔒</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          Verified Link
        </span>
      </div>

      {/* ── Main card ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          margin: '0 16px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
          transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
          zIndex: 10,
        }}
      >

        {/* Outer glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-1px',
            borderRadius: '28px',
            background: `linear-gradient(135deg, ${cfg.accent}40, transparent 50%, ${cfg.accent}20)`,
            zIndex: -1,
          }}
        />

        <div
          style={{
            borderRadius: '26px',
            padding: '36px 32px 28px',
            background: `linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)`,
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: `
              0 48px 120px rgba(0,0,0,0.7),
              0 0 0 1px rgba(0,0,0,0.5),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
          }}
        >

          {/* ── Platform badge ── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                background: `linear-gradient(135deg, ${cfg.accent}20, ${cfg.accent}08)`,
                border: `1px solid ${cfg.accent}35`,
                color: cfg.accent,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              {cfg.icon}
              {cfg.badge}
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: cfg.accent,
                  animation: 'blink 1.5s ease-in-out infinite',
                  boxShadow: `0 0 6px ${cfg.accent}`,
                }}
              />
            </div>
          </div>

          {/* ── Profile section ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>

            {/* Avatar with ring */}
            <div
              style={{
                position: 'relative',
                width: '110px',
                height: '110px',
                marginBottom: '18px',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(0.7)',
                transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s',
              }}
            >
              {/* Spinning gradient ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-3px',
                  borderRadius: '50%',
                  background: `conic-gradient(${cfg.accent}, ${cfg.accent}44, ${cfg.accent})`,
                  animation: 'spinRing 3s linear infinite',
                  filter: `blur(0px)`,
                }}
              />
              {/* Dark gap between ring and image */}
              <div
                style={{
                  position: 'absolute',
                  inset: '3px',
                  borderRadius: '50%',
                  background: cfg.bgDarker,
                  zIndex: 1,
                }}
              />
              {/* Profile picture */}
              <img
                src={imgError ? `https://ui-avatars.com/api/?name=Rahim+Saroar+Mishu&background=${cfg.accent.replace('#', '')}&color=fff&size=200` : cfg.profilePic}
                alt={cfg.fullName}
                onError={() => setImgError(true)}
                style={{
                  position: 'absolute',
                  inset: '6px',
                  width: 'calc(100% - 12px)',
                  height: 'calc(100% - 12px)',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  zIndex: 2,
                }}
              />
              {/* Glow under avatar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70%',
                  height: '20px',
                  borderRadius: '50%',
                  background: cfg.accent,
                  filter: 'blur(16px)',
                  opacity: 0.25,
                  zIndex: 0,
                }}
              />
              {/* Verified checkmark */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: cfg.accent,
                  border: `2.5px solid ${cfg.bgDarker}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  zIndex: 3,
                  boxShadow: `0 0 12px ${cfg.accent}66`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'scale(1)' : 'scale(0)',
                  transition: 'opacity 0.4s ease 0.5s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.5s',
                }}
              >
                ✓
              </div>
            </div>

            {/* Name */}
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: '0 0 4px',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {cfg.fullName}
            </h1>

            {/* Handle */}
            <p
              style={{
                fontSize: '13px',
                color: cfg.accent,
                fontWeight: 500,
                margin: '0 0 12px',
                opacity: 0.85,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {cfg.handle}
            </p>

            {/* Followers pill */}
            <StatPill icon="👥" label={cfg.followers} accent={cfg.accent} />
          </div>

          {/* ── Description ── */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
              margin: '0 0 24px',
              padding: '14px 16px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {cfg.description}
          </p>

          {/* ── Divider with countdown ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '22px',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${cfg.accent}25, transparent)`,
              }}
            />

            {/* Ring countdown */}
            <RingCountdown countdown={countdown} total={TOTAL} accent={cfg.accent} />

            <div
              style={{
                flex: 1,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${cfg.accent}25, transparent)`,
              }}
            />
          </div>

          {/* Countdown label */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              margin: '0 0 20px',
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {countdown > 0 ? `Auto-redirect in ${countdown}s…` : 'Opening now…'}
          </p>

          {/* ── CTA Button ── */}
          <a
            href={cfg.url}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '16px 24px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}cc)`,
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: `0 8px 32px ${cfg.glowColor}, inset 0 1px 0 rgba(255,255,255,0.2)`,
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px) scale(1.01)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 14px 40px ${cfg.glowColor}, inset 0 1px 0 rgba(255,255,255,0.2)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0) scale(1)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 32px ${cfg.glowColor}, inset 0 1px 0 rgba(255,255,255,0.2)`;
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px) scale(1.01)';
            }}
          >
            {/* Shimmer */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                backgroundSize: '200% auto',
                animation: 'shimmer 2s linear infinite',
              }}
            />
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {cfg.icon}
              এখনই Open করুন
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </a>

          {/* ── Footer ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
              🔒 mishu.dev থেকে redirect হচ্ছেন
            </span>
            <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '11px' }}>·</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
              নিরাপদ ও ভেরিফাইড লিংক
            </span>
          </div>
        </div>
      </div>

      {/* ── Global keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 40px) scale(1.04); }
          66% { transform: translate(25px, -15px) scale(0.96); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 25px); }
        }
        @keyframes particleRise {
          0%   { opacity: 0; transform: translateY(0) scale(1); }
          20%  { opacity: 0.8; }
          80%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-100px) scale(0.3); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%  { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default RedirectPage;