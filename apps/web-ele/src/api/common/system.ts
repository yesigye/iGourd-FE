import { requestClient } from '#/api/request';

export const getSystemConfigurationDetailApi = (data: any) => {
  return requestClient.post(
    `/v1/merchant/basics/settings/setting-merchant-system/detail`,
    data,
  );
};
export const updateSystemConfigurationApi = (data: any) => {
  return requestClient.post(
    `/v1/merchant/basics/settings/setting-merchant-system/modify`,
    data,
  );
};
