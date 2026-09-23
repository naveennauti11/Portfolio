import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: [
        '**/previous_website_videos/**',
        '**/downloads/**',
        '**/tmp_videos/**',
        '**/WebM/**',
        '**/public/media_vault/**',
        '**/public/candidate_frames/**',
        '**/public/test_frames/**',
        '**/public/horizontal_frames/**'
      ]
    }
  }
});
