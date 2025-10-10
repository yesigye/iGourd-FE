import { withInstall } from '#/common/utils';

import basicDrawer from './src/BasicDrawer.vue';

/**
 * @deprecated import from 'igourd-ui';
 */
export const BasicDrawer = withInstall(basicDrawer);
export * from './src/typing';
/**
 * @deprecated import from 'igourd-ui';
 */
export { useDrawer, useDrawerInner } from './src/useDrawer';
