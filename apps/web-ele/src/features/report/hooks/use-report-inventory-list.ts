import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { reportApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import ReportInventoryDrawerFrom from '../components/report-inventory-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface ReportInventoryInfo {
  id: string;
  product_major_name: string;
  product_code: string;
  product_unit_name: string;
  product_group_name: string;
  stock_quantity: number;
  warehouse_name: string;
  time_period: string;
}

export function useReportInventoryList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ReportInventoryDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'product_major_name',
      title: "{{t('reports.productName')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'product_code',
      title: "{{t('reports.productCode')}}",
      width: 160,
      align: 'left',
      sortable: true,
    },
    {
      field: 'product_unit_name',
      title: "{{t('reports.unit')}}",
      width: 160,
      align: 'left',
      sortable: true,
    },
    {
      field: 'product_group_name',
      title: "{{t('reports.productGroup')}}",
      width: 160,
      align: 'left',
      sortable: true,
    },
    {
      field: 'stock_quantity',
      title: "{{t('reports.quantity')}}",
      width: 160,
      align: 'left',
      sortable: true,
      // 库存数量列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'warehouse_name',
      title: "{{t('reports.warehouseName')}}",
      width: 180,
      align: 'left',
      sortable: true,
    },
    {
      field: 'time_period',
      title: "{{t('reports.timePeriod')}}",
      width: 150,
      align: 'center',
      fixed: 'right',
      sortable: true,
    },
  ]);

  // 搜索表单配置 - 基于原有的查询参数
  const searchFormSchema = {keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.keywords')}}",
          clearable: true,
        },
      },
      product_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.productName')}}",
          clearable: true,
        },
      },
      product_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.productCode')}}",
          clearable: true,
        },
      },
      product_group_id: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.pleaseSelectProductGroup')}}",
          filterable: true,
          clearable: true,
        },
      },
      warehouse_id: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.pleaseSelectWarehouse')}}",
          filterable: true,
          clearable: true,
        },
      },
      time_range: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.pleaseSelectTimeRange')}}",
          clearable: true,
          options: [
            { label: "{{t('reports.timeRange_DAY')}}", value: 'DAY' },
            { label: "{{t('reports.timeRange_WEEK')}}", value: 'WEEK' },
            { label: "{{t('reports.timeRange_MONTH')}}", value: 'MONTH' },
            { label: "{{t('reports.timeRange_QUARTER')}}", value: 'QUARTER' },
            { label: "{{t('reports.timeRange_YEAR')}}", value: 'YEAR' },
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
          placeholder: "{{t('reports.startDate')}}",
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
          placeholder: "{{t('reports.endDate')}}",
          type: 'date',
          clearable: true,
        },
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<ReportInventoryInfo> = {
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
  const gridOptions: VxeGridProps<ReportInventoryInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'product_major_name',
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
          return await reportApi.getInventoryReport({
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






