import type {
  PurchaseReturnedCreateVO,
  PurchaseReturnedModifyVO,
  PurchaseReturnedQueryPageVO,
  PurchaseReturnedRemoveVO,
} from '@@/purchase/types';

import { requestClient } from '#/api/request';

const PURCHASE_RETURNED_BASE_URL = '/v1/merchant/purchase/returned';

// 获取退货单分页列表
export function getPurchaseReturnedPageListApi(
  data: PurchaseReturnedQueryPageVO,
) {
  return requestClient.post(`${PURCHASE_RETURNED_BASE_URL}/page-list`, data);
}

// 创建退货单
export function createPurchaseReturnedApi(data: PurchaseReturnedCreateVO) {
  return requestClient.post(`${PURCHASE_RETURNED_BASE_URL}/create`, data);
}

// 更新退货单
export function updatePurchaseReturnedApi(data: PurchaseReturnedModifyVO) {
  return requestClient.post(`${PURCHASE_RETURNED_BASE_URL}/modify`, data);
}

// 删除退货单
export function deletePurchaseReturnedApi(data: PurchaseReturnedRemoveVO) {
  return requestClient.post(`${PURCHASE_RETURNED_BASE_URL}/remove`, data);
}

// 获取退货单详情
export function getPurchaseReturnedDetailApi(data: {
  merchant_id?: number;
  returned_id: number;
}) {
  return requestClient.post(`${PURCHASE_RETURNED_BASE_URL}/detail`, data);
}

// 审核退货单
export function auditPurchaseReturnedApi(data: {
  merchant_id?: number;
  remark?: string;
  returned_id: number;
  status: string;
}) {
  return requestClient.post(`${PURCHASE_RETURNED_BASE_URL}/audit`, data);
}
