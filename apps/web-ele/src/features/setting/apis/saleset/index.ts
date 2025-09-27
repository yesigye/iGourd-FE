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
