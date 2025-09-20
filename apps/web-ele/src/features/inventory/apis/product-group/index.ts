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
  return requestClient.get(
    '/v1/merchant/basics/inventory/product-group/second-list',
    { params },
  );
}

// 创建分组
export function createGroup(data: any) {
  return requestClient.post('/inventory/product-group/create', data);
}

// 更新分组
export function updateGroup(data: any) {
  return requestClient.put('/inventory/product-group/update', data);
}

// 删除分组
export function deleteGroup(data: any) {
  return requestClient.delete('/inventory/product-group/delete', { data });
}

// 获取分组详情
export function getGroupDetail(id: string) {
  return requestClient.get(`/inventory/product-group/${id}`);
}
