import type { StoreDeviceQueryPageVO } from '@@/store/types';

import { requestClient } from '#/api/request';

const STORE_DEVICE_BASE_URL = '/v1/merchant/basics/merchant/device';

// 获取设备管理分页列表
export function getStoreDevicePageListApi(data: StoreDeviceQueryPageVO) {
  return requestClient.post(`${STORE_DEVICE_BASE_URL}/page-list`, data);
}

export function deviceAuthorizationStatusModify(row: Record<string, any>) {
  const data = {
    is_authorized: !row.is_authorized,
    sub_merchant_id: row.merchant_id,
    id: row.id,
  };
  return requestClient.post(
    '/v1/merchant/basics/merchant/device/authorization/status/modify',
    data,
  );
}
export function merchantDeviceStatusModify(row: Record<string, any>) {
  const status = row.status === 'ACTIVE' ? 'PROHIBITED' : 'ACTIVE';
  const data = {
    status,
    sub_merchant_id: row.merchant_id,
    id: row.id,
  };
  return requestClient.post(
    '/v1/merchant/basics/merchant/device/status/modify',
    data,
  );
}
