import type { AccountFlowsInfo } from '../../types/account';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { ref } from 'vue';

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
      field: 'flow_no',
      minWidth: 165,
      align: 'center',
      fixed: 'left',
      title: t('account.serial-number'),
    },
    {
      field: 'finance_category_name',
      minWidth: 200,
      align: 'center',
      title: t('account.finance-category-name'),
    },
    {
      field: 'revenue_amount',
      minWidth: 150,
      align: 'center',
      title: t('account.revenue-amount'),
      formatter: 'formatMoney',
    },
    {
      field: 'expenditure_amount',
      minWidth: 150,
      align: 'center',
      title: t('account.expenditure-amount'),
      formatter: 'formatMoney',
    },
    {
      field: 'business_original_amount',
      minWidth: 150,
      align: 'center',
      title: t('account.customer'),
      formatter: 'formatMoney',
    },
    {
      minWidth: 600,
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
          // formatter({ row }) {
          //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //   // @ts-ignore
          //   return row.payment_method_name;
          // },
        },
        {
          field: 'amount',
          minWidth: 200,
          title: t('account.payment-amount'),
        },
      ],
    },
    {
      field: 'source_type',
      minWidth: 150,
      title: t('account.source'),
      slots: { default: 'source_type' },
    },
    {
      field: 'trading_no',
      minWidth: 150,
      title: t('account.trading-no'),
    },
    {
      field: 'remark',
      minWidth: 250,
      title: t('account.remark'),
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
  const defaultTime = ref<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
  ]);
  // 使用 CRUD Hook
  const { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      id: 'finance_flow_plus_export',
      tabs: [
        { value: 'ALL', label: t('common.all') },
        { value: 'CREDIT', label: t('account.revenue') },
        { value: 'DEBIT', label: t('account.expenditure') },
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
        '[start_create_time,end_create_time]': {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            type: 'daterange',
            placeholder: t('common.keywords'),
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            rangeSeparator: t('common.range-separator'),
            startPlaceholder: t('common.start-date'),
            endPlaceholder: t('common.end-date'),
            defaultTime: defaultTime.value,
          },
        },
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
