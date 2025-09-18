import { requestClient } from '#/api/request';

export const basicsCurrencyList = (data: any) => {
  return requestClient.post(`/v1/merchant/basics/currency/list`, data);
};
export const basicsCountryAreaList = (data: any) => {
  return requestClient.post(`/v1/passport/basics/country/areas/list`, data);
};
