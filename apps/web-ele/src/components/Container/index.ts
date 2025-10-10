import { withInstall } from '#/common/utils';

import lazyContainer from './src/LazyContainer.vue';
import scrollContainer from './src/ScrollContainer.vue';

export const ScrollContainer = withInstall(scrollContainer);
export const LazyContainer = withInstall(lazyContainer);

export * from './src/typing';
