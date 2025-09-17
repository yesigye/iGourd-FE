import { requestClient as request } from '#/api/request';
import type { ProductListParams, ProductListResponse, ProductListItem } from '../../types/product-list';

/**
 * 获取商品列表
 */
export function getProductList(params: ProductListParams) {
  return request.post<ProductListResponse>('/inventory/product/list', params);
}

/**
 * 获取商品SKU列表
 */
export function getProductSKUList(params: ProductListParams) {
  return request.post<ProductListResponse>('/inventory/product/sku/list', params);
}

/**
 * 删除商品
 */
export function deleteProduct(params: { merchant_id: number; product_profile_ids: number[]; remove_check_enum?: string }) {
  return request.post('/inventory/product/delete', params);
}

/**
 * 预检查删除
 */
export function preCheckDelete(params: { merchant_id: number; product_profile_ids: number[] }) {
  return request.post('/inventory/product/pre-check-delete', params);
}

/**
 * 获取商品详情
 */
export function getProductDetail(params: { id: number; merchant_id: number }) {
  return request.post<ProductListItem>('/inventory/product/detail', params);
}

/**
 * 复制商品
 */
export function copyProduct(params: { id: number; merchant_id: number }) {
  return request.post('/inventory/product/copy', params);
}

/**
 * 绑定商品标签
 */
export function bindProductLabel(params: { product_id: number; label_id_list: number[]; merchant_id: number }) {
  return request.post('/inventory/product/bind-label', params);
}

/**
 * 获取所有商品标签
 */
export function getAllProductLabels(params: { merchant_id: number; keywords?: string; name?: string; page_num: number; page_size: number }) {
  return request.post('/inventory/product/labels', params);
}

/**
 * 导入商品
 */
export function importProducts(data: FormData) {
  return request.post('/inventory/product/import', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 导出商品
 */
export function exportProducts(params: any) {
  return request.post('/inventory/product/export', params, {
    responseType: 'blob'
  });
}
