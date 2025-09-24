import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getSubsidiaryLedgerPageListApi } from '@@/account/apis';
import { SubsidiaryLedgerDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useSubsidiaryLedger() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'create_time',
      title: t('account.date'),
    },
    {
      field: 'account_ledger',
      title: t('account.account'),
    },
    {
      field: 'summary',
      title: t('account.summary'),
    },
    {
      field: 'debit_amount',
      title: t('account.debitAmount'),
    },
    {
      field: 'credit_amount',
      title: t('account.creditAmount'),
    },
    {
      field: 'balance',
      title: t('account.balance'),
    },
  ];

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
        account_ledger_ids: ['1942547125471567979'],
        account_set_id: '1942547124754341890',
        start_accounting_period: '2025-07',
        end_accounting_period: '2025-07',
      };
      return await getSubsidiaryLedgerPageListApi(params);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        date: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            type: 'monthrange',
            placeholder: t('common.keywords'),
          },
        },
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('common.keywords'),
          },
        },
      },
      batchOperate: false,
      connectedComponent: SubsidiaryLedgerDrawer,
    });

  return {
    // 组件
    Grid,
    Drawer,

    // 方法
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
  };
}
