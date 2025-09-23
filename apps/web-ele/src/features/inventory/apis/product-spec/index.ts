import type {
  ProductSpecParams,
  ProductSpecResponse,
  ProductSpecValueParams,
  ProductSpecValueResponse,
} from '../../types/product-spec';

import { requestClient as request } from '#/api/request';

/**
 * 获取商品规格列表
 */
export function getProductSpecList(params: ProductSpecParams) {
  return request.post<ProductSpecResponse>(
    '/v1/merchant/basics/inventory/product-spec/list',
    params,
  );
}

/**
 * 创建商品规格
 */
export function createProductSpec(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec/create',
    data,
  );
}
/**
 * 更新商品规格
 */
export function updateProductSpec(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec/modify',
    data,
  );
}

/**
 * 删除商品规格
 */
export function deleteProductSpec(params: { id: number; merchant_id: number }) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec/remove',
    params,
  );
}

/**
 * 获取商品规格值列表
 */
export function getProductSpecValueList(params: ProductSpecValueParams) {
  return request.post<ProductSpecValueResponse>(
    '/v1/merchant/basics/inventory/product-spec-value/list',
    params,
  );
}

/**
 * 创建商品规格值
 */
export function createProductSpecValue(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec-value/create',
    data,
  );
}

/**
 * 更新商品规格值
 */
export function updateProductSpecValue(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec-value/modify',
    data,
  );
}

/**
 * 删除商品规格值
 */
export function deleteProductSpecValue(params: {
  id: number;
  merchant_id: number;
}) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec-value/remove',
    params,
  );
}

/**
 * 获取商品规格详情
 */
export function getProductSpecDetail(params: {
  id: number;
  merchant_id: number;
}) {
  return request.post('/inventory/product/spec/detail', params);
}
