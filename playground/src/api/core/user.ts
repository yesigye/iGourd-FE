import type { UserInfo } from '@igourd/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/v1/passport/user/info');
}

/**
 * 获取用户菜单权限
 */
export async function getUserMenusApi() {
  return requestClient.get('/v1/passport/menu/user/menus');
}

/**
 * 获取用户角色信息
 */
export async function getUserRolesApi() {
  return requestClient.get('/v1/passport/role/user/roles');
}
