import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ ১. স্টোরেজ ইমপোর্ট করা হলো

// 🔥 আপনার Firebase কনফিগ
const firebaseConfig = {
  apiKey: "AIzaSyBvJ5SRxWp_6qG9mkWMm6flHEWJHT85ftY",
  authDomain: "rahim-cc7e4.firebaseapp.com",
  projectId: "rahim-cc7e4",
  storageBucket: "rahim-cc7e4.firebasestorage.app",
  messagingSenderId: "46582003477",
  appId: "1:46582003477:web:6cda74f12ca9cf74781b1c",
  measurementId: "G-LNCQDHMM72"
};

// অ্যাপ ইনিশিলাইজ করা
// ✅ ২. এখানে 'export' যোগ করা হয়েছে যাতে UserProfile.tsx এটি ব্যবহার করতে পারে
export const app = initializeApp(firebaseConfig);

// 🔥 অথেন্টিকেশন, ডাটাবেস এবং স্টোরেজ এক্সপোর্ট করা
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ ৩. স্টোরেজ এক্সপোর্ট করা হলো (ছবির জন্য লাগবে)