import type { RouteRecordRaw } from 'vue-router';

import type { MenuRecordRaw } from '@igourd-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';
import { traverseTreeValues } from '@igourd-core/shared/utils';

type AccessToken = null | string;
interface AnyObject {
  [key: string]: any;
}
interface AccessState {
  /**
   * 权限码
   */
  accessCodes: string[];
  /**
   * 可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[];
  /**
   * 可访问的路由列表
   */
  accessRoutes: RouteRecordRaw[];
  /**
   * 登录 accessToken
   */
  accessToken: AccessToken;
  /**
   *菜单、权限树
   */
  functionTrees?: AnyObject[];
  /**
   * 是否已经检查过权限
   */
  isAccessChecked: boolean;
  /**
   * 是否锁屏状态
   */
  isLockScreen: boolean;
  /**
   * 锁屏密码
   */
  lockScreenPassword?: string;
  /**
   * 登录是否过期
   */
  loginExpired: boolean;
  /**
   * 登录 accessToken
   */
  refreshToken: AccessToken;

  /**
   * 收藏的菜单
   */
  collect: AnyObject[];
  /**
   * 设置菜单收藏
   * @param menuItem
   * @returns
   */
  toggleCollectFn: (menuItem: AnyObject) => Promise<any>;
}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = defineStore('core-access', {
  actions: {
    getMenuByPath(path: string) {
      function findMenu(
        menus: MenuRecordRaw[],
        path: string,
      ): MenuRecordRaw | undefined {
        for (const menu of menus) {
          if (menu.path === path) {
            return menu;
          }
          if (menu.children) {
            const matched = findMenu(menu.children, path);
            if (matched) {
              return matched;
            }
          }
        }
      }
      return findMenu(this.accessMenus, path);
    },
    lockScreen(password: string) {
      this.isLockScreen = true;
      this.lockScreenPassword = password;
    },
    setAccessCodes(codes: string[]) {
      this.accessCodes = codes;
    },
    setFunctionTrees(functionsTrees: AnyObject[]) {
      this.functionTrees = functionsTrees;
    },
    setAccessMenus(menus: MenuRecordRaw[]) {
      this.accessMenus = menus;
    },
    setAccessRoutes(routes: RouteRecordRaw[]) {
      this.isAccessChecked = true;
      this.accessRoutes = routes;
    },
    setAccessToken(token: AccessToken) {
      this.accessToken = token;
    },
    setLoginExpired(loginExpired: boolean) {
      this.loginExpired = loginExpired;
    },
    setRefreshToken(token: AccessToken) {
      this.refreshToken = token;
    },
    unlockScreen() {
      this.isLockScreen = false;
      this.lockScreenPassword = undefined;
    },
    async toggleCollect(menuItem: AnyObject) {
      const collect_status =
        menuItem.collect_status === 'CANCEL' ? 'COLLECTED' : 'CANCEL';
      traverseTreeValues(this.accessMenus, (menu) => {
        if (menu.menu_id === menuItem.menu_id) {
          menu.collect_status = collect_status;
          if (collect_status === 'COLLECTED') {
            this.collect.push({
              ...menu,
              menu_model: menu,
            });
          } else {
            const index = this.collect.findIndex(
              (i) => i.menu_id === menuItem.menu_id,
            );
            this.collect.splice(index, 1);
          }
        }
      });
      traverseTreeValues(
        this.functionTrees as AnyObject[],
        (node) => {
          if (node.function.menu_id === menuItem.menu_id) {
            node.function.menu.collect_status = collect_status;
          }
        },
        {
          childProps: 'sub_function_trees',
        },
      );
      await this.toggleCollectFn(menuItem);
    },
  },
  persist: {
    // 持久化
    pick: [
      'functionTrees',
      'accessRoutes',
      'accessMenus',
      'accessToken',
      'refreshToken',
      'accessCodes',
      'isLockScreen',
      'collect',
      'lockScreenPassword',
    ],
  },
  state: (): AccessState => ({
    functionTrees: [],
    accessCodes: [],
    accessMenus: [],
    accessRoutes: [],
    accessToken: null,
    isAccessChecked: false,
    isLockScreen: false,
    lockScreenPassword: undefined,
    loginExpired: false,
    refreshToken: null,
    collect: [],
    toggleCollectFn: () => Promise.resolve(),
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useAccessStore, hot));
}
