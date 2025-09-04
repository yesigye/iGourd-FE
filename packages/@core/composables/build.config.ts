import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  sourcemap: true,
  rollup: {
    inlineDependencies: true,
    dts: {
      respectExternal: false,
    },
  },
  externals: ['@vueuse/core', 'radix-vue', 'vue'],
  entries: ['src/index'],
});
