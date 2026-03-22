import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              // React core — সবার আগে load হবে
              if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                return 'react-core';
              }
              // Router আলাদা chunk
              if (id.includes('react-router-dom')) {
                return 'react-router';
              }
              // Firebase সব একসাথে, কিন্তু আলাদা chunk-এ
              if (id.includes('firebase')) {
                return 'firebase-vendor';
              }
              // Animation libraries (framer-motion, gsap ইত্যাদি থাকলে)
              if (id.includes('framer-motion') || id.includes('gsap')) {
                return 'animation-vendor';
              }
              // বাকি সব node_modules এক জায়গায়
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            },

            // Cache-friendly file naming — browser cache ভালো কাজ করবে
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: (assetInfo) => {
              const name = assetInfo.name ?? '';
              // Images আলাদা folder-এ
              if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
                return 'assets/img/[name]-[hash][extname]';
              }
              // Fonts আলাদা folder-এ
              if (/\.(woff2?|ttf|eot)$/i.test(name)) {
                return 'assets/fonts/[name]-[hash][extname]';
              }
              // CSS আলাদা folder-এ
              if (/\.css$/i.test(name)) {
                return 'assets/css/[name]-[hash][extname]';
              }
              return 'assets/[name]-[hash][extname]';
            },
          }
        },
        
        minify: 'esbuild',
        
        // esbuild minify options — আরো aggressive compression
        esbuildOptions: {
          drop: mode === 'production' ? ['console', 'debugger'] : [],
          legalComments: 'none',
        },

        chunkSizeWarningLimit: 800, // 1000 থেকে কমালাম, warning আগে পাবে

        // Modern browsers target — smaller bundle size
        target: 'es2020',
        
        cssCodeSplit: true,
        
        sourcemap: mode === 'development',
        
        // 8KB পর্যন্ত inline করবে (আগে ছিল 4KB)
        // ছোট ছোট icon/svg গুলো inline হয়ে যাবে, extra request কমবে
        assetsInlineLimit: 8192,

        // CSS minification
        cssMinify: true,
      },
      
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          'firebase/app',
          'firebase/auth',
          'firebase/firestore',
          'firebase/storage',
        ],
        // Dev server এ faster cold start
        force: false,
      },
      
      css: {
        devSourcemap: mode === 'development',
      },
      
      preview: {
        port: 4173,
        host: '0.0.0.0',
        // Preview server-এ cache headers
        headers: {
          'Cache-Control': 'public, max-age=31536000',
        },
      }
    };
});