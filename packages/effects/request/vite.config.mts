import { defineLibraryConfig } from '@igourd/vite-config';

export default defineLibraryConfig(async () => {
  return {
    library: {
      dts: {
        rollupTypes: true,
      },
    },
    vite: {
      build: {
        cssCodeSplit: true,
        lib: {
          entry: ['./src/index.ts'],
        },
        rollupOptions: {
          external: [
            '@igourd/locales',
            '@igourd/utils',
            'vue-router',
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
