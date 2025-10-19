import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@igourd/access';
import { ElLoading, registerLoadingDirective } from '@igourd/common-ui';
import { VuePrintPlugin } from '@igourd/plugins/print';
// import '@igourd/common-ui/style';
import { preferences } from '@igourd/preferences';
import { initStores } from '@igourd/stores';
import microApp from '@micro-zoe/micro-app';
import '@igourd/styles';
import '@igourd/styles/ele';

import { useTitle } from '@vueuse/core';
import { ElInfiniteScroll } from 'element-plus';

import { $t, setupI18n } from '#/locales';

import { initComponentAdapter } from './adapter/component';
import App from './app.vue';
import { router } from './router';
import { arrayRequestClient } from './api/request';

async function bootstrap(namespace: string) {
  // 初始化组件适配器
  await initComponentAdapter();
  const app = createApp(App);

  // 注册Element Plus提供的v-loading指令
  app.directive('loading', ElLoading.directive);
  app.directive('infinite-scroll', ElInfiniteScroll);
  app.use(VuePrintPlugin);

  // 注册Igourd提供的v-loading和v-spinning指令
  registerLoadingDirective(app, {
    loading: false, // Igourd提供的v-loading指令和Element Plus提供的v-loading指令二选一即可，此处false表示不注册Igourd提供的v-loading指令
    spinning: 'spinning',
  });
  // 先配置 Pinia，后续的请求语言依赖与 Pinia
  // 配置 pinia-tore
  await initStores(app, { namespace });
  // 国际化 i18n 配置
  await setupI18n(app);

  // 安装权限指令
  registerAccessDirective(app);

  // 配置路由及路由守卫
  app.use(router);

  // 配置Motion插件
  const { MotionPlugin } = await import('@igourd/plugins/motion');
  app.use(MotionPlugin);

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle =
        (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });
  microApp.start();
  app.mount('#app');
  microApp.setGlobalData({
    request: arrayRequestClient,
  });
}

export { bootstrap };
