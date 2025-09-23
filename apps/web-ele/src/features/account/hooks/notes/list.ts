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
      title: t('account.notes_no'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'finance_category_name',
      title: t('account.finance_category'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    // {
    //   field: 'amount',
    //   title: t('account.amount'),
    //   minWidth: 120,
    //   sortable: true,
    //   align: 'left',
    //   formatter: 'formatMoney',
    // },
    {
      field: 'our_account',
      title: t('account.our_account'),
      align: 'center',
      children: [
        {
          field: 'our_account_name',
          title: t('account.payment_account'),
          align: 'center',
          width: 138,
        },
        {
          field: 'our_payment_method_name',
          title: t('account.payment_method'),
          align: 'center',
          width: 135,
        },
        {
          field: 'amount',
          title: t('account.amount'),
          align: 'center',
          width: 135,
        },
      ],
    },
    {
      field: 'external_account',
      align: 'center',
      title: t('account.external_account'),
      children: [
        {
          field: 'target_account_name',
          title: t('account.payment_account'),
          width: 138,
        },
        {
          field: 'amount',
          title: t('account.amount'),
          width: 138,
        },
      ],
    },
    {
      field: 'trading_time',
      title: t('account.transaction_time'),
      minWidth: 150,
      sortable: true,
      align: 'left',
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
      title: t('account.creation_time'),
      minWidth: 150,
      sortable: true,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'reviewer',
      title: t('account.Review'),
      width: 165,
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
