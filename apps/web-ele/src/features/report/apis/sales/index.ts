import { requestClient } from '#/api/request';

// 获取销售报表数据
export function getSalesReportApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/reports/report-product/page-list',
    data,
  );
}

// 导出销售报表
export function exportSalesReportApi(data: any) {
  return requestClient.post('/v1/merchant/report/sales/export', data);
}

// 获取销售统计信息
export function getSalesStatsApi(data: any) {
  return requestClient.post('/v1/merchant/report/sales/stats', data);
}
// 商品销售报表统计
export function getProductSalesStatsApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/reports/report-product/basic-info',
    data,
  );
}
