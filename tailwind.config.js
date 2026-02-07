/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 🔥 নতুন কালার ভেরিয়েবল (রেনবো বাটনের জন্য)
      colors: {
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      
      // 🔥 অ্যানিমেশন সেকশন আপডেট করা হয়েছে
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        rainbow: "rainbow var(--speed, 2s) infinite linear", // ✅ নতুন যোগ করা হয়েছে
      },

      // 🔥 কী-ফ্রেম (Keyframes) যোগ করা হয়েছে
      keyframes: {
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        signature: ['Great Vibes', 'cursive'],
        bengali: ['Hind Siliguri', 'sans-serif'],
      },
    },
  },
  plugins: [],
}