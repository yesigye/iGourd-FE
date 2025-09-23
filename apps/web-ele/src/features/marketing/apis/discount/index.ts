import { requestClient } from '#/api/request';

// 获取折扣分页列表
export function getDiscountListApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/promotion/page-list',
    data,
  );
}

// 创建折扣
export function createDiscountApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/promotion/create',
    data,
  );
}

// 更新折扣
export function updateDiscountApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/promotion/modify',
    data,
  );
}

// 删除折扣
export function deleteDiscountApi(discount_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/basics/marketing/promotion/remove', {
    discount_id_list,
  });
}

// 更新折扣状态
export function updateDiscountStatusApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/promotion/update-status',
    data,
  );
}

// 获取折扣详情
export function getDiscountDetailApi(discount_id: number | string) {
  return requestClient.get(
    `/v1/merchant/basics/marketing/promotion/detail/${discount_id}`,
  );
}
