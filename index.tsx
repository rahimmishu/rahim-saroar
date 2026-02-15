import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';

// 🔥 CRITICAL FIX: Import Firebase BEFORE App renders!
// এটা নিশ্চিত করে যে Firebase initialize হয়ে গেছে App render হওয়ার আগে
import './firebase';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);