import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  failOnWarn: false,
  entries: ['src/index'],
  externals: ['vue', '@babel/types', '@babel/parser', 'csstype'],
});
