import type {
  CustomerLabelQueryPageVO,
  CustomerLabelPageModel,
  CustomerLabelCreateVO,
  CustomerLabelModifyVO,
  CustomerLabelRemoveVO,
  CustomerLabelDetailModel,
} from '@@/customer/types';

import { requestClient } from '#/api/request';

const CUSTOMER_LABEL_BASE_URL = '/v1/merchant/basics/customer/customer-label';
// 获取客户标签分页列表
export function getCustomerLabelPageListApi(data: CustomerLabelQueryPageVO) {
  return requestClient.post(
    `${CUSTOMER_LABEL_BASE_URL}/page-list`,
    data,
  );
}

// 创建客户标签
export function createCustomerLabelApi(data: CustomerLabelCreateVO) {
  return requestClient.post(
    `${CUSTOMER_LABEL_BASE_URL}/create`,
    data,
  );
}

// 更新客户标签
export function updateCustomerLabelApi(data: CustomerLabelModifyVO) {
  return requestClient.post(
    `${CUSTOMER_LABEL_BASE_URL}/modify`,
    data,
  );
}

// 删除客户标签
export function deleteCustomerLabelApi(data: CustomerLabelRemoveVO) {
  return requestClient.post(
    `${CUSTOMER_LABEL_BASE_URL}/remove`,
    data,
  );
}

// 获取客户标签详情
export function getCustomerLabelDetailApi(data: { label_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${CUSTOMER_LABEL_BASE_URL}/detail`,
    data,
  );
}
