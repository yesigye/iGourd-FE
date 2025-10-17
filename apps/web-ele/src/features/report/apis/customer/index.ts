import { requestClient } from '#/api/request';

// 获取客户统计信息
export function getCustomerStatisticsApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/reports/report-merchant/statistics',
    data,
  );
}
// 获取客户报表
export function getCustomerSalesReport(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/reports/report-merchant/customer/overview',
    data,
  );
}
