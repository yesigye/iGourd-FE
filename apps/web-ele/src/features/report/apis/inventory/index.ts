import { requestClient } from '#/api/request';

// 获取库存报表数据
export function getInventoryReportApi(data: any) {
  return requestClient.post('/v1/merchant/report/inventory', data);
}

// 导出库存报表
export function exportInventoryReportApi(data: any) {
  return requestClient.post('/v1/merchant/report/inventory/export', data);
}

// 获取库存统计信息
export function getInventoryStatsApi(data: any) {
  return requestClient.post('/v1/merchant/report/inventory/stats', data);
}
