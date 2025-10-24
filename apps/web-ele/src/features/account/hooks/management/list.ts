import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { nextTick, provide, ref } from 'vue';

import { useI18n } from '@igourd/locales';

import {
  createAccountApi,
  getAccountDetailApi,
  getAccountManagementListApi,
  removeAccountApi,
  updateAccountApi,
} from '@@/account/apis';
import { AccountDrawerForm } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useAccountManagement() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'code',
      title: t('account.ledger-no'),
      minWidth: 100,
      sortable: true,
      align: 'left',
    },
    {
      field: 'name',
      title: t('account.ledger-name'),
      minWidth: 165,
      sortable: true,
      align: 'left',
    },
    {
      field: 'account_ledger_name',
      title: t('account.account-ledger'),
      minWidth: 165,
      sortable: true,
      align: 'left',
    },
    {
      field: 'account_type',
      title: t('account.ledger-type'),
      minWidth: 165,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue === 'CARD') return t('account.bank');
        if (cellValue === 'CASH') return t('account.cash');
        return t('account.all');
      },
    },
    {
      field: 'initial_balance',
      title: t('account.opening-balance'),
      minWidth: 165,
      sortable: true,
      align: 'left',
      formatter: 'formatMoney',
    },
    {
      field: 'current_balance',
      title: t('account.closing-balance'),
      minWidth: 165,
      sortable: true,
      align: 'left',
      formatter: 'formatMoney',
    },
    {
      field: 'operation',
      title: t('account.operation'),
      sortable: true,
      minWidth: 180,
      slots: { default: 'operation' },
    },
  ];
  const type = ref('CASH');
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('account.enter-cash-or-bank-name')}}",
        clearable: true,
      },
    },
  };

  provide(Symbol.for('FormType'), { type });

  const {
    Grid,
    Drawer,
    handleEdit: innerHandleEdit,
    canBatchOperate,
    handleBatchDelete,
    handleView,
  } = useCrud<any, any>({
    columns,
    id: 'management-list',
    searchFormSchema,
    batchOperate: true,
    connectedComponent: AccountDrawerForm,
    service: {
      query: getAccountManagementListApi,
      update: updateAccountApi,
      create: createAccountApi,
      detail: (dto) => getAccountDetailApi(dto.id),
      drop: removeAccountApi,
    },
  });

  function handleEdit(dto?: any, mode?: 'CARD' | 'CASH') {
    type.value = mode ?? 'CASH';
    nextTick(() => {
      innerHandleEdit(dto);
    });
  }

  return {
    Grid,
    Drawer,
    type,
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
    handleView,
  };
}
