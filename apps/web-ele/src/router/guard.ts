import type { Router } from 'vue-router';

import { useAccount } from '@igourd/access';
import { LOGIN_PATH } from '@igourd/constants';
import { preferences } from '@igourd/preferences';
import { useAccessStore, useUserStore } from '@igourd/stores';
import { startProgress, stopProgress } from '@igourd/utils';

import { useSession } from '#/hooks/use-session';
import { loadFeatureLocal, loadRemoteLocale, updateLocale } from '#/locales';
import { accessRoutes, coreRouteNames } from '#/router/routes';

import { generateAccess } from './access';
import { toggleCollect } from '#/api';

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path);
    // 页面加载进度条
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

function setupAuthGuard(router: Router) {
  router.beforeEach(async (to, _) => {
    const accessStore = useAccessStore();
    const userStore = useUserStore();
    const { redirectToLogin } = useAccount();
    if (!accessStore.accessToken) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true;
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        redirectToLogin();
        return false;
      }
      // return true;
    }
    //@ts-ignore
    accessStore.toggleCollectFn = (data: any) => {
      const { currentLoginUserApp } = userStore;
      toggleCollect(
        Object.assign({}, currentLoginUserApp, {
          ...data,
          status: data.collect_status,
        }),
      );
    };
    if (!accessStore.isAccessChecked) {
      const { roles } = userStore.userInfo;
      const { accessibleMenus, accessibleRoutes } = await generateAccess({
        roles,
        router,
        routes: accessRoutes,
      });
      accessStore.setAccessMenus(accessibleMenus);
      accessStore.setAccessRoutes(accessibleRoutes);
      return {
        path: to.path,
        query: to.query,
        replace: true,
      };
    }
    return true;
  });
}

/**
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, _) => {
    const { redirectToLogin } = useAccount();
    const userStore = useUserStore();
    const { setSession } = useSession();
    const {
      token_id,
      user_id,
      owner_id,
      owner_type,
      app_id,
      app_key,
      ...reset
    } = to.query;
    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      return true;
    }
    /**
     * 如果不存在 TokenId，本地也不存在用户信息，那么跳转登录
     */
    if (!token_id && !userStore.currentLoginUserApp) {
      redirectToLogin();
      return;
    }
    /**
     * 如果本地存在用户信息，但是不存在token_id，那么表示正常路由跳转
     */
    if (userStore.currentLoginUserApp && !token_id) {
      return true;
    }
    // 如果不存在本地用户信息，但是存在token_id，那么表示是登录回来，需要拉去用户信息。
    if (token_id && !userStore.currentLoginUserApp) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await setSession({ token_id, user_id, owner_id, owner_type });
    }

    return {
      path: to.path,
      query: {
        ...reset,
      },
      replace: true,
    };
  });
}

function setupI18n(router: Router) {
  router.beforeEach(async (to) => {
    const module = to.matched.at(1)?.name;
    await Promise.all([loadRemoteLocale(), loadFeatureLocal(module as string)]);
    const { language, ...reset } = to.query;
    if (language) {
      await updateLocale(language as string);
      return {
        path: to.path,
        query: {
          ...reset,
        },
        replace: true,
      };
    }
    return true;
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router);

  /** 权限访问 */
  setupAccessGuard(router);

  /**
   * 认证访问
   */
  setupAuthGuard(router);

  /** 国际化 */
  setupI18n(router);
}

export { createRouterGuard };
