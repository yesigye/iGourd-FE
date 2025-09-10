import { requestClient } from '#/api/request';

// 获取员工分页列表
export function getEmployeePageListApi(data: any) {
  return requestClient.post(`/merchant/employee/user/page-list`, data);
}

// 获取员工列表
export function getEmployeeListApi(data: any) {
  return requestClient.post(`/merchant/employee/user/list`, data);
}

// 获取员工详情
export function getEmployeeDetailApi(id: string) {
  return requestClient.get(`/merchant/employee/user/${id}`);
}

// 创建员工
export function createEmployeeApi(data: any) {
  return requestClient.post(`/merchant/employee/user`, data);
}

// 更新员工
export function updateEmployeeApi(id: string, data: any) {
  return requestClient.put(`/merchant/employee/user/${id}`, data);
}

// 删除员工
export function deleteEmployeeApi(id: string) {
  return requestClient.delete(`/merchant/employee/user/${id}`);
}

// 批量删除员工
export function batchDeleteEmployeeApi(ids: string[]) {
  return requestClient.delete(`/merchant/employee/user/batch`, { data: { ids } });
}

// 冻结员工账户
export function freezeEmployeeApi(data: any) {
  return requestClient.post(`/merchant/employee/user/freeze`, data);
}

// 解冻员工账户
export function unfreezeEmployeeApi(data: any) {
  return requestClient.post(`/merchant/employee/user/unfreeze`, data);
}

// 重置员工密码
export function resetEmployeePasswordApi(data: any) {
  return requestClient.post(`/merchant/employee/user/reset-password`, data);
}

// ==================== 操作日志 APIs ====================

// 获取操作日志列表
export function getOperationLogListApi(data: any) {
  return requestClient.post(`/merchant/employee/operation-log/list`, data);
}

// 获取操作日志详情
export function getOperationLogDetailApi(id: string) {
  return requestClient.get(`/merchant/employee/operation-log/${id}`);
}

// ==================== 角色管理 APIs ====================

// 获取角色列表
export function getRoleListApi(data: any) {
  return requestClient.post(`/merchant/employee/role/list`, data);
}

// 获取角色详情
export function getRoleDetailApi(id: string) {
  return requestClient.get(`/merchant/employee/role/${id}`);
}

// 创建角色
export function createRoleApi(data: any) {
  return requestClient.post(`/merchant/employee/role`, data);
}

// 更新角色
export function updateRoleApi(data: any) {
  return requestClient.put(`/merchant/employee/role/${data.role_id}`, data);
}

// 删除角色
export function deleteRoleApi(id: string) {
  return requestClient.delete(`/merchant/employee/role/${id}`);
}

// 批量删除角色
export function batchDeleteRoleApi(ids: string[]) {
  return requestClient.delete(`/merchant/employee/role/batch`, { data: { ids } });
}

// 保持原有的对象导出方式（向后兼容）
export const employeeApi = {
  getPageList: getEmployeePageListApi,
  getList: getEmployeeListApi,
  getDetail: getEmployeeDetailApi,
  create: createEmployeeApi,
  update: updateEmployeeApi,
  delete: deleteEmployeeApi,
  batchDelete: batchDeleteEmployeeApi,
  freeze: freezeEmployeeApi,
  unfreeze: unfreezeEmployeeApi,
  resetPassword: resetEmployeePasswordApi,
  // 操作日志
  getOperationLogList: getOperationLogListApi,
  getOperationLogDetail: getOperationLogDetailApi,
  // 角色管理
  getRoleList: getRoleListApi,
  getRoleDetail: getRoleDetailApi,
  createRole: createRoleApi,
  updateRole: updateRoleApi,
  deleteRole: deleteRoleApi,
  batchDeleteRole: batchDeleteRoleApi,
};


