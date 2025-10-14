import { observable } from '@igourd/common-ui';
import { getLeafLedgersOptions } from '../../apis';
import { useUserStore } from '@igourd/stores';

export function useLeafLedgers() {
  const leafLedgers = observable<{ value: any[] }>({
    value: [],
  });
  const {
    merchantInfo: { account_set_id },
  } = useUserStore();
  getLeafLedgersOptions({ account_set_id }).then((res) => {
    leafLedgers.value = res;
  });
  return leafLedgers;
}
export enum AccountLedgerCategoryEnum {
  // 资本
  ASSET = 'ASSET',
  // 负债
  LIABILITY = 'LIABILITY',
  // 成本
  COST = 'COST',
  // 权益
  EQUITY = 'EQUITY',
  // 利润和损失
  PROFIT_AND_LOSS = 'PROFIT_AND_LOSS',
}
export function useAccountLedgerCategoryOptions() {
  return [
    {
      label: 'account.asset',
      value: AccountLedgerCategoryEnum.ASSET,
    },
    {
      label: 'account.liability',
      value: AccountLedgerCategoryEnum.LIABILITY,
    },
    {
      label: 'account.cost',
      value: AccountLedgerCategoryEnum.COST,
    },
    {
      label: 'account.equity',
      value: AccountLedgerCategoryEnum.EQUITY,
    },
    {
      label: 'account.profit_and_loss',
      value: AccountLedgerCategoryEnum.PROFIT_AND_LOSS,
    },
  ];
}
export const getBalanceDirection = (balanceDirection: string): string => {
  switch (balanceDirection.toUpperCase()) {
    case 'DEBIT':
      return 'DR';
    case 'CREDIT':
      return 'CR';
    default:
      return '';
  }
};
// AccountLedgerBalanceDirectionEnum: 科目余额方向枚举
export enum AccountLedgerBalanceDirectionEnum {
  // 借方向
  DEBIT = 'DEBIT',
  // 贷方向
  CREDIT = 'CREDIT',
}
export const accountLedgerBalanceDirectionOptions = () => {
  return [
    {
      label: 'account.balance_directions.debit',
      value: AccountLedgerBalanceDirectionEnum.DEBIT,
    },
    {
      label: 'account.balance_directions.credit',
      value: AccountLedgerBalanceDirectionEnum.CREDIT,
    },
  ];
};
