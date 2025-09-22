import type {
  SaleShiftsCreateVO,
  SaleShiftsModifyVO,
  SaleShiftsQueryPageVO,
  SaleShiftsRemoveVO,
} from '@@/sale/types';

import { requestClient } from '#/api/request';

const SALE_SHIFTS_BASE_URL = '/v1/merchant/trade/shift-change';

// 获取班次管理分页列表
export function getSaleShiftsPageListApi(data: SaleShiftsQueryPageVO) {
  return requestClient.post(`${SALE_SHIFTS_BASE_URL}/page-list`, data);
}

// 创建班次管理
export function createSaleShiftsApi(data: SaleShiftsCreateVO) {
  return requestClient.post(`${SALE_SHIFTS_BASE_URL}/create`, data);
}

// 更新班次管理
export function updateSaleShiftsApi(data: SaleShiftsModifyVO) {
  return requestClient.post(`${SALE_SHIFTS_BASE_URL}/modify`, data);
}

// 删除班次管理
export function deleteSaleShiftsApi(data: SaleShiftsRemoveVO) {
  return requestClient.post(`${SALE_SHIFTS_BASE_URL}/remove`, data);
}

// 获取班次管理详情
export function getSaleShiftsDetailApi(data: {
  merchant_id?: number;
  shift_id: number;
}) {
  return requestClient.post(`${SALE_SHIFTS_BASE_URL}/detail`, data);
}

// 导出班次管理
export function exportSaleShiftsApi(data: SaleShiftsQueryPageVO) {
  return requestClient.post(`${SALE_SHIFTS_BASE_URL}/export`, data);
}
