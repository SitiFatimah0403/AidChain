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
