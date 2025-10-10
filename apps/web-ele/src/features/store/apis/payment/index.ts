import { requestClient as request } from '#/api/request';

/**
 * 获取支付方式列表
 */
export function getPaymentMethodList(params: Record<string, any>) {
  return request.post('/v1/merchant/basics/merchant/order/page-list', params);
}
