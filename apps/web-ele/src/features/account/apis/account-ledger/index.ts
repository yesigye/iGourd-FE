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
/**
 * 科目分页查询请求接收参数VO
 * @param {any}      [body]          (optional)
 */
export const accountLedgerPageQueryPageVO = (data: any) => {
  return requestClient
    .post('/v1/merchant/basics/accounting/account-ledger/page-list', data)
    .then((res) => {
      return {
        ...res,
        list: res.list?.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.code,
        })),
      };
    });
};
