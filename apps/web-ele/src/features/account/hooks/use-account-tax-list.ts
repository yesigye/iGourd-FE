import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import AccountTaxDrawerFrom from '../components/account-tax-drawer.vue';

// 定义行数据类型
interface AccountTaxInfo {
  id: string;
  tax_code: string;
  tax_name: string;
  tax_rate: number;
  tax_type: string;
  status: string;
  create_time: string;
}

export function useAccountTaxList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: AccountTaxDrawerFrom,
  });

  // 表格列配置
  const columns = [
    {
      field: 'tax_code',
      title: t('account.taxCode'),
      width: 120,
      sortable: true,
    },
    {
      field: 'tax_name',
      title: t('account.taxName'),
      width: 150,
      sortable: true,
    },
    {
      field: 'tax_rate',
      title: t('account.taxRate'),
      width: 120,
    },
    {
      field: 'tax_type',
      title: t('account.taxType'),
      width: 120,
    },
    {
      field: 'status',
      title: t('account.status'),
      width: 100,
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
    tax_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectTaxType')}}",
        options: [
          { label: '增值税', value: 'vat' },
          { label: '所得税', value: 'income' },
          { label: '营业税', value: 'business' },
          { label: '其他', value: 'other' },
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
  const gridEvents: VxeGridListeners<AccountTaxInfo> = {
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
  const gridOptions: VxeGridProps<AccountTaxInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'tax_name',
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
          return await accountApi.getTaxList({
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
