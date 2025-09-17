import type { CustomerInfo, CustomerInfoPageQueryParams } from '@@/customer/types';

import { requestClient } from '#/api/request';

// 获取客户分页列表
export function getCustomerListApi(data: CustomerInfoPageQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/customer/page-list`,
    data,
  );
}

// 获取客户详情
export function getCustomerDetailApi(id: string) {
  return requestClient.post(`/v1/merchant/basics/customer/detail`, id);
}

// 创建客户
export function createCustomerApi(data: any) {
  return requestClient.post(`/v1/merchant/basics/customer/create`, data);
}

// 更新客户
export function updateCustomerApi(data: any) {
  return requestClient.post(`/v1/merchant/basics/customer/modify`, data);
}

// 删除客户
export function deleteCustomerApi(data: { customer_id_list: number[]; merchant_id?: number }) {
  return requestClient.post(`/v1/merchant/basics/customer/remove`, data);
}

// 获取账户余额详情
export function getBalanceDetailApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/customer/customer-balance-change-log/page-list`,
    data,
  );
}

// 客户充值明细分页列表
export function getRechargeDetailListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/customer/customer-recharge/list-page`,
    data,
  );
}

// 用户积分分页查询
export function getPointsDetailListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/customer/point/exchange-gifts/page-list`,
    data,
  );
}

// 积分兑换
export function exchangePointsApi(data: any) {
  return requestClient.post(`/v1/merchant/basics/customer/point/exchange-gifts`, data);
}
