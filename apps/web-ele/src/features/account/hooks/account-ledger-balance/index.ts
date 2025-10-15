import { observable } from '@igourd/common-ui';
import { snakeCase } from '@igourd/utils';
import { getChartOfAccountsTreeApi } from '../../apis';

export function useNewParentIdOptions() {
  const options = observable<{ value: any[] }>({ value: [] });
  const getAccountLedger = (accountLedgers: any) => {
    const newData: any[] = [];
    accountLedgers.forEach((item: any) => {
      const { children, ...account_ledger } = item;
      if (children?.length) {
        if (account_ledger?.id) {
          newData.push({
            ...account_ledger,
            children,
            label: `${account_ledger?.name || ''} - ${account_ledger?.code}`,
            value: String(account_ledger.id),
          });
        }
        getAccountLedger(children);
      } else {
        if (!account_ledger?.account_balances?.length && account_ledger?.id) {
          newData.push({
            ...account_ledger,
            label: `${account_ledger?.name || ''} - ${account_ledger?.code}`,
            value: String(account_ledger.id),
          });
        }
      }
    });
    return newData;
  };

  async function query(category: string) {
    const data = await getChartOfAccountsTreeApi({
      category: snakeCase(category).toUpperCase(),
    });
    options.value = getAccountLedger(data);
    return options.value;
  }

  return { query, options };
}
