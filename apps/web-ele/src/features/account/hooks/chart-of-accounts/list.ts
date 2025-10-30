import type { ChartOfAccountType } from '@@/account/components';

import type { VxeGridPropTypes } from '@igourd/plugins/vxe-table';

import { nextTick, ref, unref } from 'vue';

import { useI18n } from '@igourd/locales';

import {
  createAccountApi,
  createAccountLedgerApi,
  getChartOfAccountsTreeApi,
  modifyAccountApi,
  modifyAccountLedgerApi,
  modifyLedgerBalanceApi,
  removeAccountLedgerApi,
} from '@@/account/apis';
import { ChartOfAccountsDrawer } from '@@/account/components';

import { useCrud, useLanguage } from '#/hooks';

function accountSaveOrUpdate(dto: any) {
  if (Reflect.has(dto, 'id')) {
    return modifyAccountApi(dto);
  }
  return createAccountApi(dto);
}
function ledgerSaveOrUpdate(dto: any) {
  if (Reflect.has(dto, 'id')) {
    return modifyAccountLedgerApi(dto);
  }
  return createAccountLedgerApi(dto);
}

function saveOrUpdate(dto: any, type: ChartOfAccountType) {
  if (type === 'ledger') {
    return accountSaveOrUpdate(dto);
  }
  return ledgerSaveOrUpdate(dto);
}

export function useChartOfAccounts() {
  const { t } = useI18n();
  const categories = ref([]);
  const typeRef = ref<ChartOfAccountType>('ledger');
  // 基础列定义
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'code',
      width: 165,
      fixed: 'left',
      align: 'left',
      title: t('account.account-code'),
      treeNode: true,
    },
    {
      field: 'name',
      width: 220,
      title: t('account.account-ledger-name'),
    },
    {
      field: 'balance_direction',
      width: 200,
      title: t('account.balance-direction'),
      slots: {
        default: 'balance_direction',
      },
    },
    {
      field: 'initial_balance',
      width: 180,
      title: t('account.opening-balance'),
      editRender: { name: 'input' },
    },
    {
      field: 'cumulative_debit_amount',
      width: 180,
      title: t('account.cumulative-debit'),
      editRender: { name: 'input' },
    },
    {
      field: 'cumulative_credit_amount',
      width: 180,
      title: t('account.cumulative-credit'),
      editRender: { name: 'input' },
    },
    {
      field: 'current_debit_amount',
      width: 200,
      title: t('account.current-debit-amount'),
    },
    {
      field: 'current_credit_amount',
      width: 200,
      title: t('account.current-credit-amount'),
    },
    {
      field: 'beginning_balance',
      width: 200,
      title: t('account.beginning-balance'),
    },
    {
      field: 'ending_balance',
      width: 200,
      title: t('account.ending-balance'),
    },
    {
      field: 'actions',
      width: 100,
      title: t('common.action'),
      fixed: 'right',
      slots: {
        default: 'actions',
      },
    },
  ];

  // 标签页选项
  const tabOptions = [
    { label: t('account.asset'), value: 'asset' },
    { label: t('account.liability'), value: 'liability' },
    { label: t('account.equity'), value: 'equity' },
    { label: t('account.revenue'), value: 'revenue' },
    { label: t('account.expense'), value: 'expense' },
    { label: t('account.profit-and-loss'), value: 'profitAndLoss' },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getChartOfAccountsTreeApi,
    // 删除科目
    remove: async (data: { ledger_id_list: number[] }) => {
      return await removeAccountLedgerApi(data);
    },
    create(dto: any) {
      return saveOrUpdate(dto, unref(typeRef));
    },
    update(dto: any) {
      return saveOrUpdate(dto, unref(typeRef));
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    Drawer,
    handleEdit: innerHandleEdit,
    canBatchOperate,
    handleBatchDelete,
  } = useCrud({
    girdEvents: {
      editClosed({ row }) {
        modifyLedgerBalanceApi({
          ...row,
          // @ts-ignore
          account_ledger_id: row.curr_account_balance_model
            ? // @ts-ignore
              row.account_ledger_id
            : row.id,
        }).then(() => {
          gridApi.reload();
        });
      },
    },
    service,
    id: 'account_ledger_balance_export',
    stripe: false,
    columns,
    pagerConfig: {
      enabled: false,
    },

    tabs: categories.value,
    tabsOption: {
      defaultActiveValue: 'COST',
      formKey: 'category',
    },
    toolbarConfig: {
      export: true,
    },
    treeConfig: {
      rowField: 'id',
      childrenField: 'children',
    },
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      beforeEditMethod({ row }) {
        return (
          row?.ledger_balance_model?.is_first_period ||
          row?.curr_account_balance_model?.is_first_period
        );
      },
    },
    searchFormSchema: {
      keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('common.keywords')}}",
          clearable: true,
        },
      },
    },
    batchOperate: false,
    connectedComponent: ChartOfAccountsDrawer,
  });
  useLanguage('basics.accounting.account-ledger-category-enum').then((res) => {
    categories.value = res;
  });
  const handleEdit = (dto?: any, type?: ChartOfAccountType) => {
    typeRef.value = type ?? 'ledger';
    nextTick(() => {
      innerHandleEdit(dto);
    });
  };
  return {
    Grid,
    Drawer,
    tabOptions,
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
    categories,
    gridApi,
    typeRef,
  };
}
