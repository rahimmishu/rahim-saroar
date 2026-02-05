import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ ১. এটি যোগ করুন

// 🔥 আপনার Firebase কনফিগ (আপনার স্ক্রিনশট থেকে নেওয়া)
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
const app = initializeApp(firebaseConfig);

// 🔥 অথেন্টিকেশন এক্সপোর্ট করা (যাতে অ্যাপের সব জায়গায় লগইন কাজ করে)
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ ২. ডেটাবেস এক্সপোর্ট করুন