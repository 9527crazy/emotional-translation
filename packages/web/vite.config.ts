import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@emotional-translation/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 4371,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          mediapipe: ['@mediapipe/tasks-vision'],
          echarts: ['echarts', 'echarts-for-react'],
        },
      },
    },
  },
});
