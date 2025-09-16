import { requestClient } from '#/api/request';

// 获取采购单分页列表
export function getPurchaseBillsListApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/bills/page-list', data);
}

// 创建采购单
export function createPurchaseBillApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/bills/create', data);
}

// 更新采购单
export function updatePurchaseBillApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/bills/modify', data);
}

// 删除采购单
export function deletePurchaseBillApi(bill_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/purchase/bills/remove', {
    bill_id_list,
  });
}

// 审核采购单
export function approvePurchaseBillApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/bills/approve', data);
}

// 获取采购单详情
export function getPurchaseBillDetailApi(bill_id: number | string) {
  return requestClient.get(`/v1/merchant/purchase/bills/detail/${bill_id}`);
}
