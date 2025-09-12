import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import PurchaseNewOrderHistoryDrawerFrom from '../components/purchase-new-order-history-drawer.vue';

// 定义行数据类型
interface PurchaseNewOrderHistoryInfo {
  id: string;
  order_id: string;
  order_no: string;
  action: string;
  action_date: string;
  operator: string;
  remark: string;
  create_time: string;
}

export function usePurchaseNewOrderHistoryList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseNewOrderHistoryDrawerFrom,
  });

  // 表格列配置
  const columns = computed(() => [
    {
      field: 'order_no',
      title: "{{t('purchase.orderNo')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'action',
      title: "{{t('purchase.action')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'action_date',
      title: "{{t('purchase.actionDate')}}",
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'operator',
      title: "{{t('purchase.operator')}}",
      width: 120,
      sortable: true,
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
  ]);

  // 搜索表单配置
  const searchFormSchema = {
    action: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('purchase.pleaseSelectAction')}}",
        options: [
          { label: '创建', value: 'created' },
          { label: '更新', value: 'updated' },
          { label: '确认', value: 'confirmed' },
          { label: '发货', value: 'shipped' },
          { label: '送达', value: 'delivered' },
          { label: '取消', value: 'cancelled' },
          { label: '完成', value: 'completed' },
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
  const gridEvents: VxeGridListeners<PurchaseNewOrderHistoryInfo> = {
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
  const gridOptions: VxeGridProps<PurchaseNewOrderHistoryInfo> = {
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
          return await purchaseApi.getNewOrderHistoryList({
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
