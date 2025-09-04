import { defineLibraryConfig } from '@igourd/vite-config';

export default defineLibraryConfig(async () => {
  return {
    library: {
      dts: true,
    },
    vite: {
      resolve: {
        preserveSymlinks: true,
      },
      build: {
        emptyOutDir: true,
        cssCodeSplit: true,
        rollupOptions: {
          external: [
            '@element-plus/icons-vue',
            '@vueuse/core',
            'vue',
            'element-plus',
            'dayjs',
            'vue-router',
            '@igourd-core/preferences',
            '@igourd/constants',
            '@igourd/hooks',
            '@igourd/icons',
            '@igourd/locales',
            '@igourd/types',
            '@formily/core',
            '@formily/grid',
            '@formily/json-schema',
            '@formily/reactive',
            '@formily/reactive-vue',
            '@formily/shared',
            '@formily/vue',
            '@vueuse/shared',
            'radix-vue',
          ],
          output: {
            dir: './dist/chunks',
            preserveModules: true,
            chunkFileNames: 'chunks/[name]-[hash].mjs',
            assetFileNames: 'assets/[name][extname]',
            entryFileNames: '[name].mjs',
            preserveModulesRoot: 'src',
          },
        },
        lib: {
          entry: {
            index: 'src/index.ts',
            'components/tippy/index': 'src/components/tippy/index.ts',
            'components/loading/index': 'src/components/loading/index.ts',
            'components/style': './src/components/style.ts',
          },
          formats: ['es'],
        },
        outDir: './dist',
        sourcemap: true,
      },
    },
  };
});
