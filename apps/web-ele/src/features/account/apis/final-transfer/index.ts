import type { FinalTransferQueryParams } from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取期末结转列表
export function getFinanceNoteList(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-note/page-list`,
    data,
  );
}
export function carryOverProfitPreCheck(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger-balance/carry-over/profit/pre-check`,
    data,
  );
}
export function executePeriodCloseUsingPOST(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-period/period-close/execute`,
    data,
  );
}
export function executeProfitLossCarryForward(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger-balance/carry-over/profit/execute`,
    data,
  );
}
export function listAccountingPeriods(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-period/list`,
    data,
  );
}
export function trialBalanceCheck(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger-balance/trial-balance/check`,
    data,
  );
}
export function validateBeforeClosing(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-period/period-close/pre-check`,
    data,
  );
}
export function executePeriodRollBacked(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-period/period-roll-backed/execute`,
    data,
  );
}

export function listSubLedgerTree(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger-balance/tree-list`,
    data,
  );
}
