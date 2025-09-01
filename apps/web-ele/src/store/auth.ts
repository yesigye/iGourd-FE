import type { Recordable, UserInfo } from '@igourd/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ElNotification } from '@igourd/common-ui';
import { APP_CONFIG, LOGIN_PATH } from '@igourd/constants';
import { preferences } from '@igourd/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@igourd/stores';

import { defineStore } from 'pinia';

import { getAccessCodesApi, getUserInfoApi, loginApi } from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;

      // 构建新的登录参数
      const loginParams = {
        app_key: APP_CONFIG.DEFAULT_APP.app_key,
        login_account: params.username || params.login_account,
        password: params.password,
        type: APP_CONFIG.DEFAULT_APP.type,
        ...params,
      };

      const loginResult = await loginApi(loginParams);

      // 如果成功获取到登录结果
      if (loginResult.jwt_token?.token_id) {
        const accessToken = loginResult.jwt_token.token_id;
        userStore.setTokenId(accessToken);
        // 将 accessToken 存储到 accessStore 中
        accessStore.setAccessToken(accessToken);

        // 获取用户信息并存储到 accessStore 中
        const [fetchUserInfoResult, accessCodes] = await Promise.all([
          fetchUserInfo(),
          getAccessCodesApi(),
        ]);

        userInfo = fetchUserInfoResult;

        userStore.setUserInfo(userInfo);
        accessStore.setAccessCodes(accessCodes);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.realName) {
          ElNotification({
            message: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            title: $t('authentication.loginSuccess'),
            type: 'success',
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      // await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null;
    userInfo = await getUserInfoApi({
      owner_id: userStore.owner_id,
      owner_type: userStore.owner_type,
    });
    if (!userInfo) {
      throw new TypeError('UserInfo is Null');
    }

    userStore.setTokenId(userInfo.jwt_token.token_id);
    userStore.setUserModel(userInfo.useModel);
    userStore.setUserInfo(userInfo);
    userStore.setCurrentLoginUserApp(userInfo.current_login_user_app);
    userStore.setLoginAccount(userInfo.login_account || '');
    userStore.setLoginType(userInfo.type || '');
    // accessStore.set(userInfo.function_trees);
    accessStore.setFunctionTrees(userInfo.function_trees);
    accessStore.setAccessToken(userInfo.jwt_token.token_id);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
