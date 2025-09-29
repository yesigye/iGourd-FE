import type { PrintTemplateOption } from '@@/sale/types';

import { requestClient } from '#/api/request';
// 获取扫码销售分页列表
export function inventoryProductDetailApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/product-info/detailList',
    data,
  );
}
export function productPageListApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/product/page-list',
    data,
  );
}
// 销售算费接口
export function getOrderPriceApi(data: any) {
  return requestClient.post('/v1/merchant/order/calc', data);
}
// 订单挂单列表
export function orderSuspendListApi(data: any) {
  return requestClient.post('/v1/merchant/order/order-holding/page-list', data);
}
// 订单详情
export function orderDetailApi(data: any) {
  return requestClient.post('/v1/merchant/order/detail', data);
}
// 订单创建
export function orderCreateApi(data: any) {
  return requestClient.post('/v1/merchant/order/create', data);
}
/**
 * 订单列表
 */
export function orderListApi(data: any) {
  return requestClient.post('/v1/merchant/order/page-list', data);
}
/**
 * 获取全部快捷标签
 */
export function quickTagsAllApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag/all ',
    data,
  );
}
/**
 * 挂单
 */
export function orderSuspendApi(data: any) {
  return requestClient.post('/v1/merchant/order/order-holding/create', data);
}

/**
 * 商品搜索
 */
export function productSearchApi(data: any) {
  return requestClient.post('/v1/merchant/basics/inventory/search', data);
}
/**
 * 获取导购员
 */
export function guidePageListApi(data: any) {
  return requestClient.post('/v1/passport/user/normal/page-list', data);
}
/**
 * 客户列表
 */
export function customerPageListApi(data: any) {
  return requestClient.post('/v1/merchant/basics/customer/page-list', data);
}

/**
 * 根据商户id和模板类型查询对应自定义模板信息接口
 * @param data
 */
export function getCustomTemplateListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/list`,
    data,
  );
}

/**
 * 查询对应模板类型和备选项类型的备选项List接口
 * @param data
 */
export function getCustomTemplateOptionListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/option/list`,
    data,
  ) as Promise<{ data: PrintTemplateOption[] }>;
}

/**
 * 新增自定义模板接口
 * @param data
 */
export function addCustomTemplateApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/create`,
    data,
  );
}

/**
 * 编辑自定义模板接口
 * @param data
 */
export function editCustomTemplateApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/modify`,
    data,
  );
}

/**
 * 删除自定义模板接口
 * @param data
 */
export function deleteCustomTemplateApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/remove`,
    data,
  );
}

/**
 * 修改自定义模板状态接口
 * @param data
 */
export function updateCustomTemplateStatusApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/default/modify`,
    data,
  );
}

export function printTemplateSystemApi(data: { business_type: string }) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-system/list`,
    data,
  ) as unknown as Promise<[null | PrintTemplateOption[], Error | null]>;
}
export function customerLabelPageListApi(data: { business_type: string }) {
  return requestClient.post(
    `/v1/merchant/basics/customer-label/page-list`,
    data,
  ) as unknown as Promise<[null | PrintTemplateOption[], Error | null]>;
}
/**
 * 删除标签
 * @param data
 */
export function deleteCustomerLabelApi(data: any) {
  return requestClient.post(`/v1/merchant/basics/customer-label/remove`, data);
}
/**
 * 新增标签
 * @param data
 */
export function addCustomerLabelApi(data: any) {
  return requestClient.post(`/v1/merchant/basics/customer-label/create`, data);
}
/**
 * 赊账订单创建
 */
export function createCreditApi(data: any) {
  return requestClient.post(`/v1/merchant/order/receipt-order/create`, data);
}
/**
 * 订单详情
 */
export function getOrderDetailApi(data: any) {
  return requestClient.post(`/v1/merchant/order/detail`, data);
}
/**
 * 订单支付方式配置列表
 */
export function getOrderPaymentMethodConfigListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/order/merchant-payment-method-config/list`,
    data,
  );
}
/**
 * 支付接口
 */
export function offlinePayApi(data: any) {
  return requestClient.post(`/v1/merchant/order/offline/pay`, data);
}

/**
 * 挂单详情
 */
export function orderHoldingDetailApi(data: any) {
  return requestClient.post(`/v1/merchant/order/order-holding/detail`, data);
}

/**
 * 取消挂单
 */
export function orderHoldingRemoveApi(data: any) {
  return requestClient.post(`/v1/merchant/order/order-holding/remove`, data);
}

/**
 * 挂单修改
 */
export function orderHoldingModifyApi(data: any) {
  return requestClient.post(`/v1/merchant/order/order-holding/modify`, data);
}

/**
 * 仓库库存列表
 */
export function warehouseStockListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/inventory/warehouse/stock/list`,
    data,
  );
}
/**
 * 商品分类一级列表
 */
export function productGroupFirstPageListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/inventory/product-group/first/page-list`,
    data,
  );
}
/**
 * 商品分类二级列表
 */
export function productGroupSecondPageListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/inventory/product-group/second/page-list`,
    data,
  );
}
