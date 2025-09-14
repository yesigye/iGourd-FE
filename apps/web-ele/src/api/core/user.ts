import type { UserInfo } from '@igourd/types';

import { requestClient } from '#/api/request';

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
  return requestClient.post('/merchant/basics/merchant/list', data);
}

/**
 * 获取用户角色信息
 */
export async function getUserRolesApi() {
  return requestClient.get('/v1/passport/role/user/roles');
}
