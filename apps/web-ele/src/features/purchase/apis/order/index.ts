import type {
  PurchaseOrderCreateVO,
  PurchaseOrderModifyVO,
  PurchaseOrderQueryPageVO,
  PurchaseOrderRemoveVO,
} from '@@/purchase/types';

import { requestClient } from '#/api/request';

// 获取采购订单分页列表
export function getPurchaseOrderPageListApi(data: PurchaseOrderQueryPageVO) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/page-list`,
    data,
  );
}

// 创建采购订单
export function createPurchaseOrderApi(data: PurchaseOrderCreateVO) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/create`,
    data,
  );
}

// 更新采购订单
export function updatePurchaseOrderApi(data: PurchaseOrderModifyVO) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/modify`,
    data,
  );
}

// 删除采购订单
export function deletePurchaseOrderApi(data: PurchaseOrderRemoveVO) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/remove`,
    data,
  );
}

// 获取采购订单详情
export function getPurchaseOrderDetailApi(data: { purchase_order_id: string }) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/detail`,
    data,
  );
}

// 审核采购订单
export function reviewPurchaseOrderApi(data: {
  merchant_id?: number;
  order_id: number;
  remark?: string;
  status: string;
}) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/review`,
    data,
  );
}

// 结算采购订单
export function settlePurchaseOrderApi(data: {
  merchant_id?: number;
  order_id: number;
  payment_amount: number;
}) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/settlement`,
    data,
  );
}
