import type {
  PurchaseReceiptCreateVO,
  PurchaseReceiptModifyVO,
  PurchaseReceiptQueryPageVO,
  PurchaseReceiptRemoveVO,
} from '@@/purchase/types';

import { requestClient } from '#/api/request';

import { getPurchaseOrderDetailApi } from '..';

const PURCHASE_RECEIPT_BASE_URL = '/v1/merchant/purchase/goods-receipt-note';

// 获取收货单分页列表
export function getPurchaseReceiptPageListApi(
  data: PurchaseReceiptQueryPageVO,
) {
  return requestClient.post(`${PURCHASE_RECEIPT_BASE_URL}/page-list`, data);
}

// 创建收货单
export function createPurchaseReceiptApi(data: PurchaseReceiptCreateVO) {
  return requestClient.post(`${PURCHASE_RECEIPT_BASE_URL}/create`, data);
}

// 更新收货单
export function updatePurchaseReceiptApi(data: PurchaseReceiptModifyVO) {
  return requestClient.post(`${PURCHASE_RECEIPT_BASE_URL}/modify`, data);
}

// 删除收货单
export function deletePurchaseReceiptApi(data: PurchaseReceiptRemoveVO) {
  return requestClient.post(`${PURCHASE_RECEIPT_BASE_URL}/remove`, data);
}

// 获取收货单详情
function receiptDetail(data: any) {
  return requestClient
    .post(`${PURCHASE_RECEIPT_BASE_URL}/detail`, data)
    .then((res) => {
      return res;
    });
}
export function getPurchaseReceiptDetailApi({
  goods_receipt_note_id,
  purchase_order_id,
}: any) {
  return Promise.all([
    receiptDetail({ goods_receipt_note_id, purchase_order_id }),
    //getPurchaseOrderDetailApi({ purchase_order_id }),
  ]).then(([receipt]) => {
    return {
      ...receipt,
    };
  });
}

// 审核收货单
export function auditPurchaseReceiptApi(data: {
  merchant_id?: number;
  receipt_id: number;
  remark?: string;
  status: string;
}) {
  return requestClient.post(`${PURCHASE_RECEIPT_BASE_URL}/review`, data);
}
