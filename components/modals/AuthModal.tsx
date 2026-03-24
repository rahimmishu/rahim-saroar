import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Lock, User, ArrowRight, Loader2, Sparkles, Shield } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase";
import ReCAPTCHA from "react-google-recaptcha";

/* ─── Icons ─────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

/* ─── Props ──────────────────────────────────────────── */
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp]       = useState(false);
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [name, setName]               = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (isOpen) {
      setError(""); setEmail(""); setPassword(""); setName(""); setCaptchaValue(null);
      recaptchaRef.current?.reset();
    }
  }, [isOpen]);

  const handleSocialLogin = async (providerName: "google" | "facebook") => {
    setError(""); setLoading(true);
    try {
      const provider = providerName === "google" ? new GoogleAuthProvider() : new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError(err.code === "auth/popup-closed-by-user" ? "Login cancelled." : err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!captchaValue) { setError("Please verify you are not a robot! 🤖"); return; }
    setLoading(true);
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      const map: Record<string, string> = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/email-already-in-use": "Email already in use.",
        "auth/weak-password": "Password must be at least 6 chars.",
        "auth/user-not-found": "Account not found.",
        "auth/wrong-password": "Wrong password.",
      };
      setError(map[err.code] ?? err.message);
      setCaptchaValue(null);
      recaptchaRef.current?.reset();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ─────────── STYLES ─────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        /* Backdrop & card entrance */
        @keyframes am-backdrop-in { from{opacity:0} to{opacity:1} }
        @keyframes am-card-in {
          from { opacity:0; transform:translateY(28px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        /* Aurora orbs */
        @keyframes am-orb-a {
          0%,100%{transform:translate(0,0)   scale(1);  }
          33%    {transform:translate(18px,-22px) scale(1.1);}
          66%    {transform:translate(-14px,10px) scale(0.95);}
        }
        @keyframes am-orb-b {
          0%,100%{transform:translate(0,0)    scale(1);  }
          33%    {transform:translate(-20px,16px) scale(1.08);}
          66%    {transform:translate(12px,-18px) scale(0.92);}
        }
        /* Shimmer sweep on submit */
        @keyframes am-shimmer {
          0%   {transform:translateX(-100%) skewX(-12deg);}
          100% {transform:translateX(300%)  skewX(-12deg);}
        }
        /* Grid-line pulse */
        @keyframes am-grid { 0%,100%{opacity:.06} 50%{opacity:.13} }
        /* Floating particles */
        @keyframes am-particle {
          0%  {opacity:0; transform:translateY(0) scale(.8);}
          15% {opacity:1;}
          85% {opacity:1;}
          100%{opacity:0; transform:translateY(-60px) scale(1.1);}
        }
        /* Tab underline slide */
        @keyframes am-tab-slide { from{width:0} to{width:100%} }
        /* Input focus ring */
        @keyframes am-ring {
          0%  {box-shadow:0 0 0 0   rgba(99,102,241,.6);}
          100%{box-shadow:0 0 0 6px rgba(99,102,241,0);}
        }
        /* Error shake */
        @keyframes am-shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        /* Field slide-in for signup */
        @keyframes am-field-in {
          from{opacity:0;transform:translateY(-10px)}
          to  {opacity:1;transform:translateY(0)}
        }

        .am-backdrop { animation: am-backdrop-in .25s ease forwards; }
        .am-card     { animation: am-card-in .4s cubic-bezier(.22,1,.36,1) forwards; font-family:'DM Sans',sans-serif; }
        .am-title    { font-family:'Syne',sans-serif; }
        .am-orb-a    { animation: am-orb-a 8s ease-in-out infinite; }
        .am-orb-b    { animation: am-orb-b 11s ease-in-out infinite; }
        .am-grid     { animation: am-grid 4s ease-in-out infinite; }
        .am-shimmer  { animation: am-shimmer 1.8s ease .6s infinite; }
        .am-field-in { animation: am-field-in .3s ease forwards; }
        .am-shake    { animation: am-shake .4s ease; }
        .am-particle { animation: am-particle var(--dur,6s) ease-in-out var(--del,0s) infinite; }

        /* Input: custom focus */
        .am-input:focus {
          outline: none;
          border-color: rgba(99,102,241,.7);
          background: rgba(99,102,241,.06);
          animation: am-ring .4s ease forwards;
        }

        /* Social button hover */
        .am-social:hover { transform: translateY(-1px); }
        .am-social { transition: all .2s ease; }

        /* Submit hover shimmer */
        .am-submit:hover .am-shimmer { animation-play-state: running; }
        .am-submit .am-shimmer { animation-play-state: paused; }
        .am-submit:hover { transform: scale(1.015); box-shadow:0 8px 30px rgba(99,102,241,.45); }
        .am-submit { transition: transform .25s ease, box-shadow .25s ease; }

        /* Tab active underline */
        .am-tab-active::after {
          content:'';display:block;
          height:2px;margin-top:2px;border-radius:2px;
          background:linear-gradient(90deg,#6366f1,#38bdf8);
          animation: am-tab-slide .25s ease forwards;
        }
      `}</style>

      {/* ─────────── BACKDROP ─────────── */}
      <div
        className="am-backdrop fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,4,.80)", backdropFilter: "blur(18px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >

        {/* ─────────── CARD ─────────── */}
        <div
          className="am-card relative w-full max-w-[420px] overflow-hidden rounded-[28px]"
          style={{
            background: "linear-gradient(145deg,#0d0d18 0%,#08080f 100%)",
            border: "1px solid rgba(255,255,255,.07)",
            boxShadow: "0 40px 80px rgba(0,0,0,.7), 0 0 0 .5px rgba(255,255,255,.04) inset",
          }}
        >
          {/* ── Dot-grid texture ── */}
          <div
            className="absolute inset-0 pointer-events-none am-grid"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,.25) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* ── Aurora orbs ── */}
          <div className="absolute w-56 h-56 rounded-full pointer-events-none am-orb-a -top-16 -left-16"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,.22) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div className="absolute w-64 h-64 rounded-full pointer-events-none am-orb-b -bottom-20 -right-12"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,.18) 0%, transparent 70%)", filter: "blur(48px)" }} />
          <div className="absolute h-40 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none top-1/2 left-1/2 w-80"
            style={{ background: "radial-gradient(ellipse, rgba(139,92,246,.08) 0%, transparent 70%)", filter: "blur(32px)" }} />

          {/* ── Floating micro-particles ── */}
          {[
            {x:"18%",y:"72%",dur:"7s",del:"0s"},{x:"82%",y:"28%",dur:"9s",del:"1.2s"},
            {x:"55%",y:"85%",dur:"6s",del:"2s"},{x:"30%",y:"40%",dur:"8s",del:"0.6s"},
            {x:"70%",y:"60%",dur:"10s",del:"3s"},{x:"12%",y:"22%",dur:"7.5s",del:"1.8s"},
          ].map((p,i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full pointer-events-none am-particle"
              style={{ left:p.x, top:p.y, "--dur":p.dur, "--del":p.del,
                background:"radial-gradient(circle,rgba(165,180,252,.8),transparent)",
                filter:"blur(.5px)" } as React.CSSProperties} />
          ))}

          {/* ── Close ── */}
          <button
            onClick={onClose}
            className="absolute z-30 flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-full top-5 right-5 hover:scale-110"
            style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)" }}
          >
            <X size={15} className="transition-colors text-slate-400 hover:text-white" />
          </button>

          {/* ─────────── CONTENT ─────────── */}
          <div className="relative z-10 px-8 pt-10 pb-8">

            {/* ── Header ── */}
            <div className="text-center mb-7">
              {/* Icon badge */}
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-2xl blur-lg"
                  style={{background:"linear-gradient(135deg,#6366f1,#38bdf8)"}} />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl"
                  style={{background:"linear-gradient(135deg,#4f46e5,#0ea5e9)",
                    boxShadow:"0 4px 20px rgba(99,102,241,.4)"}}>
                  <Sparkles size={20} className="text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold leading-tight text-white am-title">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="mt-1.5 text-[13px]" style={{color:"#5a6480"}}>
                {isSignUp
                  ? "Join the future of tech creativity"
                  : "Sign in to your portfolio dashboard"}
              </p>
            </div>

            {/* ── Tab switcher ── */}
            <div className="flex gap-1 p-1 mb-6 rounded-xl"
              style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)"}}>
              {["Log In","Sign Up"].map((label, i) => {
                const active = (i === 1) === isSignUp;
                return (
                  <button
                    key={label}
                    onClick={() => { setIsSignUp(i === 1); setError(""); }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                      active ? "text-white am-tab-active" : "text-slate-500 hover:text-slate-300"
                    }`}
                    style={active ? {
                      background:"linear-gradient(135deg,rgba(99,102,241,.25),rgba(56,189,248,.15))",
                      boxShadow:"0 1px 8px rgba(99,102,241,.2)"
                    } : {}}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ── Social buttons ── */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <button
                onClick={() => handleSocialLogin("google")}
                className="am-social flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-xs font-semibold text-white"
                style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.09)"}}
              >
                <GoogleIcon /> Continue with Google
              </button>
              <button
                onClick={() => handleSocialLogin("facebook")}
                className="am-social flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-xs font-semibold"
                style={{background:"rgba(24,119,242,.10)",border:"1px solid rgba(24,119,242,.22)",color:"#60a5fa"}}
              >
                <FacebookIcon /> Facebook
              </button>
            </div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{background:"rgba(255,255,255,.06)"}} />
              <span className="text-[10px] font-medium tracking-widest uppercase" style={{color:"#2e3347"}}>
                or email
              </span>
              <div className="flex-1 h-px" style={{background:"rgba(255,255,255,.06)"}} />
            </div>

            {/* ── Error ── */}
            {error && (
              <div
                className={`am-shake flex items-center gap-2 px-4 py-2.5 mb-4 rounded-xl text-xs font-medium`}
                style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",color:"#f87171"}}
              >
                <span className="text-red-400">⚠</span> {error}
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Name — signup only */}
              {isSignUp && (
                <div className="relative am-field-in">
                  <User size={15} className="absolute left-3.5 top-3.5 text-slate-600 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full py-3 pl-10 pr-4 text-xs text-white transition-all am-input rounded-xl"
                    style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",
                      color:"#e2e8f0","--placeholder":"#2e3a52"} as React.CSSProperties}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-600 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full py-3 pl-10 pr-4 text-xs text-white transition-all am-input rounded-xl"
                  style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)"}}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-600 pointer-events-none" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full py-3 pl-10 pr-4 text-xs text-white transition-all am-input rounded-xl"
                  style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)"}}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center pt-1 pb-1 overflow-hidden rounded-xl">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  theme="dark"
                  sitekey="6LdRf2QsAAAAABV0r5hJeTC5nHVs79BY32bN-8c7"
                  onChange={(v) => setCaptchaValue(v)}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="am-submit relative w-full py-3.5 mt-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background:"linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#0ea5e9 100%)",
                  backgroundSize:"200% auto",
                  boxShadow:"0 4px 20px rgba(99,102,241,.30)",
                }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 w-1/3 pointer-events-none am-shimmer"
                  style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)"}} />

                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <>
                      {isSignUp ? "Create Account" : "Access Dashboard"}
                      <ArrowRight size={16} />
                    </>
                }
              </button>
            </form>

            {/* ── Footer ── */}
            <div className="mt-5 flex items-center justify-center gap-1.5">
              <Shield size={11} style={{color:"#2e3347"}} />
              <p className="text-[10px] tracking-wide" style={{color:"#2e3347"}}>
                Secured by Firebase & Google reCAPTCHA™
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;