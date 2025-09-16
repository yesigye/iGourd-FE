import { requestClient } from '#/api/request';

// 获取库存分页列表
export function getInventoryListApi(data: any) {
  return requestClient.post('/v1/merchant/inventory/page-list', data);
}

// 更新库存
export function updateInventoryApi(data: any) {
  return requestClient.post('/v1/merchant/inventory/update', data);
}

// 批量更新库存
export function batchUpdateInventoryApi(data: any) {
  return requestClient.post('/v1/merchant/inventory/batch-update', data);
}

// 获取库存详情
export function getInventoryDetailApi(inventory_id: number | string) {
  return requestClient.get(`/v1/merchant/inventory/detail/${inventory_id}`);
}

// 获取库存统计
export function getInventoryStatsApi(data: any) {
  return requestClient.post('/v1/merchant/inventory/stats', data);
}
