import type {
  SubsidiaryLedgerQueryPageVO,
  SubsidiaryLedgerPageModel,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取明细账分页列表
export function getSubsidiaryLedgerPageListApi(data: SubsidiaryLedgerQueryPageVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/subsidiary-ledger/page-list`,
    data,
  );
}
