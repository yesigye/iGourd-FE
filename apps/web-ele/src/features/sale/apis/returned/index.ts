import { requestClient } from '#/api/request';

// 获取退货单分页列表
export function getReturnedOrderListApi(data: any) {
  return requestClient.post('/v1/merchant/sale/returned/page-list', data);
}

// 创建退货单
export function createReturnedOrderApi(data: any) {
  return requestClient.post('/v1/merchant/sale/returned/create', data);
}

// 更新退货单
export function updateReturnedOrderApi(data: any) {
  return requestClient.post('/v1/merchant/sale/returned/modify', data);
}

// 删除退货单
export function deleteReturnedOrderApi(returned_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/sale/returned/remove', {
    returned_id_list,
  });
}

// 审核退货单
export function approveReturnedOrderApi(data: any) {
  return requestClient.post('/v1/merchant/sale/returned/approve', data);
}

// 获取退货单详情
export function getReturnedOrderDetailApi(returned_id: number | string) {
  return requestClient.get(`/v1/merchant/sale/returned/detail/${returned_id}`);
}
