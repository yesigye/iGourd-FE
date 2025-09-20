import type {
  paymentOrderDetails,
  paymentOrderModifyV0,
  paymentOrderPageListV0,
  paymentOrderRemoveV0,
  paymentOrderReviewStatusModifyV0,
  RootObject,
} from '../../types/payment-order';

import { requestClient } from '#/api/request';
/**
 * @description 获取付款单单分页列表
 */
export function getPaymentOrderPageListApi(data: paymentOrderPageListV0) {
  return requestClient.post(
    `/v1/merchant/purchase/payment-order/page-list`,
    data,
  );
}
/**
 * @description 获取付款单创建
 */
export function createPaymentOrderApi(data: RootObject) {
  return requestClient.post(`/v1/merchant/purchase/payment-order/create`, data);
}
/**
 * @description 获取付款单修改
 */
export function updatePaymentOrderApi(data: paymentOrderModifyV0) {
  return requestClient.post(`/v1/merchant/purchase/payment-order/modify`, data);
}
/**
 * @description 获取付款单详情
 */
export function getPaymentOrderDetailApi(data: paymentOrderDetails) {
  return requestClient.post(`/v1/merchant/purchase/payment-order/detail`, data);
}
/**
 * @description 获取付款单删除
 */
export function deletePaymentOrderApi(data: paymentOrderRemoveV0) {
  return requestClient.post(`/v1/merchant/purchase/payment-order/remove`, data);
}
/**
 * @description 获取付款单审核状态修改
 */
export function updatePaymentOrderAuditStatusApi(
  data: paymentOrderReviewStatusModifyV0,
) {
  return requestClient.post(
    `/v1/merchant/purchase/payment-order/status/modify`,
    data,
  );
}
