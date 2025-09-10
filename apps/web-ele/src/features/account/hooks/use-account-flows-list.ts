import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import AccountFlowsDrawerFrom from '../components/account-flows-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface AccountFlowsInfo {
  id: string;
  transaction_date: string;
  transaction_no: string;
  account_name: string;
  account_code: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  reference_type: string;
  reference_id: string;
  creator_name: string;
  create_time: string;
}

export function useAccountFlowsList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: AccountFlowsDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = [
    {
      field: 'transaction_date',
      title: t('account.transaction_date'),
      width: 150,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'transaction_no',
      title: t('account.transaction_no'),
      width: 180,
      sortable: true,
    },
    {
      field: 'account_name',
      title: t('account.account_name'),
      width: 200,
      sortable: true,
    },
    {
      field: 'account_code',
      title: t('account.account_code'),
      width: 120,
      sortable: true,
    },
    {
      field: 'description',
      title: t('account.description'),
      width: 250,
      sortable: true,
    },
    {
      field: 'debit_amount',
      title: t('account.debit_amount'),
      width: 150,
      sortable: true,
      // 借方金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'credit_amount',
      title: t('account.credit_amount'),
      width: 150,
      sortable: true,
      // 贷方金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'balance',
      title: t('account.balance'),
      width: 150,
      sortable: true,
      // 余额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'reference_type',
      title: t('account.reference_type'),
      width: 150,
      sortable: true,
      // 参考类型列需要特殊处理，使用自定义渲染
      slots: { default: 'reference_type' },
    },
    {
      field: 'reference_id',
      title: t('account.reference_id'),
      width: 150,
      sortable: true,
    },
    {
      field: 'creator_name',
      title: t('account.creator'),
      width: 150,
      sortable: true,
    },
    {
      field: 'create_time',
      title: t('account.creationTime'),
      width: 180,
      sortable: true,
      formatter: 'formatDateTime',
    },
  ];

  // 搜索表单配置 - 基于原有的查询参数
  const searchFormSchema = {
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
        clearable: true,
      },
    },
    transaction_no: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.transaction_no')}}",
        clearable: true,
      },
    },
    account_id: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectAccount')}}",
        filterable: true,
        clearable: true,
      },
    },
    reference_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectReferenceType')}}",
        clearable: true,
        options: [
          { label: "{{t('account.reference_type_SALE')}}", value: 'SALE' },
          {
            label: "{{t('account.reference_type_PURCHASE')}}",
            value: 'PURCHASE',
          },
          {
            label: "{{t('account.reference_type_INVENTORY')}}",
            value: 'INVENTORY',
          },
          {
            label: "{{t('account.reference_type_PAYMENT')}}",
            value: 'PAYMENT',
          },
          {
            label: "{{t('account.reference_type_RECEIPT')}}",
            value: 'RECEIPT',
          },
        ],
      },
    },
    start_date: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'DatePicker',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.startDate')}}",
        type: 'date',
        clearable: true,
      },
    },
    end_date: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'DatePicker',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.endDate')}}",
        type: 'date',
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<AccountFlowsInfo> = {
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
  const gridOptions: VxeGridProps<AccountFlowsInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'transaction_no',
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
          return await accountApi.getAccountFlowsList({
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
