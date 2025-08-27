import { baseRequestClient, requestClient } from '#/api/request';
import { APP_CONFIG, type AppKey, type AccountType, type OwnerType } from '@igourd/constants';
import type { FunctionTree } from '@igourd/types';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    app_key: AppKey;
    login_account: string;
    password: string;
    type: AccountType;
    country_area_code?: string;
    country_id?: number;
    owner_id?: number;
    owner_type?: OwnerType;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    jwt_token: {
      jwt_token: string;
      token_id: string;
      token_type: string;
      expires_in: number;
    };
    user_model: {
      id: number;
      real_name: string;
      login_id: string;
      email?: string;
      phone_number?: string;
      status: string;
    };
    function_trees: FunctionTree[];
    user_apps: Array<{
      id: number;
      owner_id: number;
      owner_type: string;
      app_key: string;
    }>;
    current_login_user_app: {
      id: number;
      owner_id: number;
      owner_type: string;
      app_key: string;
    };
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }

  /** Token刷新请求参数 */
  export interface RefreshTokenParams {
    owner_id: number;
    owner_type: OwnerType;
    token_id: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/v1/passport/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.get('/v1/passport/logout');
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}

/**
 * 选择Owner切换
 */
export async function selectOwnerApi(data: { owner_id: number; owner_type: OwnerType }) {
  return requestClient.post<AuthApi.LoginResult>('/v1/passport/owner/selection', data);
}
