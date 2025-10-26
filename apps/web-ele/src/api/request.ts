/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { RequestClientOptions } from '@igourd/request';

import { ElMessage } from '@igourd/common-ui';
import { useAppConfig } from '@igourd/hooks';
import { i18n } from '@igourd/locales';
import { preferences } from '@igourd/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  getSignatureSummary,
  RequestClient,
} from '@igourd/request';
import { useAccessStore, useUserStore } from '@igourd/stores';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const { locale } = i18n.global;
      const { tokenId, owner_id, owner_type } = useUserStore();
      config.headers['X-cur_lang_client'] = locale.value;
      config.headers['X-time_zone_client'] =
        Intl.DateTimeFormat().resolvedOptions().timeZone;
      config.headers['X-request_date_client'] = Date.now();
      config.headers['X-app_key'] = 'MERCHANT_MANAGE_WEB_PC';
      config.headers['X-token_id'] = tokenId;
      config.headers['X-owner_id'] = owner_id;
      config.headers['X-owner_type'] = owner_type;
      return config;
    },
  });
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      config.headers['X-sign'] = getSignatureSummary(config, {
        PRIVATE_KEY: import.meta.env.VITE_APP_PRIVATE_KEY,
      });
      return config;
    },
  });
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const { currentLoginUserApp } = useUserStore();
      if (!config.data) {
        config.data = {};
      }
      if (Reflect.has(config.data, 'merchant_id')) {
        return config;
      }
      config.data.merchant_id = currentLoginUserApp.owner_id;
      return config;
    },
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();

    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const useStore = useUserStore();
    const { owner_id, owner_type, tokenId: token_id } = useStore;
    const resp = await refreshTokenApi({ owner_id, owner_type, token_id });
    const newToken = resp.jwt_token.token_id;
    accessStore.setAccessToken(newToken);
    useStore.setTokenId(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 'SUCCESS',
    }),
  );

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      // 当前mock接口返回的错误字段是 error 或者 message
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.error ?? responseData?.message ?? '';
      // 如果没有错误信息，则会根据状态码进行提示
      ElMessage.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

// export const rawRequestClient = createRequestClient(apiURL, {
//   responseReturn
// });

export const arrayRequestClient = createRequestClient('/api/v1', {
  responseReturn: 'array',
});
export const baseRequestClient = new RequestClient({ baseURL: apiURL });
