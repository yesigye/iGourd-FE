import { requestClient } from '#/api/request';

export function createRefund(data: any) {
  return requestClient.post('/v1/merchant/order/returned/create', data);
}
export function getOrderList(data: any) {
  return requestClient.post('/v1/merchant/order/page-list', data);
}
export function getValidOrderItems(data: any) {
  return requestClient.post(
    '/v1/merchant/order/returned/valid-order-items',
    data,
  );
}
export function cancelRefundOrder(data: any) {
  return requestClient.post(
    '/v1/merchant/order/order-returned/cancel-pending',
    data,
  );
}
export function orderReturnedDetails(data: any) {
  return requestClient.post('/v1/merchant/order/returned/detail', data);
}
export function orderRefundOffline(data: any) {
  return requestClient.post('/v1/merchant/order/returned/offline/refund', data);
}

export function refundableAmount(data: any) {
  return requestClient.post(
    '/v1/merchant/order/returned/calc/refund-amount',
    data,
  );
}
export function getRefundPrice(data: any) {
  return requestClient.post('/v1/merchant/order/returned/calc', data);
}
