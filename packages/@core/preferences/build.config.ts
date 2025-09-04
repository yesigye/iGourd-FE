import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  sourcemap: true,
  externals: ['vue', '@vueuse/core'],
  rollup: {
    inlineDependencies: true,
  },
  entries: ['src/index'],
});
