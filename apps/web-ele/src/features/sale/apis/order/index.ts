import { requestClient } from '#/api/request';

// 获取销售订单分页列表
export function getSaleOrderListApi(data: any) {
  return requestClient.post('/v1/merchant/order/page-list', data);
}

// 创建销售订单
export function createSaleOrderApi(data: any) {
  return requestClient.post('/v1/merchant/order/create', data);
}

// 更新销售订单
export function updateSaleOrderApi(data: any) {
  return requestClient.post('/v1/merchant/order/modify', data);
}

// 删除销售订单
export function deleteSaleOrderApi(order_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/order/remove', {
    order_id_list,
  });
}

// 审核销售订单
export function approveSaleOrderApi(data: any) {
  return requestClient.post('/v1/merchant/order/approve', data);
}

// 获取销售订单详情
export function getSaleOrderDetailApi(order_id: number | string) {
  return requestClient.get(`/v1/merchant/order/detail/${order_id}`);
}
