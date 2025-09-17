import type {
  SettingStoresetQueryPageVO,
  SettingStoresetPageModel,
  SettingStoresetCreateVO,
  SettingStoresetModifyVO,
  SettingStoresetRemoveVO,
  SettingStoresetDetailModel,
} from '@@/setting/types';

import { requestClient } from '#/api/request';

const SETTING_STORESET_BASE_URL = '/v1/merchant/setting/storeset';

// 获取店铺设置分页列表
export function getSettingStoresetPageListApi(data: SettingStoresetQueryPageVO) {
  return requestClient.post(
    `${SETTING_STORESET_BASE_URL}/page-list`,
    data,
  );
}

// 创建店铺设置
export function createSettingStoresetApi(data: SettingStoresetCreateVO) {
  return requestClient.post(
    `${SETTING_STORESET_BASE_URL}/create`,
    data,
  );
}

// 更新店铺设置
export function updateSettingStoresetApi(data: SettingStoresetModifyVO) {
  return requestClient.post(
    `${SETTING_STORESET_BASE_URL}/modify`,
    data,
  );
}

// 删除店铺设置
export function deleteSettingStoresetApi(data: SettingStoresetRemoveVO) {
  return requestClient.post(
    `${SETTING_STORESET_BASE_URL}/remove`,
    data,
  );
}

// 获取店铺设置详情
export function getSettingStoresetDetailApi(data: { storeset_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_STORESET_BASE_URL}/detail`,
    data,
  );
}

// 更新店铺设置状态
export function updateStoresetStatusApi(data: { storeset_id: number; status: string; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_STORESET_BASE_URL}/update-status`,
    data,
  );
}

// 获取店铺基本信息
export function getStoreBasicInfoApi(data: { merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_STORESET_BASE_URL}/basic-info`,
    data,
  );
}

// 更新店铺基本信息
export function updateStoreBasicInfoApi(data: any) {
  return requestClient.post(
    `${SETTING_STORESET_BASE_URL}/update-basic-info`,
    data,
  );
}
