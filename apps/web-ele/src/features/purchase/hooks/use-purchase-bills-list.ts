import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import PurchaseBillsDrawerFrom from '../components/purchase-bills-drawer.vue';

// 定义行数据类型
interface PurchaseBillsInfo {
  id: string;
  purchase_id: string;
  bill_no: string;
  bill_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
}

export function usePurchaseBillsList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseBillsDrawerFrom,
  });

  // 表格列配置
  const columns = [
    {
      field: 'bill_no',
      title: "{{t('purchase.billNo')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'bill_date',
      title: "{{t('purchase.billDate')}}",
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'total_amount',
      title: "{{t('purchase.totalAmount')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: "{{t('purchase.status')}}",
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'remark',
      title: "{{t('purchase.remark')}}",
      width: 200,
    },
    {
      field: 'create_time',
      title: "{{t('purchase.createTime')}}",
      width: 160,
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
  ];

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
        placeholder: "{{t('purchase.pleaseSelectStatus')}}",
        options: [
          { label: '待付款', value: 'pending' },
          { label: '已付款', value: 'paid' },
          { label: '逾期', value: 'overdue' },
          { label: '已取消', value: 'cancelled' },
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
        placeholder: "{{t('purchase.keywords')}}",
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<PurchaseBillsInfo> = {
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
  const gridOptions: VxeGridProps<PurchaseBillsInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'bill_no',
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
          return await purchaseApi.getBillsList({
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
