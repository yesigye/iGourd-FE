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
            'vue',
            '@vueuse/core',
            'radix-vue',
            'vue-demi',
            '@igourd-core/composables',
            '@igourd-core/icons',
            '@igourd-core/shared',
            '@igourd-core/typings',
          ],
        },
        emptyOutDir: true,
        sourcemap: true,
      },
    },
  };
});
