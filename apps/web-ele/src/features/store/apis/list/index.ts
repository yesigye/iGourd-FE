import type {
  StoreListQueryPageVO,
  StoreListPageModel,
  StoreListCreateVO,
  StoreListModifyVO,
  StoreListRemoveVO,
  StoreListDetailModel,
} from '@@igourd/stores/types';

import { requestClient } from '#/api/request';

const STORE_LIST_BASE_URL = '/merchant/store/list';

// 获取店铺列表分页列表
export function getStoreListPageListApi(data: StoreListQueryPageVO) {
  return requestClient.post(
    `${STORE_LIST_BASE_URL}/page-list`,
    data,
  );
}

// 创建店铺
export function createStoreListApi(data: StoreListCreateVO) {
  return requestClient.post(
    `${STORE_LIST_BASE_URL}/create`,
    data,
  );
}

// 更新店铺
export function updateStoreListApi(data: StoreListModifyVO) {
  return requestClient.post(
    `${STORE_LIST_BASE_URL}/modify`,
    data,
  );
}

// 删除店铺
export function deleteStoreListApi(data: StoreListRemoveVO) {
  return requestClient.post(
    `${STORE_LIST_BASE_URL}/remove`,
    data,
  );
}

// 获取店铺详情
export function getStoreListDetailApi(data: { store_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${STORE_LIST_BASE_URL}/detail`,
    data,
  );
}

// 启用/禁用店铺
export function toggleStoreStatusApi(data: { store_id: number; status: string; merchant_id?: number }) {
  return requestClient.post(
    `${STORE_LIST_BASE_URL}/toggle-status`,
    data,
  );
}
