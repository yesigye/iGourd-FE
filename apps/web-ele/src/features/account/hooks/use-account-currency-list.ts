import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import AccountCurrencyDrawerFrom from '../components/account-currency-drawer.vue';

// 定义行数据类型
interface AccountCurrencyInfo {
  id: string;
  currency_code: string;
  currency_name: string;
  symbol: string;
  exchange_rate: number;
  is_base_currency: boolean;
  status: string;
  create_time: string;
}

export function useAccountCurrencyList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: AccountCurrencyDrawerFrom,
  });

  // 表格列配置
  const columns = [


    {
      field: 'currency_code',
      title: t('account.currencyCode'),
      width: 120,
      sortable: true,
    },
    {
      field: 'currency_name',
      title: t('account.currencyName'),
      width: 150,
      sortable: true,
    },
    {
      field: 'symbol',
      title: t('account.symbol'),
      width: 100,
    },
    {
      field: 'exchange_rate',
      title: t('account.exchangeRate'),
      width: 120,
    },
    {
      field: 'is_base_currency',
      title: t('account.isBaseCurrency'),
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
  const searchFormSchema = {currency_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectCurrencyCode')}}",
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
            { label: 'JPY', value: 'JPY' },
            { label: 'CNY', value: 'CNY' },
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
    },

  // Grid 事件配置
  const gridEvents: VxeGridListeners<AccountCurrencyInfo> = {
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
  const gridOptions: VxeGridProps<AccountCurrencyInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'currency_name',
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
          return await accountApi.getCurrencyList({
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
    formOptions: { schema: searchFormSchema, scope: {} }
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



