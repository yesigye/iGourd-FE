import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@igourd/types';

import { generateAccessible } from '@igourd/access';
import { preferences } from '@igourd/preferences';

import { message } from 'ant-design-vue';

import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loading-menu')}...`,
        duration: 1.5,
      });

      // 新的API规范：菜单信息通过登录响应的function_trees字段获取
      // 这里应该从store或localStorage中获取已保存的function_trees
      // 而不是调用单独的菜单接口

      // 从本地存储获取function_trees
      const functionTrees = localStorage.getItem('functionTrees');
      if (functionTrees) {
        try {
          const parsedTrees = JSON.parse(functionTrees);
          // 将function_trees转换为菜单格式
          return convertFunctionTreesToMenus(parsedTrees);
        } catch (error) {
          console.error('Failed to parse function trees:', error);
        }
      }

      // 如果没有function_trees，返回空数组
      // 这样可以避免调用旧的菜单接口
      return [];
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

/**
 * 将功能权限树转换为菜单格式
 * 适配@igourd/access库的菜单结构要求
 */
function convertFunctionTreesToMenus(functionTrees: any[]): any[] {
  const menus: any[] = [];

  functionTrees.forEach((tree: any) => {
    if (!tree.function || !tree.function.menu) {
      return;
    }

    const menuItem = tree.function.menu;
    const menu = {
      id: tree.id || menuItem.menu_id,
      name: menuItem.name,
      key: menuItem.menu_key,
      path: menuItem.url,
      component: menuItem.component_paths || menuItem.url,
      meta: {
        title: menuItem.name,
        icon: menuItem.style_class,
        hidden: menuItem.is_displayed === false,
      },
      children: tree.sub_function_trees ? convertFunctionTreesToMenus(tree.sub_function_trees) : []
    };

    menus.push(menu);
  });

  return menus;
}

export { generateAccess };
