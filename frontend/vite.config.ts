import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import detect from 'detect-port';

// Default frontend port
const DEFAULT_PORT = 5174;

// Export async config
export default defineConfig(async () => {
  const availablePort = await detect(DEFAULT_PORT);
  const BACKEND_PORT = process.env.VITE_BACKEND_PORT  || '5000';

  return {
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
      port: availablePort,
      strictPort: false, // allow auto-switching
      proxy: {
        '/api': {
          target: `http://localhost:${BACKEND_PORT}`, // backend port stays 5000
          changeOrigin: true,
          secure: false,
        },
      },
      hmr: {
        clientPort: availablePort, // fix websocket issue for dev tools
      },
    },
  };
});
