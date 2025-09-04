import { defineConfig } from '@igourd/vite-config';

export default defineConfig(async () => {
  return {
    vite: {
      build: {
        sourcemap: true,
      },
      publicDir: 'src/scss-bem',
    },
  };
});
