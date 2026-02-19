// ============================================================
// components/PhotoGallery.tsx
// ✅ Photos fetched from /api/gallery (Upstash Redis)
// ✅ Admin uploads to Cloudinary directly from browser
// ✅ Admin auth via Firebase ID token
// ✅ Delete removes from Redis + Cloudinary
// ✅ Masonry grid · Lightbox · Dark/Light mode
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera, X, Instagram, Plus, Trash2, Upload,
  LogIn, Loader2, ImageOff, Shield, AlertCircle,
  CheckCircle2, Link2, ZoomIn, LogOut,
} from 'lucide-react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

// ── Env vars (set in .env.local + Vercel dashboard) ─────────
const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
const ADMIN_EMAIL              = import.meta.env.VITE_GALLERY_ADMIN_EMAIL || 'rahimsaroarmishu@gmail.com';

// ── Types ────────────────────────────────────────────────────
interface Photo {
  id: string;
  src: string;
  caption: string;
  alt: string;
  publicId?: string;
  createdAt?: number;
}

// ── API helpers ──────────────────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function getAuthHeader(user: User): Promise<{ Authorization: string }> {
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// ── Cloudinary direct upload ─────────────────────────────────
async function uploadToCloudinary(
  file: File,
  onProgress: (pct: number) => void
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'gallery');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        reject(new Error('Cloudinary upload failed.'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload.')));
    xhr.send(formData);
  });
}

// ============================================================
// Main Component
// ============================================================
export default function PhotoGallery() {
  // ── Data state ───────────────────────────────────────────
  const [photos,    setPhotos]    = useState<Photo[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [fetchErr,  setFetchErr]  = useState('');

  // ── Auth state ───────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  // ── Login modal ──────────────────────────────────────────
  const [showLogin,   setShowLogin]   = useState(false);
  const [loginEmail,  setLoginEmail]  = useState('');
  const [loginPw,     setLoginPw]     = useState('');
  const [loginErr,    setLoginErr]    = useState('');
  const [loginBusy,   setLoginBusy]   = useState(false);

  // ── Add modal ────────────────────────────────────────────
  const [showAdd,     setShowAdd]     = useState(false);
  const [addMode,     setAddMode]     = useState<'upload' | 'url'>('upload');
  const [caption,     setCaption]     = useState('');
  const [altText,     setAltText]     = useState('');
  const [urlInput,    setUrlInput]    = useState('');
  const [file,        setFile]        = useState<File | null>(null);
  const [preview,     setPreview]     = useState('');
  const [progress,    setProgress]    = useState(0);
  const [addBusy,     setAddBusy]     = useState(false);
  const [addErr,      setAddErr]      = useState('');
  const [addOk,       setAddOk]       = useState(false);

  // ── Delete confirm ───────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);
  const [deleteBusy,   setDeleteBusy]   = useState(false);

  // ── Lightbox ─────────────────────────────────────────────
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── Auth listener ────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setCurrentUser);
    return unsub;
  }, []);

  // ── Fetch photos ─────────────────────────────────────────
  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setFetchErr('');
    try {
      const data = await apiFetch('/api/gallery');
      setPhotos(data.photos ?? []);
    } catch (e: any) {
      setFetchErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  // ── Keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox(null);
        setShowAdd(false);
        setShowLogin(false);
        setDeleteTarget(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Login ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    setLoginBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPw);
      if (cred.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setLoginErr('This account is not authorized as admin.');
      } else {
        setShowLogin(false);
        setLoginEmail('');
        setLoginPw('');
      }
    } catch {
      setLoginErr('Invalid email or password.');
    } finally {
      setLoginBusy(false);
    }
  };

  // ── Add photo ────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddErr('');
    setAddOk(false);
    if (!caption.trim())                         return setAddErr('Caption is required.');
    if (addMode === 'upload' && !file)           return setAddErr('Please select an image file.');
    if (addMode === 'url' && !urlInput.trim())   return setAddErr('Please enter an image URL.');

    setAddBusy(true);
    try {
      let finalSrc = urlInput.trim();
      let publicId: string | undefined;

      if (addMode === 'upload' && file) {
        setProgress(0);
        const res = await uploadToCloudinary(file, setProgress);
        finalSrc  = res.url;
        publicId  = res.publicId;
      }

      const headers = await getAuthHeader(currentUser!);
      await apiFetch('/api/gallery', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          src     : finalSrc,
          caption : caption.trim(),
          alt     : altText.trim() || caption.trim(),
          ...(publicId ? { publicId } : {}),
        }),
      });

      setAddOk(true);
      await fetchPhotos();
      setTimeout(() => { setShowAdd(false); resetAdd(); }, 1200);
    } catch (err: any) {
      setAddErr(err.message || 'Failed to add photo. Please try again.');
    } finally {
      setAddBusy(false);
    }
  };

  const resetAdd = () => {
    setCaption(''); setAltText(''); setUrlInput('');
    setFile(null); setPreview(''); setProgress(0);
    setAddErr(''); setAddOk(false); setAddMode('upload');
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Delete photo ─────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget || !currentUser) return;
    setDeleteBusy(true);
    try {
      const headers = await getAuthHeader(currentUser);
      await apiFetch(`/api/gallery/${deleteTarget.id}`, { method: 'DELETE', headers });
      setDeleteTarget(null);
      await fetchPhotos();
    } catch {
      /* silent — photo list will stay consistent */
    } finally {
      setDeleteBusy(false);
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0a0a0a] transition-colors duration-300">

      {/* ════ HEADER ════ */}
      <header className="sticky top-0 z-40 bg-[#f8f7f4]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between max-w-6xl px-5 py-4 mx-auto">

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-500/30">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Life in <em className="not-italic text-violet-600 dark:text-violet-400">Frames</em>
              </h1>
              <p className="text-[11px] text-slate-400 dark:text-neutral-600 font-medium">
                {loading ? '...' : `${photos.length} photo${photos.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => { resetAdd(); setShowAdd(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/25"
              >
                <Plus size={15} />
                <span>Add Photo</span>
              </button>
            )}

            {isAdmin ? (
              <button
                onClick={() => signOut(auth)}
                title="Sign out"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-neutral-400 hover:border-red-400 hover:text-red-500 text-sm font-medium transition-all"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => { setLoginErr(''); setShowLogin(true); }}
                title="Admin login"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
              >
                <LogIn size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ════ GALLERY ════ */}
      <main className="max-w-6xl px-5 py-8 mx-auto">

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-40">
            <div className="relative">
              <div className="w-12 h-12 border-2 rounded-full border-violet-200 dark:border-violet-900 border-t-violet-600 animate-spin" />
            </div>
            <p className="text-sm text-slate-400 dark:text-neutral-500">Loading gallery…</p>
          </div>
        )}

        {!loading && fetchErr && (
          <div className="flex flex-col items-center justify-center gap-3 py-32 text-center">
            <AlertCircle className="text-red-400" size={36} />
            <p className="text-sm text-slate-500 dark:text-neutral-400">{fetchErr}</p>
            <button onClick={fetchPhotos} className="px-4 py-2 text-sm transition-colors rounded-lg bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800">
              Retry
            </button>
          </div>
        )}

        {!loading && !fetchErr && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-40 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 dark:bg-neutral-900">
              <ImageOff className="text-slate-300 dark:text-neutral-700" size={36} />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-neutral-300">No photos yet</p>
              <p className="mt-1 text-sm text-slate-400 dark:text-neutral-600">
                {isAdmin ? 'Click "Add Photo" to get started.' : 'Check back soon.'}
              </p>
            </div>
          </div>
        )}

        {!loading && !fetchErr && photos.length > 0 && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 [column-gap:12px]">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className="relative mb-3 overflow-hidden cursor-pointer break-inside-avoid rounded-2xl group"
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => !isAdmin && setLightbox(photo)}
              >
                {/* Image */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] will-change-transform bg-slate-100 dark:bg-neutral-900"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.src = 'https://placehold.co/400x300/1c1c1e/555?text=Not+Found';
                  }}
                />

                {/* Caption overlay */}
                <div className="absolute inset-0 flex items-end justify-between p-3 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100">
                  <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                    {photo.caption}
                  </span>
                  {!isAdmin && (
                    <ZoomIn size={16} className="text-white/70" />
                  )}
                </div>

                {/* Admin: delete button */}
                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(photo); }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-xl bg-red-600/90 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm z-10 active:scale-90"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Social link */}
        <div className="pt-8 text-center border-t mt-14 border-black/5 dark:border-white/5">
          <a
            href="https://www.facebook.com/rahimsaroar"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm transition-colors text-slate-400 dark:text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <Instagram size={15} />
            See more on Facebook
          </a>
        </div>
      </main>

      {/* ════ LIGHTBOX ════ */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/96 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute flex items-center justify-center w-10 h-10 text-white transition-all duration-200 rounded-full top-5 right-5 bg-white/10 hover:bg-red-600 hover:rotate-90"
          >
            <X size={18} />
          </button>
          <div className="flex flex-col items-center w-full max-w-4xl gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <span className="text-sm font-medium text-white/50">{lightbox.caption}</span>
          </div>
        </div>
      )}

      {/* ════ ADMIN LOGIN MODAL ════ */}
      {showLogin && (
        <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-3xl shadow-2xl w-full max-w-[360px] p-8">

            <button
              onClick={() => setShowLogin(false)}
              className="absolute p-2 transition-colors duration-200 top-4 right-4 text-slate-300 dark:text-neutral-600 hover:text-red-500 hover:rotate-90"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              <div className="flex items-center justify-center shadow-xl w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-500/30">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Access</h2>
                <p className="text-xs text-slate-400 dark:text-neutral-500 mt-0.5">Sign in to manage your gallery</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full px-4 py-3 text-sm transition-all border rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-300 dark:placeholder:text-neutral-600"
              />
              <input
                type="password"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-4 py-3 text-sm transition-all border rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-300 dark:placeholder:text-neutral-600"
              />

              {loginErr && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-950/40 px-3 py-2.5 rounded-xl border border-red-100 dark:border-red-900/50">
                  <AlertCircle size={13} className="shrink-0" />
                  {loginErr}
                </div>
              )}

              <button
                type="submit"
                disabled={loginBusy}
                className="w-full flex items-center justify-center gap-2 py-3 mt-1 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20"
              >
                {loginBusy ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                {loginBusy ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ════ ADD PHOTO MODAL ════ */}
      {showAdd && isAdmin && (
        <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-3xl shadow-2xl w-full max-w-[440px] p-8 my-4">

            <button
              onClick={() => { setShowAdd(false); resetAdd(); }}
              className="absolute p-2 transition-colors duration-200 top-4 right-4 text-slate-300 dark:text-neutral-600 hover:text-red-500 hover:rotate-90"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-7">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950">
                <Plus className="text-violet-600 dark:text-violet-400" size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Add New Photo</h2>
                <p className="text-xs text-slate-400 dark:text-neutral-500">Upload file or paste URL</p>
              </div>
            </div>

            {/* Mode toggle */}
            <div className="flex p-1 mb-6 bg-slate-100 dark:bg-white/5 rounded-xl">
              {(['upload', 'url'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => { setAddMode(mode); setPreview(''); setUrlInput(''); setFile(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    addMode === mode
                      ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 dark:text-neutral-600 hover:text-slate-600 dark:hover:text-neutral-400'
                  }`}
                >
                  {mode === 'upload' ? <Upload size={14} /> : <Link2 size={14} />}
                  {mode === 'upload' ? 'Upload File' : 'Image URL'}
                </button>
              ))}
            </div>

            <form onSubmit={handleAdd} className="flex flex-col gap-4">

              {/* Upload dropzone */}
              {addMode === 'upload' && (
                <div>
                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/*"
                    id="photo-file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setFile(f);
                      const reader = new FileReader();
                      reader.onload = () => setPreview(reader.result as string);
                      reader.readAsDataURL(f);
                    }}
                  />
                  <label
                    htmlFor="photo-file"
                    className="flex flex-col items-center justify-center w-full overflow-hidden transition-all border-2 border-dashed cursor-pointer h-44 border-slate-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-600 rounded-2xl group"
                  >
                    {preview ? (
                      <img src={preview} alt="preview" className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 transition-colors text-slate-300 dark:text-neutral-700 group-hover:text-violet-400">
                        <Upload size={28} />
                        <span className="text-sm font-medium">Click to select image</span>
                        <span className="text-xs">JPG, PNG, WebP, GIF</span>
                      </div>
                    )}
                  </label>

                  {addBusy && progress > 0 && progress < 100 && (
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Uploading to Cloudinary…</span>
                        <span className="font-semibold text-violet-600">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-200 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* URL input */}
              {addMode === 'url' && (
                <div className="space-y-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => { setUrlInput(e.target.value); setPreview(e.target.value); }}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-3 text-sm transition-all border rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-300 dark:placeholder:text-neutral-600"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="url preview"
                      className="object-cover w-full h-40 border rounded-xl border-slate-100 dark:border-white/8"
                      onError={() => setPreview('')}
                    />
                  )}
                </div>
              )}

              {/* Caption */}
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption (e.g. Travel, Profile, Workspace)"
                className="w-full px-4 py-3 text-sm transition-all border rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-300 dark:placeholder:text-neutral-600"
              />

              {/* Alt text */}
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Alt text for SEO (optional)"
                className="w-full px-4 py-3 text-sm transition-all border rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-300 dark:placeholder:text-neutral-600"
              />

              {/* Error */}
              {addErr && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-950/40 px-3 py-2.5 rounded-xl border border-red-100 dark:border-red-900/50">
                  <AlertCircle size={13} className="shrink-0" />
                  {addErr}
                </div>
              )}

              {/* Success */}
              {addOk && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                  <CheckCircle2 size={13} className="shrink-0" />
                  Photo added to gallery!
                </div>
              )}

              <button
                type="submit"
                disabled={addBusy}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20"
              >
                {addBusy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {addBusy ? (progress > 0 ? `Uploading ${progress}%…` : 'Adding…') : 'Add to Gallery'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ════ DELETE CONFIRM ════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-3xl shadow-2xl w-full max-w-[340px] p-7">
            <div className="flex flex-col items-center gap-4 mb-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 w-13 h-13 rounded-2xl bg-red-50 dark:bg-red-950">
                <Trash2 className="text-red-500" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Delete Photo?</h3>
                <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">
                  "<strong className="text-slate-600 dark:text-neutral-300">{deleteTarget.caption}</strong>" will be permanently deleted from the gallery and Cloudinary.
                </p>
              </div>
              <img
                src={deleteTarget.src}
                alt={deleteTarget.alt}
                className="object-cover h-24 border w-36 rounded-xl border-slate-100 dark:border-white/8"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteBusy}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold transition-all active:scale-[0.98]"
              >
                {deleteBusy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleteBusy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}