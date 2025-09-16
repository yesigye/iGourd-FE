import { requestClient } from '#/api/request';

// 获取客户报表数据
export function getCustomerReportApi(data: any) {
  return requestClient.post('/v1/merchant/report/customer', data);
}

// 导出客户报表
export function exportCustomerReportApi(data: any) {
  return requestClient.post('/v1/merchant/report/customer/export', data);
}

// 获取客户统计信息
export function getCustomerStatsApi(data: any) {
  return requestClient.post('/v1/merchant/report/customer/stats', data);
}
