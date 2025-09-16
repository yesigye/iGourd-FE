import type {
  PurchaseReturnedQueryPageVO,
  PurchaseReturnedPageModel,
  PurchaseReturnedCreateVO,
  PurchaseReturnedModifyVO,
  PurchaseReturnedRemoveVO,
  PurchaseReturnedDetailModel,
} from '@@/purchase/types';

import { requestClient } from '#/api/request';

const PURCHASE_RETURNED_BASE_URL = '/merchant/purchase/returned';

// 获取退货单分页列表
export function getPurchaseReturnedPageListApi(data: PurchaseReturnedQueryPageVO) {
  return requestClient.post(
    `${PURCHASE_RETURNED_BASE_URL}/page-list`,
    data,
  );
}

// 创建退货单
export function createPurchaseReturnedApi(data: PurchaseReturnedCreateVO) {
  return requestClient.post(
    `${PURCHASE_RETURNED_BASE_URL}/create`,
    data,
  );
}

// 更新退货单
export function updatePurchaseReturnedApi(data: PurchaseReturnedModifyVO) {
  return requestClient.post(
    `${PURCHASE_RETURNED_BASE_URL}/modify`,
    data,
  );
}

// 删除退货单
export function deletePurchaseReturnedApi(data: PurchaseReturnedRemoveVO) {
  return requestClient.post(
    `${PURCHASE_RETURNED_BASE_URL}/remove`,
    data,
  );
}

// 获取退货单详情
export function getPurchaseReturnedDetailApi(data: { returned_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${PURCHASE_RETURNED_BASE_URL}/detail`,
    data,
  );
}

// 审核退货单
export function auditPurchaseReturnedApi(data: { returned_id: number; status: string; remark?: string; merchant_id?: number }) {
  return requestClient.post(
    `${PURCHASE_RETURNED_BASE_URL}/audit`,
    data,
  );
}
