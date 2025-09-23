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
        emptyOutDir: true,
        sourcemap: true,
      },
    },
  };
});
