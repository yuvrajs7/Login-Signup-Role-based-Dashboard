import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '74ab2b80-5ebe-433b-94e4-96d74f3b06a7-00-1hkpfc1yy4vcq.pike.replit.dev',
      // Add other hosts as needed
    ]
  }
})
