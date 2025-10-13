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
    '/v1/merchant/basics/inventory/product-label/page-list',
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
 * 创建商品标签
 */
export function createProductLabel(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-label/create',
    params,
  );
}
/**
 * 修改商品标签
 */
export function updateProductLabel(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-label/modify',
    params,
  );
}
/**
 * 删除商品标签
 */
export function removeProductLabel(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-label/remove',
    params,
  );
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

/**
 * 创建标签并绑定商品
 */
export function createLabelBind(params) {
  return request.post(
    '/v1/merchant/basics/inventory/product-label/create-label/bind',
    params,
  );
}

/**
 * 商品标签关联基础商品信息分页查询
 */
export function getProductlabelProductPage(params:any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-label/product-profile/page-list',
    params,
  );
}

// 获取商品列表
export const inventoryProductProfilePageList = (data: any) => {
  // @ts-ignore
  return request.post<PageResult<AnyObject[]>>(
    `/v1/merchant/basics/inventory/product-profile/page-list`,
    data,
  );
};
/**
 * 绑定商品标签
 */
export function productUnbindApi(params:any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-label/product/un-bind',
    params,
  );
}


