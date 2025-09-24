import type { SubsidiaryLedgerQueryPageVO } from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取明细账分页列表
export function getSubsidiaryLedgerPageListApi(
  data: SubsidiaryLedgerQueryPageVO,
) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/subsidiary-ledger/page-list`,
    data,
  );
}
// 获取指定科目类别和期间下的科目树
export function getaccountLedgerBalanceApi(data: SubsidiaryLedgerQueryPageVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger-balance/tree-list`,
    data,
  );
}
