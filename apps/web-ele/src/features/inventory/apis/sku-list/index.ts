import { requestClient as request } from '#/api/request';
import type { SkuListParams, SkuListResponse, SkuListItem } from '../../types/sku-list';

/**
 * 获取SKU列表
 */
export function getSkuList(params: SkuListParams) {
  return request.post<SkuListResponse>('/inventory/sku/list', params);
}

/**
 * 删除SKU
 */
export function deleteSku(params: { merchant_id: number; product_info_ids: number[] }) {
  return request.post('/inventory/sku/delete', params);
}

/**
 * 预检查删除SKU
 */
export function preCheckDeleteSku(params: { merchant_id: number; product_info_ids: number[] }) {
  return request.post('/inventory/sku/pre-check-delete', params);
}

/**
 * 获取SKU详情
 */
export function getSkuDetail(params: { id: number; merchant_id: number }) {
  return request.post<SkuListItem>('/inventory/sku/detail', params);
}

/**
 * 更新SKU
 */
export function updateSku(data: any) {
  return request.post('/inventory/sku/update', data);
}

/**
 * 创建SKU
 */
export function createSku(data: any) {
  return request.post('/inventory/sku/create', data);
}

/**
 * 批量更新SKU状态
 */
export function updateSkuStatus(params: { merchant_id: number; product_info_ids: number[]; status: 'ON_SALE' | 'OFF_SALE' }) {
  return request.post('/inventory/sku/update-status', params);
}
