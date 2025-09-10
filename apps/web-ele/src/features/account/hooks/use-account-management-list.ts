import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import AccountManagementDrawerFrom from '../components/account-management-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface AccountManagementInfo {
  id: string;
  code: string;
  account_ledger_name: string;
  account_ledger: string;
  account_type: string;
  initial_balance: number;
  current_balance: number;
  bank_address: string;
  type: string;
  creator_name: string;
  create_time: string;
}

export function useAccountManagementList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: AccountManagementDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = [


    {
      field: 'code',
      title: t('account.ledger_no'),
      width: 100,
      sortable: true,
    },
    {
      field: 'account_ledger_name',
      title: t('account.ledger_name'),
      width: 165,
      sortable: true,
    },
    {
      field: 'account_ledger',
      title: t('account.account_ledger'),
      width: 165,
      sortable: true,
    },
    {
      field: 'account_type',
      title: t('account.ledger_type'),
      width: 165,
      sortable: true,
      // 账户类型列需要特殊处理，使用自定义渲染
      slots: { default: 'account_type' },
    },
    {
      field: 'initial_balance',
      title: t('account.opening_balance'),
      width: 165,
      sortable: true,
      // 期初余额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'current_balance',
      title: t('account.closing_balance'),
      width: 165,
      sortable: true,
      // 期末余额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'bank_address',
      title: t('account.bank_address'),
      width: 200,
      sortable: true,
      // 银行地址列需要特殊处理，使用自定义渲染
      slots: { default: 'bank_address' },
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
    {
      field: 'action',
      title: t('common.action'),
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: { default: 'action' },
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
        placeholder: "{{t('account.ledger_no')}}",
        clearable: true,
      },
    },
    account_ledger_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.ledger_name')}}",
        clearable: true,
      },
    },
    account_ledger_id_list: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectAccountLedger')}}",
        multiple: true,
        filterable: true,
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
    id_list: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectAccount')}}",
        multiple: true,
        filterable: true,
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<AccountManagementInfo> = {
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
  const gridOptions: VxeGridProps<AccountManagementInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'account_ledger_name',
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
          return await accountApi.getAccountManagementList({
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
