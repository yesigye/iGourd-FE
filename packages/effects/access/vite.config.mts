import { defineLibraryConfig } from '@igourd/vite-config';

export default defineLibraryConfig(async () => {
  return {
    library: {
      dts: true,
    },
    vite: {
      build: {
        cssCodeSplit: true,
        lib: {
          formats: ['es'],
          entry: ['./src/index.ts'],
        },
        rollupOptions: {
          external: [
            'vue',
            '@igourd/preferences',
            '@igourd/stores',
            '@igourd/types',
            '@igourd/utils',
          ],
        },
        emptyOutDir: true,
        sourcemap: true,
      },
    },
  };
});
