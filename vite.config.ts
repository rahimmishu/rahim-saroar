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
            manualChunks: {
              // ✅ react, react-dom, react-router-dom — সব একসাথে!
              // আলাদা করলে "createContext" error আসে
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              // Firebase আলাদা (React-এর সাথে কোনো dependency নেই)
              'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            },
          }
        },
        
        minify: 'esbuild',
        chunkSizeWarningLimit: 1000,
        target: 'es2015',
        
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
      }
    };
});