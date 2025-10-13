import type {
  ProductListItem,
  ProductListParams,
  ProductListResponse,
} from '../../types/product-list';

import { requestClient as request } from '#/api/request';

/**
 * 获取商品列表
 */
export function getProductList(params: ProductListParams) {
  return request.post<ProductListResponse>(
    '/v1/merchant/basics/inventory/product-info/page-list',
    params,
  );
}

/**
 * 获取商品SKU列表
 */
export function getProductSKUList(params: ProductListParams) {
  return request.post<ProductListResponse>(
    '/inventory/product/sku/list',
    params,
  );
}

/**
 * 删除商品
 */
export function deleteProduct(params: {
  merchant_id: number;
  product_profile_ids: number[];
  remove_check_enum?: string;
}) {
  return request.post('/inventory/product/delete', params);
}

/**
 * 预检查删除
 */
export function preCheckDelete(params: {
  merchant_id: number;
  product_profile_ids: number[];
}) {
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
export function bindProductLabel(params: {
  label_id_list: number[];
  merchant_id: number;
  product_id: number;
}) {
  return request.post('/inventory/product/bind-label', params);
}

/**
 * 获取所有商品标签
 */
export function getAllProductLabels(params: {
  keywords?: string;
  merchant_id: number;
  name?: string;
  page_num: number;
  page_size: number;
}) {
  return request.post('/inventory/product/labels', params);
}

/**
 * 导入商品
 */
export function importProducts(data: FormData) {
  return request.post('/inventory/product/import', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 导出商品
 */
export function exportProducts(params: any) {
  return request.post('/inventory/product/export', params, {
    responseType: 'blob',
  });
}
// 商品资料分页查询查询
export function productPageList(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product/page-list',
    params,
  );
}

// 基础商品信息分页
export function productProfileSKUPageList(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-profile/page-list',
    params,
  );
}

// 基础商品信息详情
export function productProfileDetail(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-profile/detail',
    params,
  );
}
// 绑定商品标签
export function productLabelBind(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product/label/bind',
    params,
  );
}
// 商品标签分页查询
export function productLabelPage(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-label/page-list',
    params,
  );
}
// 预检查删除商品
export function preCheckRemoveUsingPOST(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-profile/pre-check-remove',
    params,
  );
}
// 删除商品
export function productProfileRemove(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-profile/remove',
    params,
  );
}
// 商品单位分页查询
export function productUnitPageList(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-unit/page-list',
    params,
  );
}
// 商品单位详情
export function getSystemConfigurationDetail(params: any) {
  return request.post(
    '/v1/merchant/basics/settings/setting-merchant-system/detail',
    params,
  );
}
// 商品分组二级分页查询
export function productTwoGroupList(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-group/second/page-list',
    params,
  );
}
// 商品资料创建
export function productProfileCreate(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-profile/create',
    params,
  );
}
// 商品资料修改
export function productProfileModify(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-profile/modify',
    params,
  );
}
// 供应商分页查询
export function getVendorList(params: any) {
  return request.post('/v1/merchant/purchase/vendor/page-list', params);
}
// 商品仓库修改
export function warehouseModify(params: any) {
  return request.post('/v1/merchant/basics/inventory/warehouse/modify', params);
}
// 商品仓库创建
export function warehouseCreate(params: any) {
  return request.post('/v1/merchant/basics/inventory/warehouse/create', params);
}
// 商品仓库详情
export function warehouseDetail(params: any) {
  return request.post('/v1/merchant/basics/inventory/warehouse/detail', params);
}
// 商品规格值分页查询
export function productSpecValueListApi(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec-value/list',
    params,
  );
}
// 商品规格分页查询
export function productSpecListApi(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec/list',
    params,
  );
}
// 商品规格值最小code查询
export function findMinCode(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec-value/find-min-code',
    params,
  );
}
// 商品规格值创建
export function productSpecValueCreate(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec-value/create',
    params,
  );
}
// 商品规格创建
export function productSpecCreate(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec/create',
    params,
  );
}
// 商品规格修改
export function productSpecModify(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec/modify',
    params,
  );
}
// 商品规格值修改
export function productSpecValueModify(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/product-spec-value/modify',
    params,
  );
}
