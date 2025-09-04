import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  sourcemap: true,
  rollup: {
    inlineDependencies: true,
  },
  entries: [
    {
      builder: 'rollup',
      input: './src/index.ts',
    },
  ],
  externals: ['@formily/reactive', '@formily/core', 'vue', 'element-plus'],
});
