import type { Recordable, UserInfo } from '@igourd/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAccount } from '@igourd/access';
import { ElNotification } from '@igourd/common-ui';
import { APP_CONFIG } from '@igourd/constants';
import { preferences } from '@igourd/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@igourd/stores';

import { defineStore } from 'pinia';

import {
  basicsMerchantList,
  getAccessCodesApi,
  getUserInfoApi,
  loginApi,
} from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();
  const { redirectToLogin } = useAccount();
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

  async function logout() {
    resetAllStores();
    accessStore.setLoginExpired(false);

    redirectToLogin();
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null;
    userInfo = await getUserInfoApi({
      owner_id: userStore.owner_id,
      owner_type: userStore.owner_type,
    });
    userStore.setMerchantInfo({
      //@ts-ignore
      owner_id: userInfo.owner_id,
      //@ts-ignore
      owner_type: userInfo.owner_type,
      //@ts-ignore
      user_id: userInfo.user_id,
    });
    if (!userInfo) {
      throw new TypeError('UserInfo is Null');
    }
    //@ts-ignore
    const userApps = userInfo.userModel?.user_apps || [];
    //@ts-ignore
    const merchant_ids = userApps.map((item) => item.owner_id);
    const res = await basicsMerchantList({ merchant_ids });
    //@ts-ignore
    function customizerMerchantList(dataList, user_apps) {
      if (dataList?.length && user_apps?.length) {
        //@ts-ignore
        return dataList.reduce((acc, cur) => {
          //@ts-ignore
          user_apps.forEach((item) => {
            if (item.owner_id === cur.merchant_id) {
              acc.push({ ...cur, ...item });
            }
          });
          return acc;
        }, []);
      }
      return [];
    }
    const merList = customizerMerchantList(res ?? [], userApps);

    const merchantInfo = (merList || []).find(
      //@ts-ignore
      (item) => item.owner_id === userStore.merchantInfo.owner_id,
    );
    userStore.setMerchantInfo(merchantInfo);

    userStore.setTokenId(userInfo.jwt_token.token_id);
    userStore.setUserModel(userInfo.useModel);
    userStore.setUserInfo(userInfo);
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
