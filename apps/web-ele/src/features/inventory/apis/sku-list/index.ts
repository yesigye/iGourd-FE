import type {
  SkuListItem,
  SkuListParams,
  SkuListResponse,
} from '../../types/sku-list';

import { requestClient as request } from '#/api/request';

/**
 * 获取SKU列表
 */
export function getSkuList(params: SkuListParams) {
  return request.post<SkuListResponse>(
    '/v1/merchant/basics/inventory/product-info/page-list',
    params,
  );
}

/**
 * 删除SKU
 */
export function deleteSku(params: {
  merchant_id: number;
  product_info_ids: number[];
}) {
  return request.post(
    '/v1/merchant/basics/inventory/product-info/remove',
    params,
  );
}

/**
 * 预检查删除SKU
 */
export function preCheckDeleteSku(params: {
  merchant_id: number;
  product_info_ids: number[];
}) {
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
// /v1/merchant/basics/inventory/product-info/modify
export function modifySku(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-info/modify',
    data,
  );
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
export function updateSkuStatus(params: {
  merchant_id: number;
  product_info_ids: number[];
  status: 'OFF_SALE' | 'ON_SALE';
}) {
  return request.post('/inventory/sku/update-status', params);
}
