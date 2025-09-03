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

interface AccessState {
  currentLoginUserApp?: unknown;
  jwt_token?: Record<string, any>;

  login_account?: string;
  login_type?: string;
  owner_id: string;
  owner_type: string;
  tokenId: string;
  user_id: string;
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;

  userModel?: Record<string, any>;

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
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
    setTokenId(tokenId: string) {
      this.tokenId = tokenId;
      if (this.userInfo?.jwt_token) {
        this.userInfo.jwt_token.token_id = tokenId;
      }
    },
    setUserModel(useModel: Record<string, any>) {
      this.userModel = useModel;
    },
    setMerchantInfo(
      info: Pick<AccessState, 'owner_id' | 'owner_type' | 'user_id'>,
    ) {
      Object.assign(this, info);
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
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
    tokenId: '',
    owner_id: '',
    owner_type: '',
    user_id: '',
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
