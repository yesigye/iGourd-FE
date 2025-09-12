import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { saleApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import SaleScanDrawerFrom from '../components/sale-scan-drawer.vue';

// 定义行数据类型
interface SaleScanInfo {
  id: string;
  product_id: string;
  product_name: string;
  barcode: string;
  quantity: number;
  scan_time: string;
  operator: string;
  status: string;
  remark: string;
  create_time: string;
}

export function useSaleScanList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleScanDrawerFrom,
  });

  // 表格列配置
  const columns = computed(() => [
    {
      field: 'product_name',
      title: "{{t('sale.productName')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'barcode',
      title: "{{t('sale.barcode')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'quantity',
      title: "{{t('sale.quantity')}}",
      width: 100,
      sortable: true,
    },
    {
      field: 'scan_time',
      title: "{{t('sale.scanTime')}}",
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
    product_id: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('sale.pleaseSelectProduct')}}",
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
        placeholder: "{{t('sale.pleaseSelectStatus')}}",
        options: [
          { label: '待处理', value: 'pending' },
          { label: '已处理', value: 'processed' },
          { label: '失败', value: 'failed' },
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
  const gridEvents: VxeGridListeners<SaleScanInfo> = {
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
  const gridOptions: VxeGridProps<SaleScanInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'product_name',
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
          return await saleApi.getScanList({
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
