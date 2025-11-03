import { requestClient } from '#/api/request';

export function codingCategoryDetail(data: unknown) {
  return requestClient.post(
    '/v1/merchant/basics/settings/coding/category/detail',
    data,
  );
}
export function codingCategoryList(data: unknown) {
  return requestClient.post(
    '/v1/merchant/basics/settings/coding/category/list',
    data,
  );
}
export function codingCategoryModify(data: unknown) {
  return requestClient.post(
    '/v1/merchant/basics/settings/coding/category/modify',
    data,
  );
}
export function codingOrderNoGenerate(data: unknown) {
  return requestClient.post(
    '/v1/merchant/basics/settings/coding/order-no/generate',
    data,
  );
}
export function codingRuleInit(data: unknown) {
  return requestClient.post(
    '/v1/merchant/basics/settings/coding/rule/init',
    data,
  );
}
export function codingRuleList(data: unknown) {
  return requestClient.post(
    '/v1/merchant/basics/settings/coding/rule/list',
    data,
  );
}
export function codingTreeList(data: unknown) {
  return requestClient.post(
    '/v1/merchant/basics/settings/coding/tree/list',
    data,
  );
}
