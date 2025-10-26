import type { BasicUserInfo } from '@igourd-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /**
   * 用户描述
   */
  desc: string;
  /**
   * 首页地址
   */
  homePath: string;

  /**
   * accessToken
   */
  token: string;

  jwt_token: Record<string, any>;

  user_model: Record<string, any>;

  current_login_user_app: Record<string, any>;
  login_account?: string;
  type: Record<string, string>;
  menu_trees: any;
  function_trees: any;
}

export type { UserInfo };
