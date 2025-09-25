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

// 获取店铺设置信息
export function getSettingStoresetDetailApi(data: { id: string }) {
  return requestClient.get(`/v1/merchant/basics/merchant/find/${data.id}`);
}
// 修改店铺设置
export function updateSettingStoresetApi(data: SettingStoresetModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/merchant/current-merchant/modify`,
    data,
  );
}
