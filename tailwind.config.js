/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        rainbow: "rainbow var(--speed, 2s) infinite linear", 
      },

      keyframes: {
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        }, // <--- এই ব্র্যাকেটটি আপনার কোডে মিসিং ছিল
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