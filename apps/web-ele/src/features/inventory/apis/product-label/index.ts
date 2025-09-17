import type {
  ProductLabelItem,
  ProductLabelParams,
  ProductLabelResponse,
} from '../../types/product-label';

import { requestClient as request } from '#/api/request';

/**
 * 获取商品标签列表
 */
export function getProductLabelList(params: ProductLabelParams) {
  return request.post<ProductLabelResponse>(
    '/inventory/product/label/list',
    params,
  );
}

/**
 * 删除商品标签
 */
export function deleteProductLabel(params: {
  merchant_id: number;
  product_label_ids: number[];
}) {
  return request.post('/inventory/product/label/delete', params);
}

/**
 * 创建或更新商品标签
 */
export function createOrUpdateProductLabel(params: any) {
  return request.post('/inventory/product/label/create_or_update', params);
}

/**
 * 获取商品标签详情
 */
export function getProductLabelDetail(params: {
  merchant_id: number;
  product_label_id: number;
}) {
  return request.post<ProductLabelItem>(
    '/inventory/product/label/detail',
    params,
  );
}

/**
 * 获取商品标签下的商品数量
 */
export function getProductLabelProductCount(params: {
  merchant_id: number;
  page_num: number;
  page_size: number;
  product_label_id: number;
}) {
  return request.post('/inventory/product/label/product-count', params);
}
