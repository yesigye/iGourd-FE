import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import ChartOfAccountsDrawerFrom from '../components/chart-of-accounts-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface ChartOfAccountsInfo {
  id: string;
  code: string;
  name: string;
  account_type: string;
  balance_direction: string;
  opening_balance: number;
  cumulative_debit: number;
  cumulative_credit: number;
  current_debit_amount: number;
  current_credit_amount: number;
  beginning_balance: number;
  ending_balance: number;
  creator_name: string;
  create_time: string;
}

export function useChartOfAccountsList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ChartOfAccountsDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = [
    {
      field: 'code',
      title: t('account.code'),
      width: 120,
      sortable: true,
    },
    {
      field: 'name',
      title: t('account.name'),
      width: 200,
      sortable: true,
    },
    {
      field: 'account_type',
      title: t('account.account_type'),
      width: 150,
      sortable: true,
      // 账户类型列需要特殊处理，使用自定义渲染
      slots: { default: 'account_type' },
    },
    {
      field: 'balance_direction',
      title: t('account.balance_direction'),
      width: 200,
      sortable: true,
      // 余额方向列需要特殊处理，使用自定义渲染
      slots: { default: 'balance_direction' },
    },
    {
      field: 'opening_balance',
      title: t('account.opening_balance'),
      width: 180,
      sortable: true,
      // 期初余额列需要格式化
      formatter: ({ cellValue }: { cellValue: any }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'cumulative_debit',
      title: t('account.cumulative_debit'),
      width: 180,
      sortable: true,
      // 累计借方列需要格式化
      formatter: ({ cellValue }: { cellValue: any }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'cumulative_credit',
      title: t('account.cumulative_credit'),
      width: 180,
      sortable: true,
      // 累计贷方列需要格式化
      formatter: ({ cellValue }: { cellValue: any }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'current_debit_amount',
      title: t('account.current_debit_amount'),
      width: 200,
      sortable: true,
      // 本期借方列需要格式化
      formatter: ({ cellValue }: { cellValue: any }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'current_credit_amount',
      title: t('account.current_credit_amount'),
      width: 200,
      sortable: true,
      // 本期贷方列需要格式化
      formatter: ({ cellValue }: { cellValue: any }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'beginning_balance',
      title: t('account.beginning_balance'),
      width: 200,
      sortable: true,
      // 期初余额列需要格式化
      formatter: ({ cellValue }: { cellValue: any }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'ending_balance',
      title: t('account.ending_balance'),
      width: 200,
      sortable: true,
      // 期末余额列需要格式化
      formatter: ({ cellValue }: { cellValue: any }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'creator_name',
      title: t('account.creator'),
      width: 200,
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
    code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.code')}}",
        clearable: true,
      },
    },
    name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.name')}}",
        clearable: true,
      },
    },
    account_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectAccountType')}}",
        clearable: true,
        options: [
          { label: "{{t('account.type_ASSET')}}", value: 'ASSET' },
          { label: "{{t('account.type_LIABILITY')}}", value: 'LIABILITY' },
          { label: "{{t('account.type_EQUITY')}}", value: 'EQUITY' },
          { label: "{{t('account.type_REVENUE')}}", value: 'REVENUE' },
          { label: "{{t('account.type_EXPENSE')}}", value: 'EXPENSE' },
        ],
      },
    },
    balance_direction: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectBalanceDirection')}}",
        clearable: true,
        options: [
          { label: "{{t('account.balance_direction_DEBIT')}}", value: 'DEBIT' },
          {
            label: "{{t('account.balance_direction_CREDIT')}}",
            value: 'CREDIT',
          },
        ],
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<ChartOfAccountsInfo> = {
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
  const gridOptions: VxeGridProps<ChartOfAccountsInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'name',
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
          return await accountApi.getChartOfAccountsList({
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
