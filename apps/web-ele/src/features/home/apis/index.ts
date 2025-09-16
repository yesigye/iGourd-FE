import { requestClient } from '#/api/request';

// 获取首页数据
export function getHomeDataApi() {
  return requestClient.get('/v1/merchant/home/data');
}

// 获取首页统计
export function getHomeStatsApi() {
  return requestClient.get('/v1/merchant/home/stats');
}
