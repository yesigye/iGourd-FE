import { requestClient } from '#/api/request';

export function createCustomerDataApi(data) {
  return requestClient.post('/v1/merchant/basics/customer/create', data);
}

export function getCustomerPageListApi(data) {
  return requestClient.post('/v1/merchant/basics/customer/page-list', data);
}
export function deleteCustomerDataApi(data) {
  return requestClient.post('/v1/merchant/basics/customer/remove', data);
}

export function updateCustomerDataApi(data) {
  return requestClient.post('/v1/merchant/basics/customer/modify', data);
}
