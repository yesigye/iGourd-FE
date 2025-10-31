import type {
  TransferDetailParams,
  TransferDetailResponse,
  TransferParams,
  TransferResponse,
} from '../../types/transfer';

import { requestClient as request } from '#/api/request';

/**
 * 获取库存调拨列表
 */
export function getTransferList(params: TransferParams) {
  return request.post<TransferResponse>(
    '/v1/merchant/basics/inventory/stock-transfer/page-list',
    params,
  );
}

/**
 * 获取库存调拨详情
 */
export function getTransferDetail(params: TransferDetailParams) {
  return request.post<TransferDetailResponse>(
    '/v1/merchant/basics/inventory/stock-transfer/detail',
    params,
  );
}

/**
 * 删除库存调拨
 */
export function removeTransfer(params: {
  merchant_id: number;
  stock_transfer_ids: number[];
}) {
  return request.post(
    '/v1/merchant/basics/inventory/stock-transfer/remove',
    params,
  );
}

/**
 * 创建库存调拨
 *
 *
 */
export function createTransfer(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/stock-transfer/create',
    data,
  );
}

/**
 * 更新库存调拨
 */
export function modifyTransfer(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/stock-transfer/modify',
    data,
  );
}


/**
 * 更新调拨状态
 */
export function updateTransferStatus(params: {
  destination_status?: string;
  handler_type: string;
  id: number;
  merchant_id: number;
  status?: string;
}) {
  return request.post('/v1/merchant/basics/inventory/stock-transfer/status/modify', params);
}

/**
 * 审核调拨状态
 */
export function reviewTransferStatus(params: {
  destination_review_status?: string;
  handler_type: string;
  id: number;
  merchant_id: number;
  review_opinion?: string;
  review_status?: string;
  stock_transfer_review_item?: any[];
}) {
  return request.post('/v1/merchant/basics/inventory/stock-transfer/review', params);
}

/**
 * 打印调拨单
 */
export function printTransfer(params: {
  merchant_id: number;
  stock_transfer_id: number;
}) {
  return request.post('/inventory/transfer/print', params);
}

/**
 * 基于商户ID查询商户列表
 */
export function getSameMerchantApi(params: { id: number }) {
  return request.post(
    `/v1/merchant/basics/merchant/list/same-merchant/${params.id}`,
    params,
  );
}

//  调拨单详情入库数量更新接口
export function stockTransferStorageModify(params: {
  id: number;
  transfer_in_quantity: number;
}[]) {
  return request.post('/v1/merchant/basics/inventory/stock-transfer/storage/modify', params);
}
//  调拨单详情出库数量更新接口
export function stockTransferOutboundModify(params: {
  id: number;
  transfer_out_quantity: number;
}[]) {
  return request.post('/v1/merchant/basics/inventory/stock-transfer/outbound/modify', params);
}


