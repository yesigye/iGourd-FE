import type {
  SettingSalesetQueryPageVO,
  SettingSalesetPageModel,
  SettingSalesetCreateVO,
  SettingSalesetModifyVO,
  SettingSalesetRemoveVO,
  SettingSalesetDetailModel,
} from '@@/setting/types';

import { requestClient } from '#/api/request';

const SETTING_SALESET_BASE_URL = '/v1/merchant/setting/saleset';

// 获取销售设置分页列表
export function getSettingSalesetPageListApi(data: SettingSalesetQueryPageVO) {
  return requestClient.post(
    `${SETTING_SALESET_BASE_URL}/page-list`,
    data,
  );
}

// 创建销售设置
export function createSettingSalesetApi(data: SettingSalesetCreateVO) {
  return requestClient.post(
    `${SETTING_SALESET_BASE_URL}/create`,
    data,
  );
}

// 更新销售设置
export function updateSettingSalesetApi(data: SettingSalesetModifyVO) {
  return requestClient.post(
    `${SETTING_SALESET_BASE_URL}/modify`,
    data,
  );
}

// 删除销售设置
export function deleteSettingSalesetApi(data: SettingSalesetRemoveVO) {
  return requestClient.post(
    `${SETTING_SALESET_BASE_URL}/remove`,
    data,
  );
}

// 获取销售设置详情
export function getSettingSalesetDetailApi(data: { saleset_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_SALESET_BASE_URL}/detail`,
    data,
  );
}

// 更新销售设置状态
export function updateSalesetStatusApi(data: { saleset_id: number; status: string; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_SALESET_BASE_URL}/update-status`,
    data,
  );
}
