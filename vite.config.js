import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // For GitHub Pages: use '/' if deploying to a custom domain,
  // or '/rahul-kushwaha/' if deploying to the-rahulk.github.io/rahul-kushwaha
  base: '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
  }
});
