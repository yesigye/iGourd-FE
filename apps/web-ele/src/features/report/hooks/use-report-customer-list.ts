import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { reportApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import ReportCustomerDrawerFrom from '../components/report-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface ReportCustomerInfo {
  id: string;
  customer_name: string;
  customer_code: string;
  customer_type: string;
  total_orders: number;
  total_amount: number;
  last_order_date: string;
  customer_level: string;
  time_period: string;
}

export function useReportCustomerList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ReportCustomerDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'customer_name',
      title: "{{t('reports.customerName')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'customer_code',
      title: "{{t('reports.customerCode')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'customer_type',
      title: "{{t('reports.customerType')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 客户类型列需要特殊处理，使用自定义渲染
      slots: { default: 'customer_type' },
    },
    {
      field: 'total_orders',
      title: "{{t('reports.totalOrders')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 总订单数列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'total_amount',
      title: "{{t('reports.totalAmount')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 总金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'last_order_date',
      title: "{{t('reports.lastOrderDate')}}",
      width: 150,
      align: 'left',
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'customer_level',
      title: "{{t('reports.customerLevel')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 客户等级列需要特殊处理，使用自定义渲染
      slots: { default: 'customer_level' },
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
      customer_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.customerName')}}",
          clearable: true,
        },
      },
      customer_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.customerCode')}}",
          clearable: true,
        },
      },
      customer_type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.pleaseSelectCustomerType')}}",
          clearable: true,
          options: [
            { label: "{{t('reports.customerType_INDIVIDUAL')}}", value: 'INDIVIDUAL' },
            { label: "{{t('reports.customerType_COMPANY')}}", value: 'COMPANY' },
            { label: "{{t('reports.customerType_WHOLESALE')}}", value: 'WHOLESALE' },
            { label: "{{t('reports.customerType_RETAIL')}}", value: 'RETAIL' },
          ],
        },
      },
      customer_level: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.pleaseSelectCustomerLevel')}}",
          clearable: true,
          options: [
            { label: "{{t('reports.customerLevel_BRONZE'), value: 'BRONZE' },
            { label: "{{t('reports.customerLevel_SILVER'), value: 'SILVER' },
            { label: "{{t('reports.customerLevel_GOLD'), value: 'GOLD' },
            { label: "{{t('reports.customerLevel_PLATINUM'), value: 'PLATINUM' },
            { label: "{{t('reports.customerLevel_DIAMOND'), value: 'DIAMOND' },
          ],
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
    }

  // Grid 事件配置
  const gridEvents: VxeGridListeners<ReportCustomerInfo> = {
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
  const gridOptions: VxeGridProps<ReportCustomerInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'customer_name',
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
          return await reportApi.getCustomerReport({
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






