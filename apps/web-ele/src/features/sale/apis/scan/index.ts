import { requestClient } from '#/api/request';

// 获取扫码销售分页列表
export function getScanSaleListApi(data: any) {
  return requestClient.post('/v1/merchant/sale/scan/page-list', data);
}

// 创建扫码销售记录
export function createScanSaleApi(data: any) {
  return requestClient.post('/v1/merchant/sale/scan/create', data);
}

// 更新扫码销售记录
export function updateScanSaleApi(data: any) {
  return requestClient.post('/v1/merchant/sale/scan/modify', data);
}

// 删除扫码销售记录
export function deleteScanSaleApi(scan_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/sale/scan/remove', {
    scan_id_list,
  });
}

// 获取扫码销售详情
export function getScanSaleDetailApi(scan_id: number | string) {
  return requestClient.get(`/v1/merchant/sale/scan/detail/${scan_id}`);
}
