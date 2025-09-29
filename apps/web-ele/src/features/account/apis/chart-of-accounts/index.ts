import type {
  AccountingPeriodCurrentQueryVO,
  AccountLedgerBalanceModifyVO,
  AccountLedgerBalanceTreeQueryVO,
  AccountLedgerCreateVO,
  AccountLedgerModifyVO,
  AccountLedgerRemoveVO,
  AccountModifyVO,
  FindCurrentPeriodPayload,
  SubsidiaryLedgerQueryPageVO,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 科目余额树形结构查询
export function getChartOfAccountsTreeApi(
  data: AccountLedgerBalanceTreeQueryVO,
) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger-balance/tree-list`,
    data,
  );
}

// 修改科目余额
export function modifyLedgerBalanceApi(data: AccountLedgerBalanceModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger-balance/modify`,
    data,
  );
}

// 创建科目
export function createAccountLedgerApi(data: AccountLedgerCreateVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/create`,
    data,
  );
}

// 删除科目
export function removeAccountLedgerApi(data: AccountLedgerRemoveVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/remove`,
    data,
  );
}

// 获取科目详情
export function getAccountLedgerDetailApi(account_ledger_id: number) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/detail`,
    { account_ledger_id },
  );
}

// 修改科目
export function modifyAccountLedgerApi(data: AccountLedgerModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/modify`,
    data,
  );
}
// 创建账户
export function createAccountApi(data: AccountModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account/create`,
    data,
  );
}

// 修改账户
export function modifyAccountApi(data: AccountModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account/modify`,
    data,
  );
}

// 查询叶子节点科目
export function getLeafLedgersApi(data: {
  account_set_id: number;
  merchant_id?: number;
}) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/leaf-ledgers`,
    data,
  );
}

// 获取账套详情
export function getAccountSetDetailApi(data: {
  id?: number;
  merchant_id?: number;
}) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-set/detail`,
    data,
  );
}

// 明细账分页查询
export function getSubsidiaryLedgerPageApi(data: SubsidiaryLedgerQueryPageVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/subsidiary-ledger/page-list`,
    data,
  );
}

// 获取当前会计期间
export function getCurrentPeriodApi(data: FindCurrentPeriodPayload) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-period/current`,
    data,
  );
}

// 获取会计期间列表
export function getAccountingPeriodsApi(data: AccountingPeriodCurrentQueryVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-period/list`,
    data,
  );
}
