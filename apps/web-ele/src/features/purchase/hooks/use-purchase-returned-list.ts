import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import PurchaseReturnedDrawerFrom from '../components/purchase-returned-drawer.vue';

// 定义行数据类型
interface PurchaseReturnedInfo {
  id: string;
  purchase_id: string;
  returned_no: string;
  returned_date: string;
  total_amount: number;
  status: string;
  reason: string;
  remark: string;
  create_time: string;
}

export function usePurchaseReturnedList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseReturnedDrawerFrom,
  });

  // 表格列配置
  const columns = [
    {
      field: 'returned_no',
      title: "{{t('purchase.returnedNo')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'returned_date',
      title: "{{t('purchase.returnedDate')}}",
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
      field: 'reason',
      title: "{{t('purchase.reason')}}",
      width: 150,
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
          { label: '待处理', value: 'pending' },
          { label: '已批准', value: 'approved' },
          { label: '已拒绝', value: 'rejected' },
          { label: '已完成', value: 'completed' },
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
  const gridEvents: VxeGridListeners<PurchaseReturnedInfo> = {
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
  const gridOptions: VxeGridProps<PurchaseReturnedInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'returned_no',
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
          return await purchaseApi.getReturnedList({
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
