import type {
  AccountingNotePageModel,
  GetFinanceNoteListRequest,
} from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getFinanceNoteListApi } from '@@/account/apis';

import { useCrud } from '#/hooks';

export function useNotesList(defaultParams?: Record<string, any>) {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<AccountingNotePageModel>[] = [
    {
      type: 'checkbox',
      minWidth: 50,
      fixed: 'left',
    },
    {
      field: 'trading_time',
      title: t('account.transaction_time'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'accounting_note_no',
      title: t('account.notes_no'),
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
      field: 'amount',
      title: t('account.amount'),
      minWidth: 120,
      sortable: true,
      align: 'left',
      formatter: 'formatMoney',
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

  const crud = useCrud<AccountingNotePageModel, GetFinanceNoteListRequest>({
    columns,
    id:'note-list',
    searchFormSchema,
    params: defaultParams,
    batchOperate: false,
    service: {
      query: getFinanceNoteListApi,
    },
  });
  return {
    ...crud,
    columns,
  };
}
