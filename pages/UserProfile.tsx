import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  Save, User, ShoppingCart, CreditCard, Loader2,
  CheckCircle2, LogOut, ArrowLeft, Camera, Sparkles,
  Edit3, Mail, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/* ─── Avatar list ─────────────────────────────── */
const AVATAR_LIST = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/micah/svg?seed=Mishu",
  "https://api.dicebear.com/7.x/micah/svg?seed=Sara",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=CoolGuy",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Artist",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zara",
  "https://api.dicebear.com/7.x/micah/svg?seed=Neon",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Cyber",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro",
];

/* ─── Tab types ───────────────────────────────── */
type TabType = 'profile' | 'cart' | 'payments';

/* ══════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════ */
const UserProfile = () => {
  // ✅ FIX 1: Use reactive auth state instead of stale useState snapshot
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState(AVATAR_LIST[0]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  /* ── Reactive auth listener ─────────────────────── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync display fields from fresh auth object
        setName(currentUser.displayName || '');
        if (currentUser.photoURL) setPhotoURL(currentUser.photoURL);
      } else {
        // Not logged in → redirect home
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  /* ── Fetch extra data from Firestore ────────────── */
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Firestore is source of truth for avatar
          if (data.photoURL) setPhotoURL(data.photoURL);
          if (data.displayName) setName(data.displayName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setPageLoading(false);
      }
    };

    if (user) fetchUserData();
    else if (user === null) setPageLoading(false); // auth resolved, no user
  }, [user]);

  /* ── Save handler ───────────────────────────────── */
  const handleUpdateProfile = async () => {
    // ✅ FIX 2: Always use auth.currentUser (never stale state)
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('You must be logged in.');
      return;
    }

    setLoading(true);
    setSaved(false);
    try {
      // 1. Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // 2. Persist to Firestore
      await setDoc(
        doc(db, 'users', currentUser.uid),
        { displayName: name, photoURL: photoURL, updatedAt: new Date() },
        { merge: true }
      );

      // 3. Reload the auth user so auth.currentUser reflects changes
      await currentUser.reload();

      // 4. Re-sync component state from fresh auth object
      setUser(auth.currentUser);

      setSaved(true);
      toast.success('Profile updated! 🎉');

      // Navigate home after short delay
      setTimeout(() => navigate('/'), 1800);
    } catch (error: any) {
      console.error(error);
      toast.error('Update failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Loading skeleton ───────────────────────────── */
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 rounded-full border-white/10 border-t-blue-500 animate-spin" />
            <Sparkles size={20} className="absolute inset-0 m-auto text-blue-400" />
          </div>
          <p className="text-sm text-slate-400">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || 'U';

  /* ── Tab config ─────────────────────────────────── */
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile',  label: 'Profile Settings', icon: <User size={18} /> },
    { id: 'cart',     label: 'My Courses',        icon: <ShoppingCart size={18} /> },
    { id: 'payments', label: 'Payment History',   icon: <CreditCard size={18} /> },
  ];

  return (
    <>
      {/* ─── Inline styles for custom animations ─────── */}
      <style>{`
        @keyframes up-fade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .up-fade { animation: up-fade 0.45s ease forwards; }
        @keyframes avatar-pop { 0%{transform:scale(1)} 50%{transform:scale(1.18)} 100%{transform:scale(1)} }
        .avatar-pop { animation: avatar-pop 0.3s ease; }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(99,102,241,.6); }
          100% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
        }
        .save-success { animation: pulse-ring 0.6s ease forwards; }
        .avatar-btn:hover img { transform: scale(1.05); }
        .avatar-btn img { transition: transform 0.2s ease; }
        .tab-bar-item { transition: all 0.25s cubic-bezier(.22,1,.36,1); }
        .glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); }
        .profile-bg::before {
          content:'';
          position:absolute; inset:0;
          background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,.12), transparent);
          pointer-events:none;
        }
      `}</style>

      <div className="relative min-h-screen bg-[#030303] text-white pt-24 pb-16 px-4 profile-bg">

        {/* Background orb */}
        <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,.4) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-5xl mx-auto">

          {/* ── Top bar ─────────────────────────────── */}
          <div className="flex items-center justify-between mb-8 up-fade">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm transition-colors text-slate-400 hover:text-white group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Back to Home
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 transition-all border rounded-xl border-red-500/20 hover:bg-red-500/10 active:scale-95"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>

          {/* ── Page title ──────────────────────────── */}
          <div className="mb-8 up-fade" style={{ animationDelay: '0.05s' }}>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              My Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">Manage your profile, courses and activity</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

            {/* ── Sidebar ─────────────────────────── */}
            <div className="up-fade md:col-span-1" style={{ animationDelay: '0.1s' }}>

              {/* User card */}
              <div className="relative p-5 mb-4 overflow-hidden text-center border glass-card border-white/8 rounded-2xl">
                <div
                  className="absolute inset-x-0 top-0 h-20 opacity-40"
                  style={{ background: 'linear-gradient(180deg, rgba(99,102,241,.3) 0%, transparent 100%)' }}
                />
                {/* Avatar preview */}
                <div className="relative inline-block mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] bg-white mx-auto shadow-xl"
                    style={{ borderColor: 'rgba(99,102,241,.5)', boxShadow: '0 0 30px rgba(99,102,241,.3)' }}>
                    {photoURL ? (
                      <img src={photoURL} alt="Avatar" className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-2xl font-black text-white"
                        style={{ background: 'linear-gradient(135deg,#6d28d9,#2563eb)' }}>
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="absolute flex items-center justify-center w-6 h-6 rounded-full -bottom-1 -right-1"
                    style={{ background: 'linear-gradient(135deg,#6d28d9,#2563eb)' }}>
                    <Camera size={11} className="text-white" />
                  </div>
                </div>
                <p className="text-base font-bold leading-tight text-white">{name || 'User'}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate px-2">{user.email}</p>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-emerald-400">
                  <Shield size={11} /> <span>Verified account</span>
                </div>
              </div>

              {/* Nav tabs */}
              <div className="p-2 space-y-1 border glass-card border-white/8 rounded-2xl">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-bar-item w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-left
                      ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                  >
                    <span className={`${activeTab === tab.id ? 'text-blue-400' : 'text-slate-600'}`}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Content area ────────────────────── */}
            <div className="md:col-span-3 up-fade" style={{ animationDelay: '0.15s' }}>
              <div className="p-6 border glass-card border-white/8 rounded-2xl md:p-8">

                {/* ════ PROFILE TAB ════ */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center gap-3 mb-7">
                      <div className="p-2 rounded-xl"
                        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.2),rgba(139,92,246,.2))' }}>
                        <Edit3 size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Profile Details</h2>
                        <p className="text-xs text-slate-500">Choose an avatar and update your display name</p>
                      </div>
                    </div>

                    {/* ── Avatar grid ─────────────────── */}
                    <div className="mb-8">
                      <label className="flex items-center block gap-2 mb-3 text-sm font-semibold text-slate-300">
                        <Camera size={14} className="text-purple-400" />
                        Select Your Avatar
                      </label>
                      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6">
                        {AVATAR_LIST.map((avatar, index) => {
                          const isSelected = photoURL === avatar;
                          return (
                            <button
                              key={index}
                              onClick={() => setPhotoURL(avatar)}
                              className={`avatar-btn relative aspect-square rounded-2xl overflow-hidden bg-white transition-all duration-300
                                ${isSelected
                                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black scale-105 shadow-lg shadow-blue-500/30'
                                  : 'ring-1 ring-white/10 opacity-70 hover:opacity-100 hover:scale-105 hover:ring-white/30'
                                }`}
                            >
                              <img
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <CheckCircle2 size={20} className="text-white drop-shadow" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-3 text-xs text-slate-500">
                        Click any avatar to select it, then press <span className="font-medium text-blue-400">Save Changes</span>
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/6 mb-7" />

                    {/* ── Input fields ────────────────── */}
                    <div className="max-w-md space-y-5">
                      {/* Display Name */}
                      <div>
                        <label className="flex items-center block gap-2 mb-2 text-sm font-semibold text-slate-300">
                          <User size={14} className="text-purple-400" />
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3.5 text-white text-sm outline-none transition-all rounded-xl border bg-white/5 border-white/10 focus:border-blue-500/60 focus:bg-blue-500/5 placeholder:text-slate-600"
                          placeholder="Enter your display name"
                        />
                      </div>

                      {/* Email (read-only) */}
                      <div>
                        <label className="flex items-center block gap-2 mb-2 text-sm font-semibold text-slate-400">
                          <Mail size={14} className="text-slate-500" />
                          Email Address
                          <span className="ml-auto text-xs font-normal text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">Read-only</span>
                        </label>
                        <input
                          type="email"
                          value={user.email || ''}
                          disabled
                          className="w-full p-3.5 text-sm border bg-white/3 border-white/5 rounded-xl text-slate-500 cursor-not-allowed"
                        />
                      </div>

                      {/* Save button */}
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading || saved}
                        className={`relative flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed
                          ${saved ? 'bg-emerald-600' : ''}`}
                        style={saved ? {} : {
                          background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb)',
                          backgroundSize: '200% 200%',
                          boxShadow: '0 4px 20px rgba(99,102,241,.35)',
                        }}
                      >
                        {/* shimmer */}
                        {!saved && !loading && (
                          <span
                            className="absolute inset-0 w-1/3 pointer-events-none"
                            style={{
                              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)',
                              animation: 'am-shimmer 2.5s ease 1s infinite',
                            }}
                          />
                        )}
                        {loading ? (
                          <><Loader2 size={17} className="animate-spin" /> Saving…</>
                        ) : saved ? (
                          <><CheckCircle2 size={17} /> Saved! Redirecting…</>
                        ) : (
                          <><Save size={17} /> Save Changes</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* ════ CART TAB ════ */}
                {activeTab === 'cart' && (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-2xl"
                      style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.1))', border: '1px solid rgba(99,102,241,.2)' }}>
                      <ShoppingCart size={36} className="text-blue-400 opacity-60" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-200">Your Cart is Empty</h3>
                    <p className="max-w-xs mx-auto text-sm text-slate-500">
                      Upcoming courses and learning materials will appear here once available.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl border border-blue-500/20 text-blue-400 bg-blue-500/5">
                      <Sparkles size={14} /> Coming Soon
                    </div>
                  </div>
                )}

                {/* ════ PAYMENTS TAB ════ */}
                {activeTab === 'payments' && (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-2xl"
                      style={{ background: 'linear-gradient(135deg,rgba(16,185,129,.1),rgba(5,150,105,.1))', border: '1px solid rgba(16,185,129,.2)' }}>
                      <CreditCard size={36} className="text-emerald-400 opacity-60" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-200">No Transactions Yet</h3>
                    <p className="max-w-xs mx-auto text-sm text-slate-500">
                      Your purchase history and payment receipts will appear here.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl border border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                      <Shield size={14} /> Secure payments powered by Firebase
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;