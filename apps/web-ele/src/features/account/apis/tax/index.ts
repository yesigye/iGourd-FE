import type {
  TaxQueryPageVO,
  TaxPageModel,
  TaxCreateVO,
  TaxModifyVO,
  TaxRemoveVO,
  TaxDetailModel,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取税务分页列表
export function getTaxPageListApi(data: TaxQueryPageVO) {
  return requestClient.post(
    `/merchant/basics/accounting/tax/page-list`,
    data,
  );
}

// 创建税务
export function createTaxApi(data: TaxCreateVO) {
  return requestClient.post(
    `/merchant/basics/accounting/tax/create`,
    data,
  );
}

// 更新税务
export function updateTaxApi(data: TaxModifyVO) {
  return requestClient.post(
    `/merchant/basics/accounting/tax/modify`,
    data,
  );
}

// 删除税务
export function deleteTaxApi(data: TaxRemoveVO) {
  return requestClient.post(
    `/merchant/basics/accounting/tax/remove`,
    data,
  );
}

// 获取税务详情
export function getTaxDetailApi(data: { tax_id: number; merchant_id?: number }) {
  return requestClient.post(
    `/merchant/basics/accounting/tax/detail`,
    data,
  );
}
