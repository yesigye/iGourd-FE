// v1/merchant/basics/accounting/account-ledger/leaf/ledgers-and-accounts
import { requestClient } from '#/api/request';

export function getFinanceCategoryListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/leaf/ledgers-and-accounts`,
    data,
  );
}
