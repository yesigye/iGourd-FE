import type {
  SaleEnterCreateVO,
  SaleEnterModifyVO,
  SaleEnterQueryPageVO,
  SaleEnterRemoveVO,
} from '@@/sale/types';

import { requestClient } from '#/api/request';

const SALE_ENTER_BASE_URL = '/v1/merchant/trade/daily-settlement';

// 获取销售录入分页列表
export function getSaleEnterPageListApi(data: SaleEnterQueryPageVO) {
  return requestClient.post(`${SALE_ENTER_BASE_URL}/page-list`, data);
}

// 创建销售录入
export function createSaleEnterApi(data: SaleEnterCreateVO) {
  return requestClient.post(`${SALE_ENTER_BASE_URL}/create`, data);
}

// 更新销售录入
export function updateSaleEnterApi(data: SaleEnterModifyVO) {
  return requestClient.post(`${SALE_ENTER_BASE_URL}/modify`, data);
}

// 删除销售录入
export function deleteSaleEnterApi(data: SaleEnterRemoveVO) {
  return requestClient.post(`${SALE_ENTER_BASE_URL}/remove`, data);
}

// 获取销售录入详情
export function getSaleEnterDetailApi(data: {
  enter_id: number;
  merchant_id?: number;
}) {
  return requestClient.post(`${SALE_ENTER_BASE_URL}/detail`, data);
}

// 手动生成结算单
export function manualGenerateSettlementApi(data: {
  merchant_id?: number;
  settlement_date: string;
}) {
  return requestClient.post(
    `${SALE_ENTER_BASE_URL}/manual-generate-create`,
    data,
  );
}
