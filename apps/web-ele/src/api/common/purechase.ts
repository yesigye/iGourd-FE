import { requestClient } from '#/api/request';

export const basicsCurrencyList = (data: any) => {
  return requestClient.post(`/v1/merchant/basics/currency/list`, data);
};
