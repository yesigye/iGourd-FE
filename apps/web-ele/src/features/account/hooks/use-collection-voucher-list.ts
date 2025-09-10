import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import CollectionVoucherDrawerFrom from '../components/collection-voucher-drawer.vue';

// 定义行数据类型
interface CollectionVoucherInfo {
  id: string;
  voucher_no: string;
  customer_name: string;
  voucher_date: string;
  amount: number;
  payment_method: string;
  status: string;
  remark: string;
  create_time: string;
}

export function useCollectionVoucherList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: CollectionVoucherDrawerFrom,
  });

  // 表格列配置
  const columns = [
    {
      field: 'voucher_no',
      title: t('account.voucherNo'),
      width: 200,
      fixed: 'left' as const,
      sortable: true,
    },
    {
      field: 'customer_name',
      title: t('account.customerName'),
      width: 180,
      sortable: true,
    },
    {
      field: 'voucher_date',
      title: t('account.voucherDate'),
      width: 160,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'amount',
      title: t('account.amount'),
      width: 150,
    },
    {
      field: 'payment_method',
      title: t('account.paymentMethod'),
      width: 120,
    },
    {
      field: 'status',
      title: t('account.status'),
      width: 120,
    },
    {
      field: 'remark',
      title: t('account.remark'),
      width: 200,
    },
    {
      field: 'create_time',
      title: t('account.createTime'),
      width: 160,
      sortable: true,
      formatter: 'formatDateTime',
    },
  ];

  // 搜索表单配置
  const searchFormSchema = {
    customer_id: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectCustomer')}}",
        filterable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectStatus')}}",
        options: [
          { label: '待确认', value: 'pending' },
          { label: '已确认', value: 'confirmed' },
          { label: '已取消', value: 'cancelled' },
        ],
      },
    },
    payment_method: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectPaymentMethod')}}",
        options: [
          { label: '现金', value: 'cash' },
          { label: '银行转账', value: 'bank_transfer' },
          { label: '支票', value: 'check' },
          { label: '信用卡', value: 'credit_card' },
          { label: '其他', value: 'other' },
        ],
      },
    },
    dateRange: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'DatePicker',
      'x-class': 'w-full',
      'x-component-props': {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: t('account.startDate'),
        endPlaceholder: t('account.endDate'),
      },
    },
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.keywords')}}",
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<CollectionVoucherInfo> = {
    cellClick: ({ row }) => {
      drawerApi.setData(row).open();
    },
    filterChange({ $grid, filterList }) {
      const query: Record<string, unknown> = {};
      filterList.forEach((item) => {
        query[item.field] = item.values;
      });
      $grid?.commitProxy('reload', query);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<CollectionVoucherInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'voucher_no',
    },
    filterConfig: {
      remote: true,
    },
    columns: columns,
    exportConfig: {},
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      form: false,
      ajax: {
        query: async ({ page }, form = {}) => {
          return await accountApi.getCollectionVoucherList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: '1938848394566025217',
            ...form,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      import: false,
      refresh: true,
      zoom: true,
    },
  };

  // 使用 useIgourdVxeGrid
  const [Grid, gridApi] = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
    formOptions: { schema: searchFormSchema, scope: {} },
  });

  return {
    // 组件
    Grid,
    Drawer,
    gridApi,
    drawerApi,

    // 配置
    columns,
    searchFormSchema,
    gridEvents,
    gridOptions,
  };
}
