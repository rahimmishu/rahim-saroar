import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// ✅ FIXED: Duplicate initialization prevention
// এটা নিশ্চিত করে যে Firebase শুধুমাত্র একবার initialize হবে
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} else {
  app = getApp();
  console.log('✅ Using existing Firebase app');
}

// 🔥 অথেন্টিকেশন, ডাটাবেস এবং স্টোরেজ এক্সপোর্ট করা
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export app for other uses
export { app };
export default app;