import type { UserInfo } from '@igourd/types';

import { requestClient } from '#/api/request';

export interface MenuCollectParams {
  app_id: string;
  app_key: string;
  owner_id: string;
  owner_type: 'MERCHANT';
  user_id: string;
}

export interface MenuCollectToggleParams {
  app_id: string;
  app_key: string;
  menu_id: string;
  owner_id: string;
  owner_type: 'MERCHANT';
  status: 'CANCEL' | 'COLLECTED';
  user_id: string;
}
/**
 * 获取用户信息
 */
export async function getUserInfoApi(data: {
  owner_id: string;
  owner_type: string;
}) {
  const res = await requestClient.post<UserInfo>(
    `/v1/passport/owner/selection`,
    data,
  );
  return {
    ...res,
    type: res.type.value,
    current_login_user_app: {
      ...res.current_login_user_app,
      owner_type: res.current_login_user_app.owner_type.value,
    },
    user_model: {
      ...res.user_model,
      type: res.user_model.type.value,
      user_apps: res.user_model.user_apps?.map((app) => {
        return {
          ...app,
          owner_type: app.owner_type.value,
        };
      }),
    },
  };
  // return res;
}

export async function basicsMerchantList(data: any) {
  return requestClient.post('/v1/merchant/basics/merchant/list', data);
}

/**
 * 获取用户角色信息
 */
export async function getUserRolesApi() {
  return requestClient.get('/v1/passport/role/user/roles');
}
/**
 * 获取菜单收藏列表
 * @param data
 * @returns
 */
export async function getMenuCollect(data: MenuCollectParams) {
  return requestClient.post('/v1/passport/menucollect/list', data);
}
/**
 * 菜单收藏操作
 * @param data
 * @returns
 */
export async function toggleCollect(data: MenuCollectToggleParams) {
  if (Reflect.get(data, 'status') === 'COLLECTED') {
    Reflect.set(data, 'status', 'CANCEL');
  } else {
    Reflect.set(data, 'status', 'COLLECTED');
  }
  return requestClient.post('/v1/passport/menucollect/operate', data);
}
