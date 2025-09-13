import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

import { accountApi } from '../apis';
import AccountDrawerFrom from '../components/account-drawer.vue';

// 定义行数据类型
interface AccountClassificationInfo {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  status: string;
  create_time: string;
}

export function useAccountClassificationList() {
  const { t } = useI18n();

  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: AccountDrawerFrom,
  });
  // 分类选项
  const categoryOptions = [
    { label: '资产', value: 'asset' },
    { label: '负债', value: 'liability' },
    { label: '所有者权益', value: 'equity' },
    { label: '收入', value: 'revenue' },
    { label: '费用', value: 'expense' },
  ];

  // 表格列配置
  const columns = [
    {
      field: 'code',
      title: t('account.classificationCode'),
      width: 120,
      sortable: true,
    },
    {
      field: 'name',
      title: t('account.classificationName'),
      width: 200,
      sortable: true,
    },
    {
      field: 'category',
      title: t('account.category'),
      width: 120,
      filters: categoryOptions,
    },
    {
      field: 'description',
      title: t('account.description'),
      width: 250,
    },
    {
      field: 'status',
      title: t('account.status'),
      width: 100,
      filters: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
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
    category: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectCategory')}}",
        options: categoryOptions,
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
        placeholder: "{{t('account.enter_financial_classification')}}",
        clearable: true,
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
        placeholder: "{{t('account.pleaseSelectClassification')}}",
        multiple: true,
        clearable: true,
        filterable: true,
      },
    },
    create_id_list: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('account.pleaseSelectCreator')}}",
        multiple: true,
        clearable: true,
        filterable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<AccountClassificationInfo> = {
    cellClick: ({ row }) => {
      drawerApi.setData(row).open();
    },
    filterChange({ $grid, filterList }) {
      const query: Record<string, unknown> = {};
      filterList.forEach((item) => {
        query[item.field] = item.values;
      });
      $grid.commitProxy('reload', query);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<AccountClassificationInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'name',
    },
    filterConfig: {
      remote: true,
    },
    columns,
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

    // 数据
    categoryOptions,
  };
}
