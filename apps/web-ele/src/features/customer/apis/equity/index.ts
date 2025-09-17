import type {
  CustomerEquityQueryPageVO,
  CustomerEquityPageModel,
  CustomerEquityCreateVO,
  CustomerEquityModifyVO,
  CustomerEquityRemoveVO,
  CustomerEquityDetailModel,
  CustomerEquitySettingVO,
} from '@@/customer/types';

import { requestClient } from '#/api/request';

const CUSTOMER_EQUITY_BASE_URL = '/v1/merchant/customer/equity';

// 获取客户股权分页列表
export function getCustomerEquityPageListApi(data: CustomerEquityQueryPageVO) {
  return requestClient.post(
    `${CUSTOMER_EQUITY_BASE_URL}/page-list`,
    data,
  );
}

// 创建客户股权
export function createCustomerEquityApi(data: CustomerEquityCreateVO) {
  return requestClient.post(
    `${CUSTOMER_EQUITY_BASE_URL}/create`,
    data,
  );
}

// 更新客户股权
export function updateCustomerEquityApi(data: CustomerEquityModifyVO) {
  return requestClient.post(
    `${CUSTOMER_EQUITY_BASE_URL}/modify`,
    data,
  );
}

// 删除客户股权
export function deleteCustomerEquityApi(data: CustomerEquityRemoveVO) {
  return requestClient.post(
    `${CUSTOMER_EQUITY_BASE_URL}/remove`,
    data,
  );
}

// 获取客户股权详情
export function getCustomerEquityDetailApi(data: { equity_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${CUSTOMER_EQUITY_BASE_URL}/detail`,
    data,
  );
}

// 获取客户权益设置
export function getCustomerEquitySettingApi(data: { merchant_id?: number }) {
  return requestClient.post(
    `${CUSTOMER_EQUITY_BASE_URL}/setting`,
    data,
  );
}

// 更新客户权益设置
export function updateCustomerEquitySettingApi(data: CustomerEquitySettingVO) {
  return requestClient.post(
    `${CUSTOMER_EQUITY_BASE_URL}/setting/update`,
    data,
  );
}
