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
/**
 * 时区列表
*/
export function getTimezoneListApi(data) {
  return requestClient.get(
    `/v1/passport/basics/country/timezone/list`,
    data,
  );
}
/**
 * 行业列表
*/
export function getIndustryListApi() {
  return requestClient.post(
    `/v1/merchant/basics/merchant/industry/list`,
  );
}
/**
 * 货币列表
*/
export function getCurrencyListApi() {
  return requestClient.post(
    `/v1/merchant/basics/currency/list`,
  );
}
/**
 * 国家列表
*/
export function getCountryListApi() {
  return requestClient.get(
    `/v1/passport/basics/country/areas/list`,
  );
}
/**
 * 店铺类型列表
*/
export function getBusinessTypeListApi() {
  return requestClient.post(
    `/v1/merchant/basics/merchant/business-type/list`,
  );
}
/**
 * 国家语言列表
*/
export function getCountryLanguageListApi() {
  return requestClient.post(
    `/v1/merchant/basics/merchant/country-language/list`,
  );
}
