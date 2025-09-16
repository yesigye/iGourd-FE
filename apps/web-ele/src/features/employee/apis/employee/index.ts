import { requestClient } from '#/api/request';

// 获取员工分页列表
export function getEmployeeListApi(data: any) {
  return requestClient.post('/v1/merchant/employee/page-list', data);
}

// 创建员工
export function createEmployeeApi(data: any) {
  return requestClient.post('/v1/merchant/employee/create', data);
}

// 更新员工
export function updateEmployeeApi(data: any) {
  return requestClient.post('/v1/merchant/employee/modify', data);
}

// 删除员工
export function deleteEmployeeApi(employee_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/employee/remove', {
    employee_id_list,
  });
}

// 更新员工状态
export function updateEmployeeStatusApi(data: any) {
  return requestClient.post('/v1/merchant/employee/update-status', data);
}

// 获取员工详情
export function getEmployeeDetailApi(employee_id: number | string) {
  return requestClient.get(`/v1/merchant/employee/detail/${employee_id}`);
}
