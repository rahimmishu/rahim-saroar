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
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      // 🚀 Hidden Performance Optimizations
      build: {
        // Code splitting for faster initial load
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            }
          }
        },
        
        // ✅ Use default esbuild minifier (no extra dependency needed)
        minify: 'esbuild',
        
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        
        // Target modern browsers for smaller bundle
        target: 'es2015',
        
        // Enable CSS code splitting
        cssCodeSplit: true,
        
        // Source maps only for development
        sourcemap: mode === 'development',
        
        // Asset optimization
        assetsInlineLimit: 4096, // Inline small assets as base64
      },
      
      // ⚡ Performance optimizations
      optimizeDeps: {
        // Pre-bundle dependencies
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          'firebase/app',
          'firebase/auth',
          'firebase/firestore'
        ],
      },
      
      // 🎨 CSS optimization (design intact রাখতে)
      css: {
        devSourcemap: mode === 'development',
      },
      
      // 🔧 Preview server optimization
      preview: {
        port: 4173,
        host: '0.0.0.0'
      }
    };
});