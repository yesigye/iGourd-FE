import type { FinalTransferData } from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getFinalTransferListApi,
  executeFinalTransferApi,
  reverseFinalTransferApi,
  getTransferStatusApi,
} from '@@/account/apis';
import { FinalTransferDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useFinalTransfer() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<FinalTransferData>[] = [
    {
      field: 'code',
      width: 165,
      fixed: 'left',
      title: t('account.account'),
      sortable: true,
    },
    {
      field: 'current_debit_amount',
      width: 200,
      title: t('account.debit_amount'),
      sortable: true,
    },
    {
      field: 'current_credit_amount',
      width: 200,
      title: t('account.credit_amount'),
      sortable: true,
    },
  ];
  // 服务函数
  const service = {
    // 获取列表数据
    query: getFinalTransferListApi,

    // 执行结转
    execute: executeFinalTransferApi,

    // 撤销结转
    reverse: reverseFinalTransferApi,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('account.searchPlaceholder'),
          },
        },
      },
      batchOperate: true,
      connectedComponent: FinalTransferDrawer,
    });


  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
