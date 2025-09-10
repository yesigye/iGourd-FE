import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { saleApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import SaleDrawerFrom from '../components/sale-drawer.vue';

// 定义行数据类型
interface SaleInfo {
  id: string;
  customer_id: string;
  customer_name: string;
  sale_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
}

export function useSaleList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleDrawerFrom,
  });

  // 表格列配置
  const columns = computed(() => [


    {
      field: 'customer_name',
      title: "{{t('sale.customerName')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'sale_date',
      title: "{{t('sale.saleDate')}}",
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'total_amount',
      title: "{{t('sale.totalAmount')}}",
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
  const searchFormSchema = {customer_id: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('sale.pleaseSelectCustomer')}}",
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
            { label: '已确认', value: 'confirmed' },
            { label: '已发货', value: 'shipped' },
            { label: '已送达', value: 'delivered' },
            { label: '已取消', value: 'cancelled' },
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
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<SaleInfo> = {
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
  const gridOptions: VxeGridProps<SaleInfo> = {
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
          return await saleApi.getPageList({
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



