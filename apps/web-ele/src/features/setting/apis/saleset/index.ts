import type {
  SettingSalesetQueryPageVO,
  SettingSalesetPageModel,
  SettingSalesetCreateVO,
  SettingSalesetModifyVO,
  SettingSalesetRemoveVO,
  SettingSalesetDetailModel,
} from '@@/setting/types';

import { requestClient } from '#/api/request';


// 获取销售设置详情
export function getSettingSalesetDetailApi(data: SettingSalesetQueryPageVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/setting-merchant-system/detail',
    data,
  );
}
// 修改销售设置
export function modifySettingSalesetApi(data: SettingSalesetModifyVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/setting-merchant-system/modify',
    data,
  );
}
// 获取快捷标签列表
export function getQuickTagsApi(data: SettingSalesetQueryPageVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag/list',
    data,
  );
}
// 创建快捷标签
export function createQuickTagsApi(data: SettingSalesetQueryPageVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag/create',
    data,
  );
}
// 创建快捷标签
export function editQuickTagsApi(data: SettingSalesetQueryPageVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag/modify',
    data,
  );
}
// 删除快捷标签
export function removeQuickTagsApi(data: SettingSalesetRemoveVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag/remove',
    data,
  );
}
// 获取标签内容
export function getQuickTagsValueApi(data: SettingSalesetQueryPageVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag-value/list',
    data,
  );
}
// 删除标签值
export function removeQuickTagsValueApi(data: SettingSalesetRemoveVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag-value/remove',
    data,
  );
}
// 创建标签值
export function createQuickTagsValueApi(data: SettingSalesetQueryPageVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag-value/create',
    data,
  );
}
// 编辑标签值
export function editQuickTagsValueApi(data: SettingSalesetQueryPageVO) {
  return requestClient.post(
    '/v1/merchant/basics/settings/order-holding-tag-value/modify',
    data,
  );
}
