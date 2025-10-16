import type {
  CustomerIntegralQueryPageVO,
  CustomerIntegralPageModel,
  CustomerIntegralCreateVO,
  CustomerIntegralModifyVO,
  CustomerIntegralRemoveVO,
  CustomerIntegralDetailModel,
  CustomerIntegralSettingVO,
} from '@@/customer/types';

import { requestClient } from '#/api/request';
const CUSTOMER_INTEGRAL_BASE_URL = '/v1/merchant/basics/customer/setting-point';

// 获取客户积分分页列表
export function getCustomerIntegralPageListApi(data: CustomerIntegralQueryPageVO) {
  return requestClient.post(
    `${CUSTOMER_INTEGRAL_BASE_URL}/page-list`,
    data,
  );
}

// 保存客户积分
export function saveCustomerIntegralApi(data: CustomerIntegralCreateVO) {
  return requestClient.post(
    `${CUSTOMER_INTEGRAL_BASE_URL}/save`,
    data,
  );
}

// 更新客户积分
export function updateCustomerIntegralApi(data: CustomerIntegralModifyVO) {
  return requestClient.post(
    `${CUSTOMER_INTEGRAL_BASE_URL}/modify`,
    data,
  );
}

// 删除客户积分
export function deleteCustomerIntegralApi(data: CustomerIntegralRemoveVO) {
  return requestClient.post(
    `${CUSTOMER_INTEGRAL_BASE_URL}/remove`,
    data,
  );
}

// 获取客户积分详情
export function getCustomerIntegralDetailApi(data: { integral_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${CUSTOMER_INTEGRAL_BASE_URL}/detail`,
    data,
  );
}

// 获取客户积分设置
export function getCustomerIntegralSettingApi(data: { merchant_id?: number }) {
  return requestClient.post(
    `${CUSTOMER_INTEGRAL_BASE_URL}/setting`,
    data,
  );
}

// 更新客户积分设置
export function updateCustomerIntegralSettingApi(data: CustomerIntegralSettingVO) {
  return requestClient.post(
    `${CUSTOMER_INTEGRAL_BASE_URL}/setting/update`,
    data,
  );
}

/**
 * 获取商品列表
 */
export function getProductList(params: ProductListParams) {
  return requestClient.post<ProductListResponse>(
    '/v1/merchant/basics/inventory/product-info/page-list',
    params,
  );
}
