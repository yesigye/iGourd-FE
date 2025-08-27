import type { RouteRecordRaw } from 'vue-router';
import { constantRouters } from '@/router';
import { store, useUserStore, useTagsViewStore } from '@/store';
import router from '@/router';
import { Local } from '@/utils';

import { selectOwnerApi } from '@/api/core/auth';
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

const modules = import.meta.glob('../../views/**/**.vue');
const Layout = () => import('@/layout/index.vue');
const NotFoundPage = modules[`../../views/error-page/404.vue`];

export const usePermissionStore = defineStore('permission', () => {
  const dynamicRoutes = ref<AnyObject[]>([]);
  // 所有路由，包括静态和动态路由
  const routes = ref<RouteRecordRaw[]>([]);
  // 权限列表
  const permActionsList = ref<any[]>([]);
  // 混合模式左侧菜单
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);
  // 路由是否已加载
  const isRoutesLoaded = ref(false);

  const permCodeList = computed(() => permActionsList.value.map(item => item.action_key));

  /**
   * 生成动态路由
   * 适配新的API规范：使用selectOwnerApi获取最新的权限信息
   */
  function generateRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      const userStore = useUserStore();
      const { owner_id, owner_type } = userStore.merchantInfo;

      // 使用新的API接口
      selectOwnerApi({ owner_id, owner_type })
        .then((res: any) => {
          if (!res || !res.jwt_token) {
            return reject(new Error('Invalid response from owner selection API'));
          }

          // 设置最新的token信息
          userStore.setTokenId(res.jwt_token.token_id);
          userStore.setUserModel(res.user_model);
          userStore.setCurrentLoginUserApp(res.current_login_user_app);

          // 保存用户信息到本地存储
          userStore.setLoginAccount(res?.login_account || '');
          userStore.setLoginType(res?.type || '');
          Local.set('userinfo', { ...res });

          // 保存菜单和功能权限树
          Local.set('menulist', res.menu_trees || []);
          Local.set('functionTrees', res?.function_trees);

          // 转换功能权限树为路由
          const asyncRoutes = transformRoutes(res.function_trees || []);
          resolve(asyncRoutes);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 动态创建路由
  function getCreateRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      const userStore = useUserStore();
      generateRoutes()
        .then(asyncRoutes => {
          dynamicRoutes.value = asyncRoutes;
          routes.value = [...asyncRoutes, ...constantRouters];
          isRoutesLoaded.value = true;

          // 获取商户列表并设置当前商户信息
          userStore.getMerchantList().then(merchantList => {
            const merchantInfo = (merchantList || []).find(item => item.owner_id === userStore.merchantInfo.owner_id);
            userStore.setMerchantInfo(merchantInfo);
          });

          // 添加动态路由到router实例
          asyncRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route));
          resolve(asyncRoutes);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 刷新路由重新创建
  const refreshRoute = () => {
    return new Promise((resolve, reject) => {
      generateRoutes()
        .then(asyncRoutes => {
          resetRouter();
          routes.value = [...asyncRoutes, ...constantRouters];
          isRoutesLoaded.value = true;
          asyncRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route));
          resolve(asyncRoutes);
        })
        .catch(error => {
          reject(error);
        });
    };
  };

  /**
   * 混合模式菜单下根据顶部菜单路径设置左侧菜单
   *
   * @param topMenuPath - 顶部菜单路径
   */
  const setMixLeftMenus = (topMenuPath: string) => {
    const matchedItem = routes.value.find(item => item.path === topMenuPath);
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children;
    }
  };

  /**
   * 重置路由
   */
  const resetRouter = () => {
    // 删除动态路由，保留静态路由
    routes.value.forEach(route => {
      if (route.name && !constantRouters.find(r => r.name === route.name)) {
        // 从 router 实例中移除动态路由
        router.removeRoute(route.name);
      }
    });

    const tagsView = useTagsViewStore();
    dynamicRoutes.value = [];
    routes.value = [];
    mixLeftMenus.value = [];
    permActionsList.value = [];
    tagsView.delAllViews();
    isRoutesLoaded.value = false;
  };

  /**
   * 转换功能权限树为路由配置
   * 适配新的API数据结构
   */
  const transformRoutes = (functionTrees: AnyObject[]) => {
    const asyncRoutes: RouteRecordRaw[] = [];

    functionTrees.forEach((tree: any) => {
      // 检查是否有功能信息
      if (!tree.function || !tree.function.menu) {
        return;
      }

      const menuItem = tree.function.menu;
      const menuUrlArray = menuItem?.url?.split('/') || [];
      const routeName = menuUrlArray.join('') || 'Home';
      const functionKey = tree.function.function_key || '';

      const tmp = {
        path: menuItem.url || '/',
        name: routeName,
        props: { functionKey },
        meta: {
          hidden: menuItem?.is_displayed === false,
          entitle: menuItem.name,
          title: menuItem.menu_key?.replace('.', '_') || menuItem.name,
          icon: menuItem.style_class,
          affix: routeName === 'home'
        }
      } as any;

      // 设置重定向
      if (menuItem?.redirect) {
        tmp.redirect = menuItem.redirect;
      }

      // 确定组件
      let component = modules[`../../views${menuItem.url}/index.vue`] as any;
      if (!component && menuItem.component_paths) {
        // 新组件使用 component_paths
        component = modules[`../../views${menuItem.component_paths}/index.vue`] as any;
      }

      // 设置组件
      if (menuItem.parent_id === '0') {
        tmp.component = Layout;
      } else {
        tmp.component = component || NotFoundPage;
      }

      // 处理子路由
      if (tree.sub_function_trees === null && menuItem.parent_id === '0') {
        // 单页面应用，需要添加默认子路由
        tmp.children = [
          {
            path: '',
            name: `${routeName}First`,
            props: { functionKey },
            component: component || NotFoundPage,
            meta: {
              entitle: menuItem.name,
              title: menuItem.menu_key?.replace('.', '_') || menuItem.name,
              icon: menuItem.style_class,
              ...menuItem
            }
          }
        ];
      }

      // 递归处理子功能树
      if (tree.sub_function_trees?.length) {
        tmp.children = transformRoutes(tree.sub_function_trees);
      }

      asyncRoutes.push(tmp);

      // 收集权限操作列表
      if (tree.function.actions) {
        permActionsList.value.push(...tree.function.actions);
      }
    });

    return asyncRoutes;
  };

  return {
    dynamicRoutes,
    routes,
    permCodeList,
    generateRoutes,
    getCreateRoutes,
    refreshRoute,
    mixLeftMenus,
    setMixLeftMenus,
    isRoutesLoaded,
    resetRouter
  };
});

/**
 * 在组件外使用 Pinia store 实例 @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
