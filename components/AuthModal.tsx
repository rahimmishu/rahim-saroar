import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../firebase";

// 🔥 Google Icon (SVG)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// 🔥 Facebook Icon (SVG)
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Robot Verification State
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    setCaptcha({ num1: n1, num2: n2, answer: n1 + n2 });
    setCaptchaInput("");
  };

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
      setError("");
      setEmail("");
      setPassword("");
      setName("");
      setCaptchaInput("");
    }
  }, [isOpen]);

  // 🔥 Handle Social Login (Google/Facebook)
  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    setError("");
    setLoading(true);
    try {
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ১. রোবট ভেরিফিকেশন চেক (শুধুমাত্র ইমেইল লগইনের জন্য)
    if (parseInt(captchaInput) !== captcha.answer) {
      setError("Incorrect Math Answer! 🤖");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      // ফায়ারবেস এরর হ্যান্ডলিং
      if (err.code === 'auth/invalid-credential') setError("Invalid email or password.");
      else if (err.code === 'auth/email-already-in-use') setError("Email already in use.");
      else if (err.code === 'auth/weak-password') setError("Password must be at least 6 chars.");
      else if (err.code === 'auth/user-not-found') setError("Account not found.");
      else if (err.code === 'auth/wrong-password') setError("Wrong password.");
      else setError(err.message); 
      
      generateCaptcha();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300">
      
      {/* 🔥 Premium Card Container */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden group">
        
        {/* ✨ Ambient Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-60 h-60 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute z-20 p-2 transition-all rounded-full top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 px-8 py-10">
          
          {/* Header Section */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 shadow-lg rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 shadow-blue-500/20">
              <Sparkles className="text-white animate-pulse" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {isSignUp ? "Join the Future" : "Welcome Back"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {isSignUp ? "Create your professional identity" : "Access your portfolio dashboard"}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex p-1 mb-6 border rounded-xl bg-white/5 border-white/5">
            <button
              onClick={() => { setIsSignUp(false); setError(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${!isSignUp ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${isSignUp ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign Up
            </button>
          </div>

          {/* 🔥 NEW: Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-95 shadow-lg"
            >
              <GoogleIcon /> Google
            </button>
            <button 
              onClick={() => handleSocialLogin('facebook')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/20 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-95"
            >
              <FacebookIcon /> Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-grow h-px bg-white/10"></div>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Or continue with email</span>
            <div className="flex-grow h-px bg-white/10"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 text-xs font-semibold text-center text-red-400 border border-red-500/20 bg-red-500/10 rounded-xl animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input */}
            {isSignUp && (
              <div className="relative duration-300 group animate-in slide-in-from-left-2">
                <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full py-3 text-sm text-white transition-all border outline-none bg-white/5 border-white/10 rounded-xl pl-11 pr-4 placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full py-3 text-sm text-white transition-all border outline-none bg-white/5 border-white/10 rounded-xl pl-11 pr-4 placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="password"
                placeholder="Password"
                className="w-full py-3 text-sm text-white transition-all border outline-none bg-white/5 border-white/10 rounded-xl pl-11 pr-4 placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* 🔥 Math Captcha (Only needed for email signup) */}
            <div className="flex items-center justify-between p-1 pl-3 border bg-white/5 border-white/10 rounded-xl">
               <div className="flex items-center gap-3">
                 <ShieldCheck className="text-purple-400" size={18} />
                 <span className="text-sm font-medium text-slate-300">
                   Solve: <span className="font-bold tracking-wider text-white">{captcha.num1} + {captcha.num2} = ?</span>
                 </span>
               </div>
               <input
                 type="number"
                 placeholder="Ans"
                 className="w-20 py-2 text-center text-white bg-transparent border-l outline-none border-white/10 focus:bg-white/5"
                 value={captchaInput}
                 onChange={(e) => setCaptchaInput(e.target.value)}
                 required
               />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group-hover:animate-pulse-slow"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Access Account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Decoration */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-500">
              Secured by Firebase & MathShield™
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;