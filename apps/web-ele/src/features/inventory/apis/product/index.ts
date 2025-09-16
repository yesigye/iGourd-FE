import { requestClient } from '#/api/request';

// 获取商品分页列表
export function getProductListApi(data: any) {
  return requestClient.post('/v1/merchant/product/page-list', data);
}

// 创建商品
export function createProductApi(data: any) {
  return requestClient.post('/v1/merchant/product/create', data);
}

// 更新商品
export function updateProductApi(data: any) {
  return requestClient.post('/v1/merchant/product/modify', data);
}

// 删除商品
export function deleteProductApi(product_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/product/remove', {
    product_id_list,
  });
}

// 更新商品状态
export function updateProductStatusApi(data: any) {
  return requestClient.post('/v1/merchant/product/update-status', data);
}

// 获取商品详情
export function getProductDetailApi(product_id: number | string) {
  return requestClient.get(`/v1/merchant/product/detail/${product_id}`);
}
