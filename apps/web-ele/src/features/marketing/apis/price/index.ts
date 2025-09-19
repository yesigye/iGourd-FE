import { requestClient } from '#/api/request';

// 获取价格分页列表
export function getPriceListApi(data: any) {
  return requestClient.post('/v1/merchant/basics/marketing/price-level/page-list', data);
}

// 创建价格
export function createPriceApi(data: any) {
  return requestClient.post('/v1/merchant/marketing/price/create', data);
}

// 更新价格
export function updatePriceApi(data: any) {
  return requestClient.post('/v1/merchant/marketing/price/modify', data);
}

// 删除价格
export function deletePriceApi(price_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/marketing/price/remove', {
    price_id_list,
  });
}

// 更新价格状态
export function updatePriceStatusApi(data: any) {
  return requestClient.post('/v1/merchant/marketing/price/update-status', data);
}

// 获取价格详情
export function getPriceDetailApi(price_id: number | string) {
  return requestClient.get(`/v1/merchant/marketing/price/detail/${price_id}`);
}
