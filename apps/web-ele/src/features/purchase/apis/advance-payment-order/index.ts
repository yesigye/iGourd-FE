import type {
  advancePaymentOrderDetails,
  advancePaymentOrderModifyV0,
  advancePaymentOrderPageListV0,
  advancePaymentOrderRemoveV0,
  advancePaymentOrderReviewStatusModifyV0,
  RootObject,
} from '@@/purchase/types/advance-payment-order';

import { requestClient } from '#/api/request';
/**
 * @description 获取付款单单分页列表
 */
export function getAdvancePaymentOrderPageListApi(
  data: advancePaymentOrderPageListV0,
) {
  return requestClient.post(
    `/v1/merchant/purchase/advance-payment-order/page-list`,
    data,
  );
}
/**
 * @description 获取付款单创建
 */
export function createAdvancePaymentOrderApi(data: RootObject) {
  return requestClient.post(
    `/v1/merchant/purchase/advance-payment-order/create`,
    data,
  );
}
/**
 * @description 获取付款单修改
 */
export function updateAdvancePaymentOrderApi(
  data: advancePaymentOrderModifyV0,
) {
  return requestClient.post(
    `/v1/merchant/purchase/advance-payment-order/modify`,
    data,
  );
}
/**
 * @description 获取付款单详情
 */
export function getAdvancePaymentOrderDetailApi(
  data: advancePaymentOrderDetails,
) {
  return requestClient.post(
    `/v1/merchant/purchase/advance-payment-order/detail`,
    data,
  );
}
/**
 * @description 获取付款单删除
 */
export function deleteAdvancePaymentOrderApi(
  data: advancePaymentOrderRemoveV0,
) {
  return requestClient.post(
    `/v1/merchant/purchase/advance-payment-order/remove`,
    data,
  );
}
/**
 * @description 获取付款单审核状态修改
 */
export function updateAdvancePaymentOrderAuditStatusApi(
  data: advancePaymentOrderReviewStatusModifyV0,
) {
  return requestClient.post(
    `/v1/merchant/purchase/advance-payment-order/status/modify`,
    data,
  );
}
