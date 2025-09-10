import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { reportApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import ReportFinancialDrawerFrom from '../components/report-financial-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface ReportFinancialInfo {
  id: string;
  account_name: string;
  account_code: string;
  account_type: string;
  opening_balance: number;
  closing_balance: number;
  total_debit: number;
  total_credit: number;
  net_balance: number;
  time_period: string;
}

export function useReportFinancialList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ReportFinancialDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'account_name',
      title: "{{t('reports.accountName')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'account_code',
      title: "{{t('reports.accountCode')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'account_type',
      title: "{{t('reports.accountType')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 账户类型列需要特殊处理，使用自定义渲染
      slots: { default: 'account_type' },
    },
    {
      field: 'opening_balance',
      title: "{{t('reports.openingBalance')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 期初余额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'closing_balance',
      title: "{{t('reports.closingBalance')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 期末余额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'total_debit',
      title: "{{t('reports.totalDebit')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 总借方列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'total_credit',
      title: "{{t('reports.totalCredit')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 总贷方列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'net_balance',
      title: "{{t('reports.netBalance')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 净余额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
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
      account_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.accountName')}}",
          clearable: true,
        },
      },
      account_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('reports.accountCode')}}",
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
          placeholder: "{{t('reports.pleaseSelectAccountType')}}",
          clearable: true,
          options: [
            { label: "{{t('reports.accountType_ASSET'), value: 'ASSET' },
            { label: "{{t('reports.accountType_LIABILITY'), value: 'LIABILITY' },
            { label: "{{t('reports.accountType_EQUITY'), value: 'EQUITY' },
            { label: "{{t('reports.accountType_REVENUE'), value: 'REVENUE' },
            { label: "{{t('reports.accountType_EXPENSE'), value: 'EXPENSE' },
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
            { label: "{{t('reports.timeRange_DAY'), value: 'DAY' },
            { label: "{{t('reports.timeRange_WEEK'), value: 'WEEK' },
            { label: "{{t('reports.timeRange_MONTH'), value: 'MONTH' },
            { label: "{{t('reports.timeRange_QUARTER'), value: 'QUARTER' },
            { label: "{{t('reports.timeRange_YEAR'), value: 'YEAR' },
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
  const gridEvents: VxeGridListeners<ReportFinancialInfo> = {
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
  const gridOptions: VxeGridProps<ReportFinancialInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'account_name',
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
          return await reportApi.getFinancialReport({
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






