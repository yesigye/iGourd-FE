import type {
  CurrencyExchangeQueryPageVO,
  CurrencyExchangePageModel,
  CurrencyExchangeCreateVO,
  CurrencyExchangeModifyVO,
  CurrencyExchangeRemoveVO,
  CurrencyExchangeDetailModel,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取货币兑换分页列表
export function getCurrencyExchangePageListApi(data: CurrencyExchangeQueryPageVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/currency-exchange/page-list`,
    data,
  );
}

// 创建货币兑换
export function createCurrencyExchangeApi(data: CurrencyExchangeCreateVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/currency-exchange/create`,
    data,
  );
}

// 更新货币兑换
export function updateCurrencyExchangeApi(data: CurrencyExchangeModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/currency-exchange/modify`,
    data,
  );
}

// 删除货币兑换
export function deleteCurrencyExchangeApi(data: CurrencyExchangeRemoveVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/currency-exchange/remove`,
    data,
  );
}

// 获取货币兑换详情
export function getCurrencyExchangeDetailApi(data: { currency_exchange_id: number; merchant_id?: number }) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/currency-exchange/detail`,
    data,
  );
}
