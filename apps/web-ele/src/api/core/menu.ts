import type { RouteRecordStringComponent } from '@igourd/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 * 注意：在新的API规范中，菜单信息通过登录响应的function_trees字段返回
 * 这个接口保持向后兼容，但建议使用登录响应中的function_trees
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}

/**
 * 获取用户菜单权限树
 * 新的API规范：通过登录响应获取
 */
export async function getUserMenusApi() {
  return requestClient.get('/v1/passport/menu/user/menus');
}

/**
 * 获取菜单树列表
 * 新的API规范：POST /v1/passport/menu/tree-list
 */
export async function getMenuTreeListApi(data: {
  app_key: string;
  menu_key?: string;
  menu_names?: string;
  menu_type?: 'DIRECTORY' | 'PAGE';
  menu_status?: 'ACTIVE' | 'FROZEN';
}) {
  return requestClient.post('/v1/passport/menu/tree-list', data);
}
