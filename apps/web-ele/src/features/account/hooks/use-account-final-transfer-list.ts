import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import AccountFinalTransferDrawerFrom from '../components/account-final-transfer-drawer.vue';

// 定义行数据类型
interface AccountFinalTransferInfo {
  id: string;
  transfer_no: string;
  from_account: string;
  to_account: string;
  amount: number;
  transfer_date: string;
  status: string;
  remark: string;
  create_time: string;
}

export function useAccountFinalTransferList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: AccountFinalTransferDrawerFrom,
  });

  // 表格列配置
  const columns = [
    {
      field: 'transfer_no',
      title: t('account.transferNo'),
      width: 200,
      sortable: true,
    },
    {
      field: 'from_account',
      title: t('account.fromAccount'),
      width: 150,
      sortable: true,
    },
    {
      field: 'to_account',
      title: t('account.toAccount'),
      width: 150,
      sortable: true,
    },
    {
      field: 'amount',
      title: t('account.amount'),
      width: 120,
    },
    {
      field: 'transfer_date',
      title: t('account.transferDate'),
      width: 160,
      sortable: true,
      formatter: 'formatDate',
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
          { label: '待处理', value: 'pending' },
          { label: '已完成', value: 'completed' },
          { label: '已取消', value: 'cancelled' },
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
  const gridEvents: VxeGridListeners<AccountFinalTransferInfo> = {
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
  const gridOptions: VxeGridProps<AccountFinalTransferInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'transfer_no',
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
          return await accountApi.getFinalTransferList({
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
