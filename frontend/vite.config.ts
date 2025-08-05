import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5174, // You are running frontend on port 5174
    strictPort: true, // Prevent Vite from switching ports automatically
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend runs on 5000
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      clientPort: 5174, // Fix WebSocket HMR issue when using different browser port
    },
  },
});


// This is a Vite configuration file for a React project.
// It uses the `@vitejs/plugin-react` plugin for React support.
// The `resolve.alias` section allows you to use '@' as an alias for the 'src' directory,
// making imports cleaner and more manageable.

