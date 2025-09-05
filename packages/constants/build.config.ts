import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: 'compatible',
  sourcemap: true,
  entries: [
    {
      builder: 'rollup',
      input: './src/index.ts',
    },
  ],
  rollup: {
    inlineDependencies: true,
  },
});
