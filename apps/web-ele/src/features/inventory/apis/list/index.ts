import { requestClient } from '#/api/request';

// 获取库存分页列表
export function getInventoryListApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/stock-info/page-list',
    data,
  );
}

// 更新库存
export function updateInventoryApi(data: any) {
  return requestClient.post('/v1/merchant/inventory/update', data);
}

// 批量更新库存
export function batchUpdateInventoryApi(data: any) {
  return requestClient.post('/v1/merchant/inventory/batch-update', data);
}

// 获取库存详情
export function getInventoryDetailApi(inventory_id: number | string) {
  return requestClient.get(`/v1/merchant/inventory/detail/${inventory_id}`);
}

// 获取库存统计
export function getInventoryStatsApi(data: any) {
  return requestClient.post('/v1/merchant/inventory/stats', data);
}

// 创建库存
export function createInventoryStock(params: any) {
  return requestClient.post(
    `/v1/merchant/basics/inventory/stock-info/create/batch`,
    params,
  );
}

// 获取库存详情
export function getInventoryStockDetail(params: any) {
  return requestClient.post(
    `/v1/merchant/basics/inventory/stock/detail`,
    params,
  );
}

export function createOrUpdateStock(params: any) {
  return Reflect.has(params, 'id')
    ? modifyInventoryStock(params)
    : createInventoryStock(params);
}

// 修改库存详情
export function modifyInventoryStock(params: any) {
  const { product_model: _product_model, product, ...reset } = params;
  const [first] = product ?? [];
  const obj = JSON.parse(JSON.stringify(first))
  const data = {
    ...reset,
    stock_origin_quantity:reset.stock_quantity,
    stock_change_quantity: first.stock_quantity,
    product: {...obj,merchant_id:reset.merchant_id}
  };
  debugger

  return requestClient.post(`/v1/merchant/basics/inventory/stock/modify`, data);
}
export function removeInventoryStock(params:any) {
  return requestClient.post(
    `/v1/merchant/basics/inventory/stock/remove`,
    params,
  );
}
export function clearInventoryStock(params:any) {
  return requestClient.post(
    `/v1/merchant/basics/inventory/stock/clear`,
    params,
  );
}


