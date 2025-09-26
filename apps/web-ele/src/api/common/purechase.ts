import { requestClient } from '#/api/request';

export const basicsCurrencyList = (data: any) => {
  return requestClient.post(`/v1/merchant/basics/currency/list`, data);
};
export const basicsCountryAreaList = (data: any) => {
  return requestClient.get(`/v1/passport/basics/country/areas/list`, data);
};
// 生成订单号
export const orderNoGenerate = (data: any) => {
  return requestClient.post(
    `/v1/merchant/basics/settings/coding/order-no/generate`,
    data,
  );
};

export const languageTranslationEnumsList = (data: any) => {
  return requestClient.post(
    `/v1/merchant/basics/language-translation/enums-list`,
    data,
  );
};
