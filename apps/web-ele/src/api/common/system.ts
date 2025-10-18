import { requestClient } from '#/api/request';

export const getSystemConfigurationDetailApi = (data: any) => {
  return requestClient.post(
    `/v1/merchant/basics/settings/setting-merchant-system/detail`,
    data,
  );
};
export const updateSystemConfigurationApi = (data: any) => {
  return requestClient.post(
    `/v1/merchant/basics/settings/setting-merchant-system/modify`,
    data,
  );
};
export const merchantOverviewApi = (data: any) => {
  return requestClient.post(`/v1/merchant/basics/dashboard/overview`, data);
};
// 获取统计信息
export function getStatisticsApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/reports/report-merchant/statistics',
    data,
  );
}
// 财会数据统计
export function getAccountingStatisticsApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/dashboard/accounting-statistics',
    data,
  );
}
