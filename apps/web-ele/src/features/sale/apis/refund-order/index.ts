import type {
  SaleRefundOrderQueryPageVO,
  SaleRefundOrderPageModel,
  SaleRefundOrderCreateVO,
  SaleRefundOrderModifyVO,
  SaleRefundOrderRemoveVO,
  SaleRefundOrderDetailModel,
} from '@@/sale/types';

import { requestClient } from '#/api/request';

const SALE_REFUND_ORDER_BASE_URL = '/v1/merchant/sale/refund-order';

// 获取退款订单分页列表
export function getSaleRefundOrderPageListApi(data: SaleRefundOrderQueryPageVO) {
  return requestClient.post(
    `${SALE_REFUND_ORDER_BASE_URL}/page-list`,
    data,
  );
}

// 创建退款订单
export function createSaleRefundOrderApi(data: SaleRefundOrderCreateVO) {
  return requestClient.post(
    `${SALE_REFUND_ORDER_BASE_URL}/create`,
    data,
  );
}

// 更新退款订单
export function updateSaleRefundOrderApi(data: SaleRefundOrderModifyVO) {
  return requestClient.post(
    `${SALE_REFUND_ORDER_BASE_URL}/modify`,
    data,
  );
}

// 删除退款订单
export function deleteSaleRefundOrderApi(data: SaleRefundOrderRemoveVO) {
  return requestClient.post(
    `${SALE_REFUND_ORDER_BASE_URL}/remove`,
    data,
  );
}

// 获取退款订单详情
export function getSaleRefundOrderDetailApi(data: { refund_order_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${SALE_REFUND_ORDER_BASE_URL}/detail`,
    data,
  );
}

// 取消退款订单
export function cancelSaleRefundOrderApi(data: { refund_order_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${SALE_REFUND_ORDER_BASE_URL}/cancel`,
    data,
  );
}

// 导出退款订单
export function exportSaleRefundOrderApi(data: SaleRefundOrderQueryPageVO) {
  return requestClient.post(
    `${SALE_REFUND_ORDER_BASE_URL}/export`,
    data,
  );
}
