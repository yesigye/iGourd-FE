import type { AccountFlowsInfo } from '../../types/account';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getFinanceFlowPageListApi } from '@@/account/apis';
import { FlowsDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

const sourceTypeMap = {
  ACCOUNTING_NOTE_CREATE: {
    label: 'account.source-type.accounting-note-create',
  },
  ACCOUNTING_NOTE_MODIFY: {
    label: 'account.source-type.accounting-note-modify',
  },
  CUSTOMER_RECHARGE_WITHOUT_VIP: {
    label: 'account.source-type.customer-recharge-without-vip',
  },
  CUSTOMER_RECHARGE_WITH_VIP: {
    label: 'account.source-type.customer-recharge-with-vip',
  },
  MANUALLY_CREATE: {
    label: 'account.source-type.manually-create',
  },
  PURCHASE_BILL_GOODS_PAYMENT: {
    label: 'account.source-type.purchase-bill-goods-payment',
  },
  PURCHASE_ORDER_PAYMENT: {
    label: 'account.source-type.purchase-order-payment',
  },
  PURCHASE_ORDER_RETURNED: {
    label: 'account.source-type.purchase-order-returned',
  },
  SALES_OFFLINE_ORDER_SYNC: {
    label: 'account.source-type.sales-offline-order-sync',
  },
  SALES_ORDER_PAYMENT: {
    label: 'account.source-type.sales-order-payment',
  },
  SALES_ORDER_REFUND: {
    label: 'account.source-type.sales-order-refund',
  },
};

export function useFlows() {
  const { t } = useI18n();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<AccountFlowsInfo>[] = [
    {
      type: 'checkbox',
      field: 'checkbox',
      minWidth: 80,
      fixed: 'left',
    },
    {
      field: 'flow_no',
      minWidth: 165,
      align: 'left',
      fixed: 'left',
      title: t('account.serial-number'),
    },
    {
      field: 'finance_category_name',
      minWidth: 200,
      align: 'right',
      title: t('account.finance-category-name'),
    },
    {
      field: 'revenue_amount',
      minWidth: 150,
      align: 'right',
      title: t('account.revenue-amount'),
      formatter: 'formatMoney',
    },
    {
      field: 'expenditure_amount',
      minWidth: 150,
      align: 'right',
      title: t('account.expenditure-amount'),
      formatter: 'formatMoney',
    },
    {
      field: 'business_original_amount',
      minWidth: 150,
      align: 'right',
      title: t('account.business-original-amount'),
      formatter: 'formatMoney',
    },
    {
      field: 'trader_name',
      minWidth: 150,
      title: t('account.trader-name'),
    },
    {
      minWidth: 200,
      field: 'target_account_name_col',
      title: '支付信息',
      children: [
        {
          field: 'target_account_name',
          minWidth: 200,
          title: t('account.target-account-name'),
        },
        {
          field: 'payment_method_name',
          minWidth: 200,
          title: t('account.payment-method'),
        },
      ],
    },
    {
      field: 'source_type',
      minWidth: 150,
      title: t('account.source'),
      // formatter({ cellValue }: { cellValue: keyof typeof sourceTypeMap }) {
      //   return t(sourceTypeMap[cellValue].label);
      // },
    },
    {
      field: 'trading_no',
      minWidth: 150,
      title: t('account.trading-no'),
    },
    {
      field: 'remark',
      minWidth: 150,
      title: t('account.remark'),
    },
    {
      field: 'trading_time',
      minWidth: 150,
      title: t('account.trading-time'),
    },
    {
      field: 'creator_name',
      minWidth: 200,
      title: t('account.creator-name'),
    },
    {
      field: 'create_time',
      minWidth: 180,
      title: t('account.create-time'),
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
      printConfig: {},
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
