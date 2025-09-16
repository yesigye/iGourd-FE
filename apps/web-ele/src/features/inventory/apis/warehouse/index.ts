import { requestClient } from '#/api/request';

// 获取仓库分页列表
export function getWarehouseListApi(data: any) {
  return requestClient.post('/v1/merchant/warehouse/page-list', data);
}

// 创建仓库
export function createWarehouseApi(data: any) {
  return requestClient.post('/v1/merchant/warehouse/create', data);
}

// 更新仓库
export function updateWarehouseApi(data: any) {
  return requestClient.post('/v1/merchant/warehouse/modify', data);
}

// 删除仓库
export function deleteWarehouseApi(warehouse_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/warehouse/remove', {
    warehouse_id_list,
  });
}

// 更新仓库状态
export function updateWarehouseStatusApi(data: any) {
  return requestClient.post('/v1/merchant/warehouse/update-status', data);
}

// 获取仓库详情
export function getWarehouseDetailApi(warehouse_id: number | string) {
  return requestClient.get(`/v1/merchant/warehouse/detail/${warehouse_id}`);
}
