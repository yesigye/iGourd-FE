import { request } from '@/utils/request';
import type { TransferParams, TransferResponse, TransferItem, TransferDetailParams, TransferDetailResponse } from '../../types/transfer';

/**
 * 获取库存调拨列表
 */
export function getTransferList(params: TransferParams) {
  return request.post<TransferResponse>('/inventory/transfer/list', params);
}

/**
 * 获取库存调拨详情
 */
export function getTransferDetail(params: TransferDetailParams) {
  return request.post<TransferDetailResponse>('/inventory/transfer/detail', params);
}

/**
 * 删除库存调拨
 */
export function deleteTransfer(params: { stock_transfer_ids: number[]; merchant_id: number }) {
  return request.post('/inventory/transfer/delete', params);
}

/**
 * 创建库存调拨
 */
export function createTransfer(data: any) {
  return request.post('/inventory/transfer/create', data);
}

/**
 * 更新库存调拨
 */
export function updateTransfer(data: any) {
  return request.post('/inventory/transfer/update', data);
}

/**
 * 更新调拨状态
 */
export function updateTransferStatus(params: {
  id: number;
  merchant_id: number;
  status?: string;
  destination_status?: string;
  handler_type: string;
}) {
  return request.post('/inventory/transfer/update-status', params);
}

/**
 * 审核调拨状态
 */
export function reviewTransferStatus(params: {
  id: number;
  merchant_id: number;
  review_status?: string;
  destination_review_status?: string;
  review_opinion?: string;
  handler_type: string;
  stock_transfer_review_item?: any[];
}) {
  return request.post('/inventory/transfer/review-status', params);
}

/**
 * 打印调拨单
 */
export function printTransfer(params: { stock_transfer_id: number; merchant_id: number }) {
  return request.post('/inventory/transfer/print', params);
}
