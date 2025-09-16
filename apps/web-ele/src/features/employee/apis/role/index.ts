import { requestClient } from '#/api/request';

// 获取角色分页列表
export function getRoleListApi(data: any) {
  return requestClient.post('/v1/merchant/role/page-list', data);
}

// 创建角色
export function createRoleApi(data: any) {
  return requestClient.post('/v1/merchant/role/create', data);
}

// 更新角色
export function updateRoleApi(data: any) {
  return requestClient.post('/v1/merchant/role/modify', data);
}

// 删除角色
export function deleteRoleApi(role_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/role/remove', {
    role_id_list,
  });
}

// 获取角色详情
export function getRoleDetailApi(role_id: number | string) {
  return requestClient.get(`/v1/merchant/role/detail/${role_id}`);
}

// 获取角色权限
export function getRolePermissionsApi(role_id: number | string) {
  return requestClient.get(`/v1/merchant/role/permissions/${role_id}`);
}

// 更新角色权限
export function updateRolePermissionsApi(data: any) {
  return requestClient.post('/v1/merchant/role/update-permissions', data);
}
