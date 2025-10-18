import { requestClient } from '#/api/request';

// 获取首页数据
export function getFirstHomeOverviewApi(data) {
  return requestClient.post(
    '/v1/merchant/basics/dashboard/boss/overview',
    data,
  );
}

export function getFirstHomeNewsApi(data) {
  return requestClient.post(
    '/v1/merchant/basics/merchant-news/page-list',
    data,
  );
}
export function getFirstHomeStatisticsApi(data) {
  return requestClient.post(
    '/v1/merchant/basics/dashboard/boss/report-merchant/statistics',
    data,
  );
}
