import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { getSubsidiaryLedgerPageListApi } from '@@/account/apis';
import { SubsidiaryLedgerDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

const userStore = useUserStore();

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
        account_ledger_ids: [],
        account_set_id: '',
        start_accounting_period: '2025-07',
        end_accounting_period: '2025-07',
      };
      const account_set_id = userStore.merchantInfo?.account_set_id;
      if (account_set_id) {
        params.account_set_id = account_set_id;
      }
      if (queryParam && queryParam.account_ledger_ids) {
        params.account_ledger_ids = queryParam.account_ledger_ids;
      }
      return await getSubsidiaryLedgerPageListApi(params);
    },
  };
  let queryParam = null;
  // 查询数据
  const handleQueryTable = (qParam) => {
    queryParam = qParam;
    gridApi.reload();
  };

  // 使用 CRUD Hook
  const {
    Grid,
    canBatchOperate,
    Drawer,
    handleEdit,
    handleBatchDelete,
    gridApi,
  } = useCrud({
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
    handleQueryTable,
  };
}
