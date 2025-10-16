// eslint-disable-next-line no-restricted-imports
import { MerchantStatus } from '@igourd/constants';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface BasicUserInfo {
  [key: string]: any;
  /**
   * 头像
   */
  avatar: string;
  currentLoginUserApp?: unknown;
  jwt_token: Record<string, any>;

  loginAccount?: string;

  /**
   * 用户昵称
   */
  realName: string;

  /**
   * 用户角色
   */
  roles?: string[];

  setLoginType?: string;

  /**
   * 用户id
   */
  userId: string;

  userModel?: Record<string, any>;

  /**
   * 用户名
   */
  username: string;
}

interface CurrentLoginUserApp {
  app_id: string;
  app_key: string;
  owner_id: string;
  owner_name: string;
  owner_type: string;
  roles: any[];
  user_app_id: null | string;
  user_id: string;
}

interface AccessState {
  currentLoginUserApp?: CurrentLoginUserApp;
  jwt_token?: Record<string, any>;
  login_account?: string;
  login_type?: string;
  merchantInfo: any;
  merchantList: any[];
  user_id: string;

  /**
   * 用户信息
   */
  userInfo: Record<string, any>;

  /**
   * 用户角色
   */
  userRoles: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: null | Partial<BasicUserInfo>) {
      // 设置用户信息
      this.userInfo = userInfo ?? {};
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
    setTokenId(tokenId: string) {
      this.userInfo.jwt_token.token_id = tokenId;
    },
    setMerchantInfo(info: any) {
      this.merchantInfo = info;
    },
    setLoginAccount(login_account: string) {
      this.login_account = login_account;
    },
    setLoginType(type: string) {
      this.login_type = type;
    },
    logout() {},
  },
  persist: {
    serializer: {
      serialize: (state: any) => JSON.stringify(state),
      deserialize: (str: string) => ({ ...JSON.parse(str) }),
    },
  },
  getters: {
    currentLoginUserApp(state) {
      if (state.userInfo?.current_login_user_app) {
        return state.userInfo?.current_login_user_app;
      }
    },
    userModel(state) {
      return state.userInfo.user_model;
    },
    currencySymbol(state) {
      return state.merchantInfo.currency_symbol ?? '';
    },
    user_model(state) {
      return state.userInfo?.user_model;
    },
    user_apps(state) {
      return state.userInfo?.user_model.user_apps;
    },
    owner_id(state) {
      return state.currentLoginUserApp?.owner_id;
    },
    merchant_id(state) {
      return state.currentLoginUserApp?.owner_id;
    },
    owner_type(state) {
      return state.currentLoginUserApp?.owner_type;
    },
    tokenId(state) {
      return state.userInfo.jwt_token.token_id;
    },
    userApps(state): {
      owner_id: string;
      owner_type: string;
      status: MerchantStatus;
      user_id: string;
    }[] {
      return state.userInfo.user_model?.user_apps ?? [];
    },
  },
  state: (): AccessState => ({
    userInfo: {},
    userRoles: [],
    user_id: '',
    merchantList: [],
    merchantInfo: {},
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
