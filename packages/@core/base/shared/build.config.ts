import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: 'compatible',
  sourcemap: true,
  entries: [
    'src/store',
    'src/constants/index',
    'src/utils/index',
    'src/color/index',
    'src/cache/index',
    'src/global-state',
  ],
  rollup: {
    inlineDependencies: true,
  },
  externals: ['dayjs', 'lodash-es', '@vue/shared'],
});
