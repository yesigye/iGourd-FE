import type {
  PurchaseOrderQueryPageVO,
  PurchaseOrderPageModel,
  PurchaseOrderCreateVO,
  PurchaseOrderModifyVO,
  PurchaseOrderRemoveVO,
  PurchaseOrderDetailModel,
} from '@@/purchase/types';

import { requestClient } from '#/api/request';

const PURCHASE_ORDER_BASE_URL = '/merchant/purchase/order';

// 获取采购订单分页列表
export function getPurchaseOrderPageListApi(data: PurchaseOrderQueryPageVO) {
  return requestClient.post(
    `${PURCHASE_ORDER_BASE_URL}/page-list`,
    data,
  );
}

// 创建采购订单
export function createPurchaseOrderApi(data: PurchaseOrderCreateVO) {
  return requestClient.post(
    `${PURCHASE_ORDER_BASE_URL}/create`,
    data,
  );
}

// 更新采购订单
export function updatePurchaseOrderApi(data: PurchaseOrderModifyVO) {
  return requestClient.post(
    `${PURCHASE_ORDER_BASE_URL}/modify`,
    data,
  );
}

// 删除采购订单
export function deletePurchaseOrderApi(data: PurchaseOrderRemoveVO) {
  return requestClient.post(
    `${PURCHASE_ORDER_BASE_URL}/remove`,
    data,
  );
}

// 获取采购订单详情
export function getPurchaseOrderDetailApi(data: { order_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${PURCHASE_ORDER_BASE_URL}/detail`,
    data,
  );
}

// 审核采购订单
export function auditPurchaseOrderApi(data: { order_id: number; status: string; remark?: string; merchant_id?: number }) {
  return requestClient.post(
    `${PURCHASE_ORDER_BASE_URL}/audit`,
    data,
  );
}

// 结算采购订单
export function settlePurchaseOrderApi(data: { order_id: number; payment_amount: number; merchant_id?: number }) {
  return requestClient.post(
    `${PURCHASE_ORDER_BASE_URL}/settle`,
    data,
  );
}
