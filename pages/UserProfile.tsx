import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { Camera, Save, User, ShoppingCart, CreditCard, Loader2 } from 'lucide-react';
import { app } from '../firebase'; // আপনার ফায়ারবেস কনফিগ পাথ

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

const UserProfile = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [activeTab, setActiveTab] = useState('profile'); // profile, cart, payments

  // প্রোফাইল ছবি আপলোড হ্যান্ডলার
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setLoading(true);
    try {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await updateProfile(user, { photoURL: url });
      setPhotoURL(url);
      
      // Firestore-এ ইউজার ডাটা আপডেট
      await setDoc(doc(db, "users", user.uid), { photoURL: url }, { merge: true });
      
      alert("Profile picture updated!");
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    }
    setLoading(false);
  };

  // নাম আপডেট হ্যান্ডলার
  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), { displayName: name }, { merge: true });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating profile");
    }
    setLoading(false);
  };

  return (
    <div className="container min-h-screen px-4 pt-24 pb-12 mx-auto text-white bg-black">
      <h1 className="mb-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        
        {/* Sidebar Menu */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 space-y-2 h-fit">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <User size={20} /> Profile Settings
          </button>
          <button 
            onClick={() => setActiveTab('cart')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'cart' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <ShoppingCart size={20} /> My Cart (Courses)
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'payments' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <CreditCard size={20} /> Payment History
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="max-w-xl">
              <h2 className="mb-6 text-xl font-bold">Profile Details</h2>
              
              {/* Image Upload */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 overflow-hidden border-2 rounded-full border-white/20">
                    <img 
                      src={photoURL || "https://via.placeholder.com/150"} 
                      alt="Profile" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center transition-all rounded-full opacity-0 cursor-pointer bg-black/50 group-hover:opacity-100">
                    <Camera size={24} />
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <div>
                  <p className="mb-1 text-sm text-slate-400">Update your photo</p>
                  <p className="text-xs text-slate-500">Recommended: Square JPG, PNG</p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm text-slate-400">Display Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 text-white border outline-none bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-slate-400">Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ""}
                    disabled
                    className="w-full p-3 border cursor-not-allowed bg-white/5 border-white/10 rounded-xl text-slate-500"
                  />
                </div>
                
                <button 
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 mt-4 font-bold transition-all bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>
            </div>
          )}

          {/* CART TAB (Placeholder) */}
          {activeTab === 'cart' && (
            <div className="py-12 text-center">
              <ShoppingCart size={48} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-bold text-slate-300">Your Cart is Empty</h3>
              <p className="mt-2 text-slate-500">Upcoming courses will appear here.</p>
            </div>
          )}

          {/* PAYMENTS TAB (Placeholder) */}
          {activeTab === 'payments' && (
            <div className="py-12 text-center">
              <CreditCard size={48} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-bold text-slate-300">No Payment History</h3>
              <p className="mt-2 text-slate-500">You haven't purchased any courses yet.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;