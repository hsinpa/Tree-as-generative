import { defineConfig} from 'vite';

export default defineConfig({
  base: '',
  root: './',
  build: {
    outDir: './docs'
  },
  server: {
    open: './index.html',
  },
});
