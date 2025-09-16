import { requestClient } from '#/api/request';

// 获取采购列表分页数据
export function getPurchaseListApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/list/page-list', data);
}

// 创建采购记录
export function createPurchaseRecordApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/list/create', data);
}

// 更新采购记录
export function updatePurchaseRecordApi(data: any) {
  return requestClient.post('/v1/merchant/purchase/list/modify', data);
}

// 删除采购记录
export function deletePurchaseRecordApi(record_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/purchase/list/remove', {
    record_id_list,
  });
}

// 获取采购记录详情
export function getPurchaseRecordDetailApi(record_id: number | string) {
  return requestClient.get(`/v1/merchant/purchase/list/detail/${record_id}`);
}
