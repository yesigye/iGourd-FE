import type { AccountFlowsInfo } from '../../types/account';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getFinanceFlowPageListApi } from '@@/account/apis';
import { FlowsDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

const sourceTypeMap = {
  ACCOUNTING_NOTE_CREATE: {
    label: 'account.source_type.accounting_note_create',
  },
  ACCOUNTING_NOTE_MODIFY: {
    label: 'account.source_type.accounting_note_modify',
  },
  CUSTOMER_RECHARGE_WITHOUT_VIP: {
    label: 'account.source_type.customer_recharge_without_vip',
  },
  CUSTOMER_RECHARGE_WITH_VIP: {
    label: 'account.source_type.customer_recharge_with_vip',
  },
  MANUALLY_CREATE: {
    label: 'account.source_type.manually_create',
  },
  PURCHASE_BILL_GOODS_PAYMENT: {
    label: 'account.source_type.purchase_bill_goods_payment',
  },
  PURCHASE_ORDER_PAYMENT: {
    label: 'account.source_type.purchase_order_payment',
  },
  PURCHASE_ORDER_RETURNED: {
    label: 'account.source_type.purchase_order_returned',
  },
  SALES_OFFLINE_ORDER_SYNC: {
    label: 'account.source_type.sales_offline_order_sync',
  },
  SALES_ORDER_PAYMENT: {
    label: 'account.source_type.sales_order_payment',
  },
  SALES_ORDER_REFUND: {
    label: 'account.source_type.sales_order_refund',
  },
};

export function useFlows() {
  const { t } = useI18n();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<AccountFlowsInfo>[] = [
    {
      type: 'checkbox',
      minWidth: 80,
      fixed: 'left',
    },
    {
      field: 'flow_no',
      minWidth: 165,
      align: 'left',
      fixed: 'left',
      title: t('account.serialNumber'),
    },
    {
      field: 'finance_category_name',
      minWidth: 200,
      align: 'right',
      title: t('account.financeCategoryName'),
    },
    {
      field: 'revenue_amount',
      minWidth: 150,
      align: 'right',
      title: t('account.revenueAmount'),
      formatter: 'formatMoney',
    },
    {
      field: 'expenditure_amount',
      minWidth: 150,
      align: 'right',
      title: t('account.expenditureAmount'),
      formatter: 'formatMoney',
    },
    {
      field: 'business_original_amount',
      minWidth: 150,
      align: 'right',
      title: t('account.business_original_amount'),
      formatter: 'formatMoney',
    },
    {
      field: 'trader_name',
      minWidth: 150,
      title: t('account.trader_name'),
    },
    {
      minWidth: 200,
      title: '支付信息',
      children: [
        {
          field: 'target_account_name',
          minWidth: 200,
          title: t('account.target_account_name'),
        },
        {
          field: 'payment_method_name',
          minWidth: 200,
          title: t('account.payment_method'),
        },
      ],
    },
    {
      field: 'source_type',
      minWidth: 150,
      title: t('account.source'),
      formatter({ cellValue }: { cellValue: keyof typeof sourceTypeMap }) {
        return t(sourceTypeMap[cellValue].label);
      },
    },
    {
      field: 'trading_no',
      minWidth: 150,
      title: t('account.tradingNo'),
    },
    {
      field: 'remark',
      minWidth: 150,
      title: t('account.remark'),
    },
    {
      field: 'trading_time',
      minWidth: 150,
      title: t('account.trading_time'),
    },
    {
      field: 'creator_name',
      minWidth: 200,
      title: t('account.creatorName'),
    },
    {
      field: 'create_time',
      minWidth: 180,
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
      id: 'flows',
      tabs: [
        { value: 'ALL', label: '全部' },
        { value: 'CREDIT', label: '收入' },
        { value: 'DEBIT', label: '支出' },
      ],
      tabsOption: {
        defaultActiveValue: 'ALL',
        formKey: 'balance_direction',
      },
      toolbarConfig: {
        print: true,
        export: true,
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
