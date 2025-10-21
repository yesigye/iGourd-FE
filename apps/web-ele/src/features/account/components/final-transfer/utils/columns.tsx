import { ElTableColumnProps } from 'igourd-ui';

export enum SearchKeyword {
  accountCode = 'code',
  accountName = 'name',
}

export const baseColumns = [
  {
    prop: SearchKeyword.accountCode,
    width: 165,
    fixed: 'left',
    label: 'account.account',
    filterAble: false,
    render: (row: any) => {
      return `${row.code}   ${row.name}`;
    },
  },
];

/**  column */
export const columnsVisible = (): ElTableColumnProps[] => {
  return [
    ...baseColumns,
    {
      prop: 'current_debit_amount',
      width: 200,
      label: 'account.debit-amount',
    },
    {
      prop: 'current_credit_amount',
      width: 200,
      label: 'account.credit-amount',
    },
  ];
};

export const accountNoteColumns = (il8n): ElTableColumnProps[] => {
  return [
    {
      prop: 'accounting_note_no',
      label: 'account.notes-no',
    },
    {
      prop: 'finance_category_name',
      label: 'account.finance-category',
    },
    {
      prop: 'change_type',
      label: 'account.type',
      render: (row: any) => {
        return il8n(`account.${row.change_type}`);
      },
    },
    {
      prop: 'amount',
      label: 'account.amount',
    },
  ];
};
