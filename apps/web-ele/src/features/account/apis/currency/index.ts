import type {
  CurrencyQueryPageVO,
  PaginatedCurrencyInfo,
  CurrencyCreateVO,
  CurrencyModifyVO,
  CurrencyRemoveVO,
  CurrencyDetailModel,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取货币分页列表
export function getCurrencyPageListApi(data: CurrencyQueryPageVO) {
  return requestClient.post(
    `/merchant/basics/currency/page-list`,
    data,
  );
}

// 获取货币列表
export function getCurrencyListApi(data: any) {
  return requestClient.post(
    `/merchant/basics/currency/list`,
    data,
  );
}

// 创建货币
export function createCurrencyApi(data: CurrencyCreateVO) {
  return requestClient.post(
    `/merchant/basics/currency/create`,
    data,
  );
}

// 更新货币
export function updateCurrencyApi(data: CurrencyModifyVO) {
  return requestClient.post(
    `/merchant/basics/currency/modify`,
    data,
  );
}

// 删除货币
export function deleteCurrencyApi(data: CurrencyRemoveVO) {
  return requestClient.post(
    `/merchant/basics/currency/remove`,
    data,
  );
}

// 获取货币详情
export function getCurrencyDetailApi(currency_id: number) {
  return requestClient.post(
    `/merchant/basics/currency/detail`,
    { currency_id },
  );
}
