import { requestClient as request } from '#/api/request';
import type { ProductSpecParams, ProductSpecResponse, ProductSpecValueParams, ProductSpecValueResponse } from '../../types/product-spec';

/**
 * 获取商品规格列表
 */
export function getProductSpecList(params: ProductSpecParams) {
  return request.post<ProductSpecResponse>('/inventory/product/spec/list', params);
}

/**
 * 创建商品规格
 */
export function createProductSpec(data: any) {
  return request.post('/inventory/product/spec/create', data);
}

/**
 * 更新商品规格
 */
export function updateProductSpec(data: any) {
  return request.post('/inventory/product/spec/update', data);
}

/**
 * 删除商品规格
 */
export function deleteProductSpec(params: { id: number; merchant_id: number }) {
  return request.post('/inventory/product/spec/delete', params);
}

/**
 * 获取商品规格值列表
 */
export function getProductSpecValueList(params: ProductSpecValueParams) {
  return request.post<ProductSpecValueResponse>('/inventory/product/spec/value/list', params);
}

/**
 * 创建商品规格值
 */
export function createProductSpecValue(data: any) {
  return request.post('/inventory/product/spec/value/create', data);
}

/**
 * 更新商品规格值
 */
export function updateProductSpecValue(data: any) {
  return request.post('/inventory/product/spec/value/update', data);
}

/**
 * 删除商品规格值
 */
export function deleteProductSpecValue(params: { id: number; merchant_id: number }) {
  return request.post('/inventory/product/spec/value/delete', params);
}

/**
 * 获取商品规格详情
 */
export function getProductSpecDetail(params: { id: number; merchant_id: number }) {
  return request.post('/inventory/product/spec/detail', params);
}
