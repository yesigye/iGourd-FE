import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    app_key: string;
    login_account: string;
    password: string;
    type:
      | 'EMAIL'
      | 'LOGIN_ID'
      | 'PHONE_NUMBER'
      | 'WECHAT_OPENID'
      | 'WHATS_APP_OPENID';
    country_area_code?: string;
    country_id?: number;
    owner_id?: number;
    owner_type?: 'BOSS' | 'CUSTOMER' | 'MERCHANT' | 'PARTNER';
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    jwt_token: {
      expires_in: number;
      jwt_token: string;
      token_id: string;
      token_type: string;
    };
    user_model: {
      email?: string;
      id: number;
      login_id: string;
      phone_number?: string;
      real_name: string;
      status: string;
    };
    function_trees: Array<{
      children?: any[];
      id: number;
      key: string;
      name: string;
    }>;
    user_apps: Array<{
      app_key: string;
      id: number;
      owner_id: number;
      owner_type: string;
    }>;
    current_login_user_app: {
      app_key: string;
      id: number;
      owner_id: number;
      owner_type: string;
    };
  }

  export interface RefreshTokenResult {
    jwt_token: {
      token_id: string;
    };
  }

  /** Token刷新请求参数 */
  export interface RefreshTokenParams {
    owner_id: number;
    owner_type: 'BOSS' | 'CUSTOMER' | 'MERCHANT' | 'PARTNER';
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
export async function refreshTokenApi(data: any) {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/passport/token-id/refresh',
    data,
    {
      withCredentials: true,
    },
  );
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
export async function selectOwnerApi(data: {
  owner_id: number;
  owner_type: string;
}) {
  return requestClient.post<AuthApi.LoginResult>(
    '/v1/passport/owner/selection',
    data,
  );
}
