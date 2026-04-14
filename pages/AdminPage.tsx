import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, LogOut, Upload, CheckCircle, AlertCircle, Image as ImageIcon, Video, Folder, Key } from 'lucide-react';

const AdminPage: React.FC = () => {
  // Authentication States
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form States
  const [secretCode, setSecretCode] = useState('hotcdi'); // Default code
  const [folderName, setFolderName] = useState('');
  const [type, setType] = useState<'video' | 'image'>('video');
  const [title, setTitle] = useState('');
  const [src, setSrc] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{success: boolean, msg: string} | null>(null);

  // চেক করবে ইউজার লগইন করা আছে কিনা
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // লগইন ফাংশন
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  // লগআউট ফাংশন
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ডাটাবেসে আপলোড ফাংশন
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadStatus(null);

    try {
      const { error } = await supabase
        .from('vault_items')
        .insert([
          {
            secret_code: secretCode,
            folder_name: folderName || null, // ফাঁকা থাকলে null যাবে
            type: type,
            title: title,
            src: src,
            thumbnail: thumbnail || null
          }
        ]);

      if (error) throw error;

      setUploadStatus({ success: true, msg: 'File successfully added to Vault!' });
      // ফর্ম ক্লিয়ার করা
      setTitle('');
      setSrc('');
      setThumbnail('');
      
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error: any) {
      setUploadStatus({ success: false, msg: error.message });
    } finally {
      setUploadLoading(false);
    }
  };

  // ── ১. লগইন পেজ (যদি লগইন করা না থাকে) ──
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white p-4">
        <div className="w-full max-w-md p-8 border shadow-2xl bg-neutral-900/50 backdrop-blur-xl border-white/10 rounded-3xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 text-purple-500 rounded-full bg-purple-500/20">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-center">Admin Access</h2>
          
          {authError && (
            <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-400 bg-red-500/10 rounded-xl">
              <AlertCircle size={16} /> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-neutral-400">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border rounded-xl border-white/10 focus:border-purple-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-neutral-400">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border rounded-xl border-white/10 focus:border-purple-500 focus:outline-none" 
              />
            </div>
            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full py-3 mt-4 font-bold text-white transition-all bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50"
            >
              {authLoading ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── ২. অ্যাডমিন ড্যাশবোর্ড (লগইন করার পর) ──
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
              Vault Control Center
            </h1>
            <p className="text-neutral-400">Manage your secret database directly from here.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 transition-all border rounded-lg bg-white/5 border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Upload Form */}
        <div className="p-6 border shadow-xl md:p-8 bg-neutral-900/50 backdrop-blur-md rounded-3xl border-white/10">
          <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
            <Upload className="text-purple-500" /> Add New Media to Vault
          </h2>

          {uploadStatus && (
            <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${uploadStatus.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {uploadStatus.success ? <CheckCircle /> : <AlertCircle />}
              {uploadStatus.msg}
            </div>
          )}

          <form onSubmit={handleUpload} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Secret Code */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-400"><Key size={16}/> Secret Code</label>
              <input type="text" required value={secretCode} onChange={(e) => setSecretCode(e.target.value)} className="w-full px-4 py-3 text-white bg-black border rounded-xl border-white/10 focus:border-purple-500 focus:outline-none" placeholder="e.g. hotcdi" />
            </div>

            {/* Folder Name */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-400"><Folder size={16}/> Folder Name (Optional)</label>
              <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} className="w-full px-4 py-3 text-white bg-black border rounded-xl border-white/10 focus:border-purple-500 focus:outline-none" placeholder="e.g. new viral" />
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-400">File Type</label>
              <div className="flex gap-4 p-1 bg-black border rounded-xl border-white/10">
                <button type="button" onClick={() => setType('video')} className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg transition-all ${type === 'video' ? 'bg-purple-600 text-white' : 'text-neutral-500 hover:text-white'}`}>
                  <Video size={18} /> Video
                </button>
                <button type="button" onClick={() => setType('image')} className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg transition-all ${type === 'image' ? 'bg-purple-600 text-white' : 'text-neutral-500 hover:text-white'}`}>
                  <ImageIcon size={18} /> Image
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-400">Title / Name</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 text-white bg-black border rounded-xl border-white/10 focus:border-purple-500 focus:outline-none" placeholder="e.g. Funny Clip" />
            </div>

            {/* Source URL */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-neutral-400">Media URL (Drive Link, YT Link, or Local Path)</label>
              <input type="text" required value={src} onChange={(e) => setSrc(e.target.value)} className="w-full px-4 py-3 text-white bg-black border rounded-xl border-white/10 focus:border-purple-500 focus:outline-none" placeholder="https://drive.google.com/file/d/..." />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-neutral-400">Thumbnail URL (Optional)</label>
              <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="w-full px-4 py-3 text-white bg-black border rounded-xl border-white/10 focus:border-purple-500 focus:outline-none" placeholder="/secret/thumb.jpg or link" />
            </div>

            {/* Submit Button */}
            <div className="pt-4 md:col-span-2">
              <button type="submit" disabled={uploadLoading} className="w-full py-4 text-lg font-bold text-white transition-all bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                {uploadLoading ? 'Uploading to Database...' : <><Upload /> Add to Database</>}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;