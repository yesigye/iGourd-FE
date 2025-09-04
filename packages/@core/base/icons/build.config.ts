import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  sourcemap: true,
  rollup: {
    inlineDependencies: true,
  },
  entries: ['src/index'],
});
