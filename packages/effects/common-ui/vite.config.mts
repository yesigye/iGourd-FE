import { defineLibraryConfig } from '@igourd/vite-config';

export default defineLibraryConfig(async () => {
  return {
    library: {
      dts: true,
    },
    vite: {
      build: {
        cssCodeSplit: false,
        rollupOptions: {
          output: {
            format: 'es',
            entryFileNames: '[name].mjs',
            exports: 'named',
          },
          input: {
            index: './src/index.ts',
            style: './src/components/style.scss',
            'es/tippy/index': './src/components/tippy/index.ts',
            'es/loading/index': './src/components/loading/index.ts',
          },
          external: [
            'vue',
            'vue-router',
            '@igourd/constants',
            '@igourd/hooks',
            '@igourd/icons',
            '@vueuse/core',
            '@igourd/locales',
            '@igourd/types',
            '@igourd/plugins',
            'dayjs',
          ],
        },
        emptyOutDir: true,
        sourcemap: true,
      },
    },
  };
});
