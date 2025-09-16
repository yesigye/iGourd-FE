import { requestClient } from '#/api/request';

// 获取财务报表数据
export function getFinancialReportApi(data: any) {
  return requestClient.post('/v1/merchant/report/financial', data);
}

// 导出财务报表
export function exportFinancialReportApi(data: any) {
  return requestClient.post('/v1/merchant/report/financial/export', data);
}

// 获取财务统计信息
export function getFinancialStatsApi(data: any) {
  return requestClient.post('/v1/merchant/report/financial/stats', data);
}
