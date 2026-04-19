// src/components/Preloader.tsx
// ✅ Dark theme → dark skeleton  |  Light theme → light skeleton
// ✅ Exact LiteHero layout mirror (two-column, gradient border, badge positions)
// ✅ Professional, refined design

import React, { useEffect, useState } from 'react';
import './Preloader.css';

interface PreloaderProps {
  onFinish?: () => void;
}

/* ─────────────────────────────────────────
   Detect Tailwind dark-class OR OS preference
───────────────────────────────────────── */
function getTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'dark';
  if (document.documentElement.classList.contains('dark')) return 'dark';
  if (document.documentElement.classList.contains('light')) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function Preloader({ onFinish }: PreloaderProps) {
  const [isFading, setIsFading] = useState(false);
  // ✅ Lazy initializer — first render-এই সঠিক theme পাবে, dark flash নেই
  const [theme, setTheme] = useState<'dark' | 'light'>(getTheme);

  /* Watch for runtime theme changes */
  useEffect(() => {

    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onMqChange = () => setTheme(getTheme());
    mq.addEventListener('change', onMqChange);

    return () => {
      observer.disconnect();
      mq.removeEventListener('change', onMqChange);
    };
  }, []);

  /* Fade-out timing */
  useEffect(() => {
    const t1 = setTimeout(() => setIsFading(true), 2500);
    const t2 = setTimeout(() => { if (onFinish) onFinish(); }, 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  const isDark = theme === 'dark';

  /* Badge background colours — theme-aware glassmorphic */
  const badgeDark  = isDark
    ? 'linear-gradient(135deg, rgba(30,30,60,0.92), rgba(60,20,90,0.92))'
    : 'linear-gradient(135deg, rgba(240,235,255,0.95), rgba(225,215,255,0.95))';
  const badgeGreen = isDark
    ? 'linear-gradient(135deg, rgba(20,40,30,0.92), rgba(10,80,50,0.92))'
    : 'linear-gradient(135deg, rgba(230,248,238,0.95), rgba(210,240,225,0.95))';
  const badgeWarm  = isDark
    ? 'linear-gradient(135deg, rgba(40,20,10,0.92), rgba(90,50,10,0.92))'
    : 'linear-gradient(135deg, rgba(255,245,230,0.95), rgba(255,235,200,0.95))';

  /* Neutral skel line colour label for inline label skeletons in badges */
  const labelBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)';
  const textBg  = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)';

  return (
    <div
      className={`preloader-overlay pl-bg ${isFading ? 'preloader-hidden' : ''}`}
      data-theme={theme}
    >
      <div className="relative flex flex-col w-full h-full overflow-hidden">

        {/* ══════════════════════════════
            🌌  Ambient background blobs
        ══════════════════════════════ */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="pl-blob-1" />
          <div className="pl-blob-2" />
        </div>

        {/* ══════════════════════════════
            🧭  Navbar skeleton (md+)
        ══════════════════════════════ */}
        <div className="relative z-10 hidden w-full px-6 pt-6 mx-auto max-w-7xl md:block pl-f1">
          <div className="pl-nav flex items-center justify-between px-5 py-3">
            {/* Logo */}
            <div className="skel rounded-full" style={{ width: 120, height: 28 }} />

            {/* Nav links */}
            <div className="flex items-center gap-6">
              {[72, 60, 68, 52, 64].map((w, i) => (
                <div
                  key={i}
                  className="skel rounded-full"
                  style={{ width: w, height: 12, animationDelay: `${i * 0.07}s` }}
                />
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <div className="skel rounded-full" style={{ width: 32, height: 32 }} />
              <div
                className="skel-p rounded-full"
                style={{ width: 108, height: 34 }}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            🏠  Hero skeleton — mirrors LiteHero two-column layout
        ══════════════════════════════════════════════════════════ */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-6 pt-6 pb-8 mx-auto max-w-7xl lg:flex-row lg:items-center gap-8 lg:gap-16 lg:pt-0">

          {/* ── LEFT TEXT COLUMN ─────────────────────────── */}
          <div className="flex flex-col items-center w-full text-center lg:items-start lg:text-left lg:w-1/2">

            {/* "Open to Opportunities" badge — purple tinted */}
            <div
              className="skel-p pl-f1 rounded-full mb-4"
              style={{ width: 170, height: 30 }}
            />

            {/* "Hi, I'm" */}
            <div className="pl-f2 mb-2">
              <div className="skel rounded-xl" style={{ width: 130, height: 40 }} />
            </div>

            {/* Gradient name — purple/blue/pink */}
            <div className="pl-f2 mb-3">
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  width: 210,
                  height: 46,
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(59,130,246,0.17) 50%, rgba(236,72,153,0.18) 100%)'
                    : 'linear-gradient(135deg, rgba(139,92,246,0.13) 0%, rgba(59,130,246,0.10) 50%, rgba(236,72,153,0.11) 100%)',
                  position: 'relative',
                }}
              >
                <div className="skel-p" style={{ position: 'absolute', inset: 0 }} />
              </div>
            </div>

            {/* Typing role line */}
            <div
              className="skel pl-f3 rounded-full mb-4"
              style={{ width: 180, height: 20 }}
            />

            {/* Description — 3 lines */}
            <div className="pl-f3 w-full max-w-sm lg:max-w-md mb-6 flex flex-col gap-2">
              {[92, 82, 65].map((pct, i) => (
                <div
                  key={i}
                  className="skel rounded-full"
                  style={{ width: `${pct}%`, height: 12 }}
                />
              ))}
            </div>

            {/* CTA buttons */}
            <div className="pl-f4 flex items-center gap-3 mb-6">
              {/* View Projects */}
              <div
                className="skel-p rounded-2xl"
                style={{
                  width: 140,
                  height: 44,
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(109,40,217,0.30), rgba(37,99,235,0.25))'
                    : 'linear-gradient(135deg, rgba(109,40,217,0.14), rgba(37,99,235,0.12))',
                  border: '1px solid rgba(139,92,246,0.25)',
                  boxShadow: '0 0 18px rgba(139,92,246,0.12)',
                }}
              />
              {/* Buy Me a Coffee */}
              <div
                className="skel-a rounded-2xl"
                style={{
                  width: 158,
                  height: 44,
                  background: isDark
                    ? 'rgba(251,191,36,0.10)'
                    : 'rgba(217,119,6,0.08)',
                  border: isDark
                    ? '1px solid rgba(251,191,36,0.22)'
                    : '1px solid rgba(180,90,0,0.18)',
                  boxShadow: '0 0 18px rgba(251,191,36,0.07)',
                }}
              />
            </div>

            {/* Social icons */}
            <div className="pl-f4 flex items-center gap-5">
              {[20, 20, 20, 20].map((sz, i) => (
                <div
                  key={i}
                  className="skel-mid rounded"
                  style={{ width: sz, height: sz }}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT IMAGE COLUMN ───────────────────────── */}
          <div className="relative flex justify-center w-full pl-f4 lg:w-1/2 lg:justify-end">

            {/* Glow beneath image */}
            <div
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '80%', height: '80%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(59,130,246,0.25) 50%, transparent 70%)',
                filter: 'blur(60px)',
                opacity: isDark ? 0.30 : 0.18,
                pointerEvents: 'none',
              }}
            />

            {/* ✅ px-6 on mobile gives badges room to breathe without clipping */}
            <div className="relative z-10 px-6 sm:px-8 lg:px-0 w-full flex justify-center lg:justify-end">
              <div className="relative w-52 sm:w-64 lg:w-[300px] xl:w-[340px]">

                {/* Gradient border — exact match: p-[3px] rounded-[52px] */}
                <div
                  style={{
                    padding: 3,
                    borderRadius: 52,
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #ec4899)',
                  }}
                >
                  <div
                    style={{
                      borderRadius: 50,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {/* Image placeholder — 4:5 ratio */}
                    <div
                      className="skel w-full"
                      style={{ aspectRatio: '4/5' }}
                    />
                    {/* Bottom gradient overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* ── Badge: -top-3 -left-4 (💻 Role) ── */}
                <div
                  className="pl-badge pl-b1"
                  style={{ top: -10, left: -14, background: badgeDark }}
                >
                  <span style={{ fontSize: 13 }}>💻</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="rounded-full" style={{ width: 22, height: 5, background: labelBg }} />
                    <span className="rounded-full" style={{ width: 58, height: 9, background: textBg }} />
                  </span>
                </div>

                {/* ── Badge: -bottom-3 -left-3 (🇧🇩 Based in) ── */}
                <div
                  className="pl-badge pl-b2"
                  style={{ bottom: -10, left: -10, background: badgeGreen }}
                >
                  <span style={{ fontSize: 13 }}>🇧🇩</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="rounded-full" style={{ width: 28, height: 5, background: labelBg }} />
                    <span className="rounded-full" style={{ width: 64, height: 9, background: textBg }} />
                  </span>
                </div>

                {/* ── Badge: top-1/2 -right-4 (🤖 Loves) ── */}
                <div
                  className="pl-badge pl-b3"
                  style={{ top: '50%', right: -14, transform: 'translateY(-50%)', background: badgeWarm }}
                >
                  <span style={{ fontSize: 13 }}>🤖</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="rounded-full" style={{ width: 22, height: 5, background: labelBg }} />
                    <span className="rounded-full" style={{ width: 50, height: 9, background: textBg }} />
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}