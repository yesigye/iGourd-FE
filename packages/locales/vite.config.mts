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
          external: ['vue', 'vue-i18n', 'radix-vue', '@vueuse/core'],
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
          },
          formats: ['es'],
        },
        outDir: './dist',
        sourcemap: true,
      },
    },
  };
});
