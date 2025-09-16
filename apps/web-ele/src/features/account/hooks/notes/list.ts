import type {
  AccountingNotePageModel,
  GetFinanceNoteListRequest,
} from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getFinanceNoteListApi,
  removeAccountingNoteApi,
} from '@@/account/apis';
import { NotesDrawerForm } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useAccountNotes() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<AccountingNotePageModel>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'accounting_note_no',
      title: t('account.note_no'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'change_type',
      title: t('account.change_type'),
      minWidth: 120,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue === 'REVENUE') return t('account.revenue');
        if (cellValue === 'EXPENDITURE') return t('account.expenditure');
        return cellValue;
      },
    },
    {
      field: 'amount',
      title: t('account.amount'),
      minWidth: 120,
      sortable: true,
      align: 'left',
      formatter: 'formatMoney',
    },
    {
      field: 'payer_name',
      title: t('account.payer_name'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'finance_category_name',
      title: t('account.finance_category'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'review_status',
      title: t('account.review_status'),
      minWidth: 120,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue === 'PENDING') return t('account.pending');
        if (cellValue === 'APPROVED') return t('account.approved');
        if (cellValue === 'REJECTED') return t('account.rejected');
        return cellValue;
      },
    },
    {
      field: 'creator_name',
      title: t('account.creator'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('account.create_time'),
      minWidth: 150,
      sortable: true,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('account.operation'),
      sortable: true,
      minWidth: 180,
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('account.enter_note_no')}}",
        clearable: true,
      },
    },
  };

  return useCrud<AccountingNotePageModel, GetFinanceNoteListRequest>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: NotesDrawerForm,
    service: {
      query: getFinanceNoteListApi,
      drop: removeAccountingNoteApi,
    },
  });
}
