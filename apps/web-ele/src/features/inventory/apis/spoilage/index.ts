import { requestClient as request } from '#/api/request';
import type { SpoilageParams, SpoilageResponse, SpoilageItem, SpoilageDetailParams, SpoilageDetailResponse } from '../../types/spoilage';

/**
 * 获取库存损耗列表
 */
export function getSpoilageList(params: SpoilageParams) {
  return request.post<SpoilageResponse>('/inventory/spoilage/list', params);
}

/**
 * 获取库存损耗详情
 */
export function getSpoilageDetail(params: SpoilageDetailParams) {
  return request.post<SpoilageDetailResponse>('/inventory/spoilage/detail', params);
}

/**
 * 删除库存损耗
 */
export function deleteSpoilage(params: { stock_consumption_ids: number[]; merchant_id: number }) {
  return request.post('/inventory/spoilage/delete', params);
}

/**
 * 创建库存损耗
 */
export function createSpoilage(data: any) {
  return request.post('/inventory/spoilage/create', data);
}

/**
 * 更新库存损耗
 */
export function updateSpoilage(data: any) {
  return request.post('/inventory/spoilage/update', data);
}

/**
 * 审核通过库存损耗
 */
export function approveSpoilage(params: { id: number; merchant_id: number; review_opinion?: string }) {
  return request.post('/inventory/spoilage/approve', params);
}

/**
 * 审核拒绝库存损耗
 */
export function rejectSpoilage(params: { id: number; merchant_id: number; review_opinion?: string }) {
  return request.post('/inventory/spoilage/reject', params);
}

/**
 * 打印库存损耗单
 */
export function printSpoilage(params: { stock_consumption_id: number; merchant_id: number }) {
  return request.post('/inventory/spoilage/print', params);
}
