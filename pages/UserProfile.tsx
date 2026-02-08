import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Save, User, ShoppingCart, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';

// 🔥 নির্ভরযোগ্য DiceBear অবতার লিংক (বিভিন্ন স্টাইল)
const AVATAR_LIST = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/micah/svg?seed=Mishu",
  "https://api.dicebear.com/7.x/micah/svg?seed=Sara",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=CoolGuy",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Artist"
];

const UserProfile = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState(user?.displayName || "");
  // যদি ইউজারের ছবি না থাকে, তবে প্রথম অবতারটি ডিফল্ট হিসেবে দেখাবে
  const [photoURL, setPhotoURL] = useState(user?.photoURL || AVATAR_LIST[0]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // ফায়ারস্টোর থেকে লেটেস্ট ডাটা আনার জন্য (যাতে রিফ্রেশ দিলেও ছবি ঠিক থাকে)
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.photoURL) setPhotoURL(data.photoURL);
            if (data.displayName) setName(data.displayName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // ১. ফায়ারবেস অথেন্টিকেশন প্রোফাইল আপডেট
      await updateProfile(user, { 
        displayName: name,
        photoURL: photoURL 
      });
      
      // ২. ডাটাবেস আপডেট (যাতে পার্মানেন্টলি সেভ থাকে)
      await setDoc(doc(db, "users", user.uid), { 
        displayName: name, 
        photoURL: photoURL 
      }, { merge: true });
      
      alert("Profile updated successfully! 🎉");
    } catch (error: any) {
      console.error(error);
      alert("Error updating profile: " + error.message);
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
            <div className="max-w-2xl">
              <h2 className="mb-6 text-xl font-bold">Profile Details</h2>
              
              {/* Current Avatar Display */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative w-32 h-32 overflow-hidden bg-white border-4 rounded-full shadow-xl border-blue-500/50 shadow-blue-500/20">
                  <img 
                    src={photoURL} 
                    alt="Profile" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-400">Choose an avatar below</p>
              </div>

              {/* 🔥 Avatar Selection Grid */}
              <div className="mb-8">
                <label className="block mb-4 text-sm font-bold text-slate-300">Select an Avatar</label>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                  {AVATAR_LIST.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setPhotoURL(avatar)}
                      className={`relative rounded-full overflow-hidden transition-all duration-300 bg-white hover:scale-110 
                        ${photoURL === avatar ? 'ring-4 ring-blue-500 scale-110 shadow-lg shadow-blue-500/40' : 'ring-1 ring-white/10 opacity-80 hover:opacity-100'}
                      `}
                    >
                      <img src={avatar} alt={`Avatar ${index}`} className="w-full h-full" />
                      
                      {/* Selected Indicator */}
                      {photoURL === avatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                          <CheckCircle2 size={24} className="text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
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
                    className="w-full p-3 text-white transition-all border outline-none bg-white/5 border-white/10 rounded-xl focus:border-blue-500 focus:bg-white/10" 
                    placeholder="Enter your name"
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
                  className="flex items-center justify-center w-full gap-2 px-8 py-3 mt-6 font-bold transition-all sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 active:scale-95"
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