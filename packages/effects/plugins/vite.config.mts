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
        rollupOptions: {
          output: {
            format: 'es',
            entryFileNames: '[name].mjs',
            exports: 'named',
          },
          input: {
            'echarts/index': './src/echarts/index.ts',
            'vxe-table/index': './src/vxe-table/index.ts',
            'motion/index': './src/motion/index.ts',
            'modal-table/index': './src/modal-table/index.ts',
          },
          external: [
            '@igourd/common-ui',
            '@igourd/hooks',
            '@igourd/icons',
            '@igourd/locales',
            '@igourd/preferences',
            '@igourd/types',
            '@igourd/utils',
            '@vueuse/core',
            'vue',
          ],
        },
        emptyOutDir: true,
        sourcemap: true,
      },
    },
  };
});
