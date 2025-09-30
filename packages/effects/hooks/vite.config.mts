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
            '@vueuse/core',
            'vue',
            'vue-router',
            '@igourd/preferences',
            '@igourd/locales',
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
