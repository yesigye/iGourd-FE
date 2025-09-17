import type {
  CustomerAccountQueryPageVO,
  CustomerAccountPageModel,
  CustomerAccountCreateVO,
  CustomerAccountModifyVO,
  CustomerAccountRemoveVO,
  CustomerAccountDetailModel,
} from '@@/customer/types';

import { requestClient } from '#/api/request';

// 获取客户账户分页列表
export function getCustomerAccountPageListApi(data: CustomerAccountQueryPageVO) {
  return requestClient.post(
    `/v1/merchant/customer/account/page-list`,
    data,
  );
}

// 创建客户账户
export function createCustomerAccountApi(data: CustomerAccountCreateVO) {
  return requestClient.post(
    `/v1/merchant/customer/account/create`,
    data,
  );
}

// 更新客户账户
export function updateCustomerAccountApi(data: CustomerAccountModifyVO) {
  return requestClient.post(
    `/v1/merchant/customer/account/modify`,
    data,
  );
}

// 删除客户账户
export function deleteCustomerAccountApi(data: CustomerAccountRemoveVO) {
  return requestClient.post(
    `/v1/merchant/customer/account/remove`,
    data,
  );
}

// 获取客户账户详情
export function getCustomerAccountDetailApi(data: { account_id: number; merchant_id?: number }) {
  return requestClient.post(
    `/v1/merchant/customer/account/detail`,
    data,
  );
}

// 添加收入
export function addCustomerRevenueApi(data: CustomerAccountCreateVO) {
  return requestClient.post(
    `/v1/merchant/customer/account/add-revenue`,
    data,
  );
}

// 添加支出
export function addCustomerExpenditureApi(data: CustomerAccountCreateVO) {
  return requestClient.post(
    `/v1/merchant/customer/account/add-expenditure`,
    data,
  );
}
