import { requestClient as request } from '#/api/request';

// 库存盘点相关 API
// 获取库存盘点列表
export const getCountList = (params: any) => {
  return request.post(
    '/v1/merchant/basics/inventory/physical-stock-take/page-list',
    params,
  );
};

// 获取库存盘点详情
export function getCountDetail(params: any) {
  return request.post(
    '/v1/merchant/basics/inventory/physical-stock-take/detail',
    params,
  );
}

// 创建库存盘点
export function createCount(data: any) {
  return request.post(
    'v1/merchant/basics/inventory/physical-stock-take/create',
    data,
  );
}

// 更新库存盘点
export function updateCount(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/physical-stock-take/modify',
    data,
  );
}

// 删除库存盘点
export function removeCount(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/physical-stock-take/remove',
    data,
  );
}

// 更新盘点状态
export function updateCountStatus(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/physical-stock-take/status/modify',
    data,
  );
}

// 导出库存盘点
export function exportCount(params: any) {
  return request.post('/v1/inventory/count/export', params, {
    responseType: 'blob',
  });
}
