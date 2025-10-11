import type { AccountFlowsInfo } from '../../types/account';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getFinanceFlowPageListApi } from '@@/account/apis';
import { FlowsDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useFlows() {
  const { t } = useI18n();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<AccountFlowsInfo>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'flow_no',
      width: 165,
      align: 'left',
      fixed: 'left',
      title: t('account.serialNumber'),
    },
    {
      field: 'finance_category_name',
      width: 200,
      align: 'left',
      title: t('account.financeCategoryName'),
    },
    {
      field: 'revenue_amount',
      width: 150,
      align: 'left',
      title: t('account.revenueAmount'),
    },
    {
      field: 'expenditure_amount',
      width: 150,
      align: 'left',
      title: t('account.expenditureAmount'),
    },
    {
      field: 'business_original_amount',
      width: 150,
      title: t('account.business_original_amount'),
    },
    {
      field: 'trader_name',
      width: 150,
      title: t('account.trader_name'),
    },
    {
      width: 200,
      title: '支付信息',
      children: [
        {
          field: 'target_account_name',
          width: 200,
          title: t('account.target_account_name'),
        },
        {
          field: 'payment_method_name',
          width: 200,
          title: t('account.payment_method'),
        },
      ],
    },
    {
      field: 'source_type',
      width: 150,
      title: t('account.source'),
    },
    {
      field: 'trading_no',
      width: 150,
      title: t('account.tradingNo'),
    },
    {
      field: 'remark',
      width: 150,
      title: t('account.remark'),
    },
    {
      field: 'trading_time',
      width: 150,
      title: t('account.trading_time'),
    },
    {
      field: 'creator_name',
      width: 200,
      title: t('account.creatorName'),
    },
    {
      field: 'create_time',
      width: 180,
      title: t('account.createTime'),
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getFinanceFlowPageListApi,
  };

  // 使用 CRUD Hook
  const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,

      toolbarConfig: {
        print: true,
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
      connectedComponent: FlowsDrawer,
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
