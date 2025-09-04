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
            '@igourd-core/form-ui',
            '@igourd-core/shared',
            '@formily/core',
            '@igourd-core/popup-ui',
            '@formily/grid',
            '@igourd-core/shadcn-ui',
            '@formily/json-schema',
            '@formily/reactive',
            '@formily/reactive-vue',
            '@formily/shared',
            '@formily/vue',
            '@vueuse/shared',
            'radix-vue',
            'sortablejs',
            'clipboard',
            '@vueuse/integrations',
            'json-bigint',
            'qrcode',
            'resize-observer-polyfill',
            'tippy.js',
            'vue-json-viewer',
            'vue-tippy',
            'vuedraggable',
          ],
          output: {
            exports: 'named',
            dir: './dist',
            preserveModules: true,
            chunkFileNames: 'chunks/[name]-[hash].mjs',
            assetFileNames: '[name][extname]',
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
