import type {
  CustomerFeatureQueryPageVO,
  CustomerFeaturePageModel,
  CustomerFeatureCreateVO,
  CustomerFeatureModifyVO,
  CustomerFeatureRemoveVO,
  CustomerFeatureDetailModel,
} from '@@/customer/types';

import { requestClient } from '#/api/request';

const CUSTOMER_FEATURE_BASE_URL = '/v1/merchant/customer/feature';

// 获取客户特征分页列表
export function getCustomerFeaturePageListApi(data: CustomerFeatureQueryPageVO) {
  return requestClient.post(
    `${CUSTOMER_FEATURE_BASE_URL}/page-list`,
    data,
  );
}

// 创建客户特征
export function createCustomerFeatureApi(data: CustomerFeatureCreateVO) {
  return requestClient.post(
    `${CUSTOMER_FEATURE_BASE_URL}/create`,
    data,
  );
}

// 更新客户特征
export function updateCustomerFeatureApi(data: CustomerFeatureModifyVO) {
  return requestClient.post(
    `${CUSTOMER_FEATURE_BASE_URL}/modify`,
    data,
  );
}

// 删除客户特征
export function deleteCustomerFeatureApi(data: CustomerFeatureRemoveVO) {
  return requestClient.post(
    `${CUSTOMER_FEATURE_BASE_URL}/remove`,
    data,
  );
}

// 获取客户特征详情
export function getCustomerFeatureDetailApi(data: { feature_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${CUSTOMER_FEATURE_BASE_URL}/detail`,
    data,
  );
}
