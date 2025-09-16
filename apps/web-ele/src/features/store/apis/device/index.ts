import type {
  StoreDeviceQueryPageVO,
  StoreDevicePageModel,
  StoreDeviceCreateVO,
  StoreDeviceModifyVO,
  StoreDeviceRemoveVO,
  StoreDeviceDetailModel,
} from '@@igourd/stores/types';

import { requestClient } from '#/api/request';

const STORE_DEVICE_BASE_URL = '/merchant/store/device';

// 获取设备管理分页列表
export function getStoreDevicePageListApi(data: StoreDeviceQueryPageVO) {
  return requestClient.post(
    `${STORE_DEVICE_BASE_URL}/page-list`,
    data,
  );
}

// 创建设备
export function createStoreDeviceApi(data: StoreDeviceCreateVO) {
  return requestClient.post(
    `${STORE_DEVICE_BASE_URL}/create`,
    data,
  );
}

// 更新设备
export function updateStoreDeviceApi(data: StoreDeviceModifyVO) {
  return requestClient.post(
    `${STORE_DEVICE_BASE_URL}/modify`,
    data,
  );
}

// 删除设备
export function deleteStoreDeviceApi(data: StoreDeviceRemoveVO) {
  return requestClient.post(
    `${STORE_DEVICE_BASE_URL}/remove`,
    data,
  );
}

// 获取设备详情
export function getStoreDeviceDetailApi(data: { device_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${STORE_DEVICE_BASE_URL}/detail`,
    data,
  );
}

// 启用/禁用设备
export function toggleDeviceStatusApi(data: { device_id: number; status: string; merchant_id?: number }) {
  return requestClient.post(
    `${STORE_DEVICE_BASE_URL}/toggle-status`,
    data,
  );
}

// 重启设备
export function restartDeviceApi(data: { device_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${STORE_DEVICE_BASE_URL}/restart`,
    data,
  );
}
