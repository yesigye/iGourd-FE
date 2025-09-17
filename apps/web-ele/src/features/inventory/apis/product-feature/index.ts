import { requestClient as request } from '#/api/request';

// 获取自定义属性列表
export function getDynamicColumnList(params: any) {
  return request.post('/v1/merchant/basics/dynamic-column/page-list', params);
}

// 创建自定义属性
export function createDynamicColumn(data: any) {
  return request.post('/v1/merchant/basics/dynamic-column/create', data);
}

// 更新自定义属性
export function updateDynamicColumn(data: any) {
  return request.put('/v1/merchant/basics/dynamic-column/modify', data);
}

// 删除自定义属性
export function deleteDynamicColumn(data: any) {
  return request.delete('/v1/merchant/basics/dynamic-column/remove', {
    params: data,
  });
}
