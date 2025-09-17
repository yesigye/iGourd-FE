import type {
  StoreCreateQueryPageVO,
  StoreCreatePageModel,
  StoreCreateCreateVO,
  StoreCreateModifyVO,
  StoreCreateRemoveVO,
  StoreCreateDetailModel,
} from '@@/store/types';

import { requestClient } from '#/api/request';

const STORE_CREATE_BASE_URL = '/v1/merchant/store/create';

// 获取店铺创建分页列表
export function getStoreCreatePageListApi(data: StoreCreateQueryPageVO) {
  return requestClient.post(
    `${STORE_CREATE_BASE_URL}/page-list`,
    data,
  );
}

// 创建店铺
export function createStoreCreateApi(data: StoreCreateCreateVO) {
  return requestClient.post(
    `${STORE_CREATE_BASE_URL}/create`,
    data,
  );
}

// 更新店铺创建
export function updateStoreCreateApi(data: StoreCreateModifyVO) {
  return requestClient.post(
    `${STORE_CREATE_BASE_URL}/modify`,
    data,
  );
}

// 删除店铺创建
export function deleteStoreCreateApi(data: StoreCreateRemoveVO) {
  return requestClient.post(
    `${STORE_CREATE_BASE_URL}/remove`,
    data,
  );
}

// 获取店铺创建详情
export function getStoreCreateDetailApi(data: { create_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${STORE_CREATE_BASE_URL}/detail`,
    data,
  );
}

// 提交店铺创建申请
export function submitStoreCreateApi(data: { create_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${STORE_CREATE_BASE_URL}/submit`,
    data,
  );
}

// 获取店铺创建步骤
export function getStoreCreateStepsApi(data: { create_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${STORE_CREATE_BASE_URL}/steps`,
    data,
  );
}
