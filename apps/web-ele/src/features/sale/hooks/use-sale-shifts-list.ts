import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { computed } from 'vue';

import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

import { saleApi } from '../apis';
// import SaleShiftsDrawerFrom from '../components/sale-shifts-drawer.vue';

// 定义行数据类型
interface SaleShiftsInfo {
  id: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  operator: string;
  total_sales: number;
  total_orders: number;
  status: string;
  remark: string;
  create_time: string;
}

export function useSaleShiftsList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleShiftsDrawerFrom,
  });

  // 表格列配置
  const columns = computed(() => [
    {
      field: 'shift_name',
      title: "{{t('sale.shiftName')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'start_time',
      title: "{{t('sale.startTime')}}",
      width: 120,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'end_time',
      title: "{{t('sale.endTime')}}",
      width: 120,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'operator',
      title: "{{t('sale.operator')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'total_sales',
      title: "{{t('sale.totalSales')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'total_orders',
      title: "{{t('sale.totalOrders')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: "{{t('sale.status')}}",
      width: 100,
    },
    {
      field: 'remark',
      title: "{{t('sale.remark')}}",
      width: 200,
    },
    {
      field: 'create_time',
      title: "{{t('sale.createTime')}}",
      width: 160,
      sortable: true,
      formatter: 'formatDateTime',
    },
  ]);

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
        placeholder: "{{t('sale.pleaseSelectStatus')}}",
        options: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
          { label: '已完成', value: 'completed' },
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
        startPlaceholder: t('sale.startDate'),
        endPlaceholder: t('sale.endDate'),
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
        placeholder: "{{t('sale.keywords')}}",
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<SaleShiftsInfo> = {
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
  const gridOptions: VxeGridProps<SaleShiftsInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'shift_name',
    },
    filterConfig: {
      remote: true,
    },
    columns: columns.value,
    exportConfig: {},
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      form: false,
      ajax: {
        query: async ({ page }, form = {}) => {
          return await saleApi.getShiftsList({
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
