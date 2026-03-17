import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// cors should be enabled

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    cors: true,
    proxy: {
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com/v1beta/openai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
      },
    },
    hmr: {
      overlay: false,
    },
    allowedHosts: ["mariana-unperpetuable-nonfeverishly.ngrok-free.dev"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
