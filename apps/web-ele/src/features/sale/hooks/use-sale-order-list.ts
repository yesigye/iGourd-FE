import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { saleApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import SaleOrderDrawerFrom from '../components/sale-order-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface SaleOrderInfo {
  id: string;
  order_no: string;
  customer_name: string;
  order_create_time: string;
  total_quantity: number;
  total_amount: number;
  round_down_amount: number;
  total_paid_amount: number;
  status: string;
  creator_name: string;
  create_time: string;
}

export function useSaleOrderList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleOrderDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'order_no',
      title: "{{t('sales.saleOrderNo')}}",
      width: 165,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'customer_name',
      title: "{{t('sales.customer')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'order_create_time',
      title: "{{t('sales.orderDate')}}",
      width: 180,
      align: 'left',
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'total_quantity',
      title: "{{t('sales.totalQuantity')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'total_amount',
      title: "{{t('sales.totalPrice')}}",
      width: 180,
      align: 'left',
      sortable: true,
      // 金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'round_down_amount',
      title: "{{t('sales.roundDownAmount')}}",
      width: 180,
      align: 'left',
      sortable: true,
      // 金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'total_paid_amount',
      title: "{{t('sales.totalPaidAmount')}}",
      width: 180,
      align: 'left',
      sortable: true,
      // 金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'status',
      title: "{{t('sales.status')}}",
      width: 130,
      align: 'center',
      fixed: 'right',
      sortable: true,
      // 状态列需要特殊处理，使用自定义渲染
      slots: { default: 'status' },
    },
    {
      field: 'creator_name',
      title: "{{t('sales.creator')}}",
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'create_time',
      title: "{{t('sales.creationTime')}}",
      width: 170,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'action',
      title: "{{t('common.action')}}",
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: { default: 'action' },
    },
  ]);

  // 搜索表单配置 - 基于原有的查询参数（只有 keywords 和 status）
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('sales.searchOrderPlaceholder')}}",
        clearable: true,
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
        placeholder: "{{t('common.selectStatus')}}",
        clearable: true,
        options: [
          { label: "{{t('common.status.CANCEL'), value: 'CANCEL' },
          { label: "{{t('common.status.paying'), value: 'PENDING' },
          { label: "{{t('common.status.PAID'), value: 'PAID' },
        ],
      },
    },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<SaleOrderInfo> = {
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
  const gridOptions: VxeGridProps<SaleOrderInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'order_no',
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
          return await saleApi.getOrderList({
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
