import { AccountingPeriodSettlementStatusEnum } from '@@/account/types';

export const transferType = (item: {
  is_locked: boolean;
  settlement_status: AccountingPeriodSettlementStatusEnum;
}) => {
  if (item.is_locked || item.settlement_status === 'CLOSED') {
    return {
      bgColor: 'bg-[#9E9E9E]',
      borderColor: 'border-[#9E9E9E]',
      textColor: 'text-[#9E9E9E]',
      cursor: 'cursor-not-allowed',
      isDisable: true,
    };
  } else if (item.settlement_status === 'OPEN') {
    return {
      bgColor: 'bg-success',
      borderColor: 'border-success',
      textColor: 'text-success',
      cursor: 'cursor-pointer',
      isDisable: false,
    };
  } else if (
    item.settlement_status === 'PROFIT_LOSS_TRANSFERRED' ||
    item.settlement_status === 'ROLL_BACKED'
  ) {
    return {
      bgColor: 'bg-primary',
      borderColor: 'border-primary',
      textColor: 'text-primary',
      cursor: 'cursor-pointer',
      isDisable: false,
    };
  } else {
    return {};
  }
};
export const transferTypeReverse = (item: {
  is_locked: boolean;
  settlement_status: AccountingPeriodSettlementStatusEnum;
}) => {
  if (item.is_locked || item.settlement_status.value == 'CLOSED') {
    return {
      bgColor: 'bg-[#9E9E9E]',
      borderColor: 'border-[#9E9E9E]',
      textColor: 'text-[#9E9E9E]',
      cursor: 'cursor-pointer',
      isDisable: true,
    };
  } else if (item.settlement_status.value == 'OPEN') {
    return {
      bgColor: 'bg-success',
      borderColor: 'border-success',
      textColor: 'text-success',
      cursor: 'cursor-pointer',
      isDisable: false,
    };
  } else if (
    item.settlement_status.value === 'PROFIT_LOSS_TRANSFERRED' ||
    item.settlement_status.value === 'ROLL_BACKED'
  ) {
    return {
      bgColor: 'bg-primary',
      borderColor: 'border-primary',
      textColor: 'text-primary',
      cursor: 'cursor-pointer',
      isDisable: false,
    };
  } else {
    return {};
  }
};
