import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import AccountDrawerFrom from '../components/account-drawer.vue';

// 定义行数据类型
interface AccountInfo {
  id: string;
  account_name: string;
  account_type: string;
  balance: number;
  status: string;
  remark: string;
  create_time: string;
}

export function useAccountList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: AccountDrawerFrom,
  });

  // 表格列配置
  const columns = [
    {
      field: 'account_name',
      title: t('account.accountName'),
      width: 150,
      sortable: true,
    },
    {
      field: 'account_type',
      title: t('account.accountType'),
      width: 120,
      sortable: true,
    },
    {
      field: 'balance',
      title: t('account.balance'),
      width: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: t('account.status'),
      width: 100,
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
        options: [
          { label: '现金账户', value: 'cash' },
          { label: '银行账户', value: 'bank' },
          { label: '支付宝账户', value: 'alipay' },
          { label: '微信账户', value: 'wechat' },
        ],
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
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
        ],
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
  const gridEvents: VxeGridListeners<AccountInfo> = {
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
  const gridOptions: VxeGridProps<AccountInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'account_name',
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
          return await accountApi.getPageList({
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
