// v1/merchant/basics/accounting/account-ledger/leaf/ledgers-and-accounts
import { requestClient } from '#/api/request';

export function getLedgersSelect(data: any) {
  const params = {
    ...data,
    account_ledger_code_list: data.account_ledger_code_list?.split(','),
    is_include_disabled_accounts: false,
  };
  return requestClient
    .post(
      `/v1/merchant/basics/accounting/account-ledger/leaf/ledgers-and-accounts`,
      params,
    )
    .then((res) => {
      return res.map((item: any) => {
        return {
          ...item,
          value: item.node_id,
          label: item.node_name,
        };
      });
    });
}
