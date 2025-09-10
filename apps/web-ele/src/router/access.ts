/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@igourd/types';

import { generateAccessible } from '@igourd/access';
import { preferences } from '@igourd/preferences';
import { useAccessStore } from '@igourd/stores';

import { BasicLayout, IFrameView } from '#/layouts';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const accessStore = useAccessStore();
  const pageMap: ComponentRecordType = import.meta.glob(['../views/**/*.vue', '../features/*/pages/**/*.vue']);
  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    // @ts-ignore
    fetchMenuListAsync: () => {
      return Promise.resolve(accessStore.functionTrees);
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
