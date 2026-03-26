import React, { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   PrivacyPage — Redesigned Premium Edition
   Aesthetic: Dark editorial / fintech luxury
   ───────────────────────────────────────────── */

const sections = [
  {
    id: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: 'Information We Collect',
    items: [
      { label: 'Account Information', desc: 'Basic profile data securely provided by authentication services for premium sign-in.' },
      { label: 'Usage & Performance', desc: 'Anonymous metrics and system status logs to continuously optimize platform speed.' },
      { label: 'Cookies & Local State', desc: 'Local storage for user preferences like Dark/Light mode — nothing more.' },
    ],
  },
  {
    id: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    title: 'How We Use Your Data',
    items: [
      { label: 'Performance', desc: 'To maintain and improve website speed and reliability.' },
      { label: 'Authentication', desc: 'To manage secure user sessions and logins.' },
      { label: 'Communication', desc: 'To respond to queries submitted via contact forms.' },
    ],
  },
  {
    id: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
    title: 'Third-Party Services',
    items: [
      { label: 'Firebase', desc: 'Backend database and secure authentication infrastructure.' },
      { label: 'Vercel', desc: 'Website hosting, deployment, and edge analytics.' },
    ],
  },
  {
    id: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
    title: 'Telegram Bot — Forex Rahim',
    items: [
      { label: 'No Public Data Collection', desc: 'Ultimate Bot V9.0 does not collect or process any public user data.' },
      { label: 'Private Operation', desc: 'Operates strictly as a private automated execution engine linked to the Admin\'s MT5 account.' },
    ],
  },
];

const PrivacyPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.65s ease ${i * 0.08}s, transform 0.65s ease ${i * 0.08}s`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        .privacy-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background-color: #080b10;
          color: #e2e8f0;
          position: relative;
          overflow-x: hidden;
        }

        .privacy-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 80% 10%, rgba(56, 189, 248, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        .content-wrap {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 96px 24px 80px;
        }

        /* ── Header ── */
        .header-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.18);
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 24px;
        }

        .header-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }

        .header-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.4rem, 6vw, 3.8rem);
          line-height: 1.1;
          color: #f1f5f9;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .header-title em {
          font-style: italic;
          color: #38bdf8;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .meta-badge {
          font-size: 12px;
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.07);
          border: 1px solid rgba(148, 163, 184, 0.12);
          padding: 5px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .meta-dot {
          width: 4px;
          height: 4px;
          background: #64748b;
          border-radius: 50%;
        }

        /* ── Intro Card ── */
        .intro-card {
          margin-top: 48px;
          padding: 28px 32px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }

        .intro-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
        }

        .intro-card p {
          font-size: 16px;
          line-height: 1.8;
          color: #94a3b8;
          margin: 0;
        }

        .intro-card strong {
          color: #f1f5f9;
          font-weight: 600;
        }

        /* ── Section Grid ── */
        .sections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 20px;
        }

        @media (max-width: 640px) {
          .sections-grid { grid-template-columns: 1fr; }
        }

        /* ── Section Card ── */
        .section-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(148, 163, 184, 0.08);
          border-radius: 16px;
          padding: 24px;
          transition: border-color 0.3s, background 0.3s, transform 0.3s;
          cursor: default;
        }

        .section-card:hover {
          border-color: rgba(56, 189, 248, 0.22);
          background: rgba(56, 189, 248, 0.03);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.07);
        }

        .card-num {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #475569;
          font-variant-numeric: tabular-nums;
        }

        .card-icon-wrap {
          width: 34px;
          height: 34px;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          flex-shrink: 0;
        }

        .card-title {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .card-items {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .card-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .item-bullet {
          width: 5px;
          height: 5px;
          background: #38bdf8;
          border-radius: 50%;
          margin-top: 7px;
          flex-shrink: 0;
          opacity: 0.7;
        }

        .item-text { flex: 1; }

        .item-label {
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 2px;
        }

        .item-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.6;
        }

        /* ── Security Highlight ── */
        .security-card {
          margin-top: 20px;
          padding: 28px 32px;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(129, 140, 248, 0.05) 100%);
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 16px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .security-icon-wrap {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.15));
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          flex-shrink: 0;
        }

        .security-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #38bdf8;
          margin-bottom: 6px;
        }

        .security-title {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #e2e8f0;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .security-desc {
          font-size: 14px;
          line-height: 1.75;
          color: #64748b;
          margin: 0;
        }

        /* ── Contact ── */
        .contact-card {
          margin-top: 20px;
          padding: 28px 32px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(148, 163, 184, 0.08);
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .contact-info {}

        .contact-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 6px;
        }

        .contact-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #e2e8f0;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        .contact-desc {
          font-size: 13.5px;
          color: #64748b;
          max-width: 420px;
          line-height: 1.65;
          margin: 0;
        }

        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          padding: 11px 22px;
          border-radius: 10px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .contact-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        /* ── Divider ── */
        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(148,163,184,0.1), transparent);
          margin: 48px 0 0;
        }

        .footer-note {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: #334155;
        }

        .footer-note span {
          color: #38bdf8;
        }
      `}</style>

      <div className="privacy-root" ref={containerRef}>
        <div className="grid-bg" />

        <div className="content-wrap">

          {/* ── Header ── */}
          <div data-reveal>
            <div className="header-eyebrow">
              <span className="header-dot" />
              Legal Document
            </div>
            <h1 className="header-title">
              Privacy <em>Policy</em>
            </h1>
            <div className="header-meta">
              <span className="meta-badge">
                <span className="meta-dot" />
                Effective Date: March 26, 2026
              </span>
              <span className="meta-badge">
                <span className="meta-dot" />
                rahim-saroar.vercel.app
              </span>
            </div>
          </div>

          {/* ── Intro Card ── */}
          <div className="intro-card" data-reveal>
            <p>
              Welcome to the personal portfolio and algorithmic tools platform of{' '}
              <strong>Rahim Saroar Mishu</strong>. This Privacy Policy explains how information is
              collected, used, and protected when you visit this website or interact with personal
              tools — including the <strong>Forex Rahim</strong> Telegram bot.
            </p>
          </div>

          {/* ── Sections Grid ── */}
          <div className="sections-grid" style={{ marginTop: '20px' }}>
            {sections.map((sec) => (
              <div className="section-card" key={sec.id} data-reveal>
                <div className="card-header">
                  <span className="card-num">{sec.id}</span>
                  <div className="card-icon-wrap">{sec.icon}</div>
                  <span className="card-title">{sec.title}</span>
                </div>
                <div className="card-items">
                  {sec.items.map((item, i) => (
                    <div className="card-item" key={i}>
                      <span className="item-bullet" />
                      <div className="item-text">
                        <div className="item-label">{item.label}</div>
                        <div className="item-desc">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Security ── */}
          <div className="security-card" data-reveal>
            <div className="security-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
              <div className="security-label">Section 05</div>
              <div className="security-title">Security</div>
              <p className="security-desc">
                Standard industry protocols are implemented to protect any data handled by this
                site. No method of transmission over the internet or electronic storage is 100%
                secure — but your data is treated with the utmost care.
              </p>
            </div>
          </div>

          {/* ── Contact ── */}
          <div className="contact-card" data-reveal>
            <div className="contact-info">
              <div className="contact-label">Section 06</div>
              <div className="contact-title">Questions or Feedback?</div>
              <p className="contact-desc">
                For any questions or suggestions about this Privacy Policy, reach out through the
                Contact section on the website.
              </p>
            </div>
            <a href="#contact" className="contact-btn">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
              </svg>
              Contact Me
            </a>
          </div>

          {/* ── Footer ── */}
          <div className="divider-line" data-reveal />
          <div className="footer-note" data-reveal>
            © 2026 <span>Rahim Saroar Mishu</span>. All rights reserved. Privacy Policy v1.0
          </div>

        </div>
      </div>
    </>
  );
};

export default PrivacyPage;