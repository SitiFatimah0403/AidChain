import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ✅ import path for alias resolution

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ alias '@' to 'src' directory
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

// This is a Vite configuration file for a React project.
// It uses the `@vitejs/plugin-react` plugin for React support.
// The `resolve.alias` section allows you to use '@' as an alias for the 'src' directory,
// making imports cleaner and more manageable.
