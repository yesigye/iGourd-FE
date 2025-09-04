import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  sourcemap: true,
  declaration: true,
  entries: ['src/index'],
  externals: ['vue', 'vue-router'],
});
