import type { AccountLedgerBalanceTreeModel } from '@@/account/types';

import type { VxeGridPropTypes } from '@igourd/plugins/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getChartOfAccountsTreeApi,
  modifyLedgerBalanceApi,
  removeAccountApi,
  removeAccountLedgerApi,
} from '@@/account/apis';
import { ChartOfAccountsDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useChartOfAccounts() {
  const { t } = useI18n();

  // 基础列定义
  const columns: VxeGridPropTypes.Column<AccountLedgerBalanceTreeModel>[] = [
    {
      field: 'code',
      width: 165,
      fixed: 'left',
      title: t('account.account_code'),
    },
    {
      field: 'name',
      width: 220,
      title: t('account.account_ledger_name'),
    },
    {
      field: 'balance_direction',
      width: 200,
      title: t('account.balance_direction'),
    },
    {
      field: 'initial_balance',
      width: 180,
      title: t('account.opening_balance'),
    },
    {
      field: 'cumulative_debit_amount',
      width: 180,
      title: t('account.cumulative_debit'),
    },
    {
      field: 'cumulative_credit_amount',
      width: 180,
      title: t('account.cumulative_credit'),
    },
    {
      field: 'current_debit_amount',
      width: 200,
      title: t('account.current_debit_amount'),
    },
    {
      field: 'current_credit_amount',
      width: 200,
      title: t('account.current_credit_amount'),
    },
    {
      field: 'beginning_balance',
      width: 200,
      title: t('account.beginning_balance'),
    },
    {
      field: 'ending_balance',
      width: 200,
      title: t('account.ending_balance'),
    },
  ];

  // 标签页选项
  const tabOptions = [
    { label: t('account.asset'), value: 'asset' },
    { label: t('account.liability'), value: 'liability' },
    { label: t('account.equity'), value: 'equity' },
    { label: t('account.revenue'), value: 'revenue' },
    { label: t('account.expense'), value: 'expense' },
    { label: t('account.profit_and_loss'), value: 'profitAndLoss' },
  ];

  let queryParam = null;
  // 查询数据
  const handleQueryTable = (qParam) => {
    queryParam = qParam;
    gridApi.reload();
  };

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (data: {
      date_range?: string[];
      page_num: number;
      page_size: number;
    }) => {
      const params = {
        ...data,
        category: '',
      };
      if (queryParam && queryParam.category) {
        params.category = queryParam.category;
      }
      return await getChartOfAccountsTreeApi(params);
    },
    // 删除科目
    remove: async (data: { ledger_id_list: number[] }) => {
      return await removeAccountLedgerApi(data);
    },
    removeAccount: async (data: {
      account_id_list: number[];
      merchant_id?: number;
    }) => {
      return await removeAccountApi(data);
    },

    modifyBalance: async (data: any) => {
      return await modifyLedgerBalanceApi(data);
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    Drawer,
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
  } = useCrud({
    // @ts-ignore
    service,
    columns,
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

  return {
    Grid,
    Drawer,
    tabOptions,
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
    gridApi,
    handleQueryTable,
  };
}
