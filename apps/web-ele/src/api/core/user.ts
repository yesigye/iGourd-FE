import type { MenuInfo, UserInfo } from '@igourd/types';

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
  status: 'COLLECTED' | 'CANCEL';
  user_id: string;
}
/**
 * 获取用户信息
 */
export async function getUserInfoApi(data: {
  owner_id: string;
  owner_type: string;
}) {
  return requestClient.post<UserInfo>(`/v1/passport/owner/selection`, data);
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
