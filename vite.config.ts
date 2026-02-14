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
              
              // Heavy components in separate chunks (lazy load করবে)
              'three-vendor': ['three'],
              'ui-components': [
                './components/ui/sunlight-spotlight',
                './components/DynamicIsland',
                './components/SpotlightCard'
              ]
            }
          }
        },
        
        // Compression & Minification
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.logs in production
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
          },
          mangle: true,
          format: {
            comments: false, // Remove comments
          }
        },
        
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
        // Skip heavy dependencies that should load on-demand
        exclude: ['three']
      },
      
      // 🎨 CSS optimization (design intact রাখতে)
      css: {
        devSourcemap: mode === 'development',
        modules: {
          localsConvention: 'camelCase'
        }
      },
      
      // 🔧 Preview server optimization
      preview: {
        port: 4173,
        host: '0.0.0.0'
      }
    };
});