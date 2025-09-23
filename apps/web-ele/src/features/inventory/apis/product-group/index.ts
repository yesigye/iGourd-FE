import { requestClient } from '#/api/request';

// 获取一级分组列表
export function getFirstGroupList(params: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/product-group/first/page-list',
    params,
  );
}

// 获取二级分组列表
export function getSecondGroupList(params: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/product-group/second/page-list',
    params,
  );
}

// 创建分组
export function createGroup(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/product-group/create',
    data,
  );
}
// 更新分组
export function updateGroup(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/product-group/modify',
    data,
  );
}

// 删除分组
export function removeGroup(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/product-group/remove',
    data,
  );
}

// 获取分组详情
export function getGroupDetail(id: string) {
  return requestClient.get(`/inventory/product-group/${id}`);
}
