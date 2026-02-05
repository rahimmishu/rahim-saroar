import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ১. রোবট ভেরিফিকেশন চেক
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
      else setError(err.message); // অন্যান্য এরর (যেমন API Key সমস্যা)
      
      generateCaptcha();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300">
      
      {/* 🔥 Premium Card Container */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden group">
        
        {/* ✨ Ambient Glow Effects (Background Blobs) */}
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
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 shadow-lg rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 shadow-blue-500/20">
              <Sparkles className="text-white animate-pulse" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {isSignUp ? "Join the Future" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {isSignUp ? "Create your professional identity" : "Access your portfolio dashboard"}
            </p>
          </div>

          {/* Toggle Switch (Sign In / Sign Up) */}
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

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-6 text-xs font-semibold text-center text-red-400 border border-red-500/20 bg-red-500/10 rounded-xl animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input (Only for Sign Up) */}
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

            {/* 🔥 Glassy Math Captcha */}
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