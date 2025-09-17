import { requestClient } from '#/api/request';

// 获取采购单分页列表
export function getPurchaseBillsListApi(data: any) {
  return requestClient.post(
    '/v1/merchant/purchase/purchase-bill/page-list',
    data,
  );
}

// 创建采购单
export function createPurchaseBillApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/purchase-bill/create', data);
}

// 更新采购单
export function updatePurchaseBillApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/purchase-bill/modify', data);
}

// 删除采购单
export function deletePurchaseBillApi(bill_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/purchase/purchase-bill/remove', {
    bill_id_list,
  });
}

// 审核采购单
export function approvePurchaseBillApi(data: any) {
  return requestClient.post(
    '/v1/merchant/purchase/purchase-bill/approve',
    data,
  );
}

// 获取采购单详情
export function getPurchaseBillDetailApi(bill_id: number | string) {
  return requestClient.get(
    `/v1/merchant/purchase/purchase-bill/detail/${bill_id}`,
  );
}
