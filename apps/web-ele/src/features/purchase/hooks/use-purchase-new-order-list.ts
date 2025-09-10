import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import PurchaseNewOrderDrawerFrom from '../components/purchase-new-order-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface PurchaseNewOrderInfo {
  id: string;
  purchase_order_no: string;
  purchase_date: string;
  vendor_name: string;
  warehouse_name: string;
  status: string;
  review_status: string;
  total_amount: number;
  receipted_percentage: number;
  creator_name: string;
  create_time: string;
}

export function usePurchaseNewOrderList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseNewOrderDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'purchase_order_no',
      title: "{{t('purchase.purchaseorderno')}}",
      width: 200,
      sortable: false,
      fixed: 'left',
      align: 'left',
    },
    {
      field: 'purchase_date',
      title: "{{t('purchase.purchaseDate')}}",
      width: 160,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vendor_name',
      title: "{{t('purchase.vendorName')}}",
      width: 180,
      sortable: false,
      align: 'left',
    },
    {
      field: 'warehouse_name',
      title: "{{t('purchase.warehouse')}}",
      width: 180,
      sortable: false,
      align: 'left',
    },
    {
      field: 'status',
      title: "{{t('purchase.status')}}",
      width: 120,
      sortable: true,
      // 状态列需要特殊处理，使用自定义渲染
      slots: { default: 'status' },
    },
    {
      field: 'review_status',
      title: "{{t('purchase.reviewStatus')}}",
      width: 85,
      sortable: false,
      fixed: 'right',
      align: 'center',
      // 审核状态列需要特殊处理，使用自定义渲染
      slots: { default: 'review_status' },
    },
    {
      field: 'total_amount',
      title: "{{t('purchase.totalAmount')}}",
      width: 150,
      align: 'center',
      sortable: false,
      // 金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'receipted_percentage',
      title: "{{t('purchase.receiptedPCT')}}",
      width: 180,
      align: 'center',
      sortable: false,
      // 百分比列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? `${(Number(cellValue) * 100).toFixed(2)}%` : '0%';
      },
    },
    {
      field: 'creator_name',
      title: "{{t('purchase.creator')}}",
      width: 180,
      sortable: false,
      align: 'left',
    },
    {
      field: 'create_time',
      title: "{{t('purchase.creationTime')}}",
      width: 180,
      sortable: false,
      align: 'left',
      formatter: 'formatDateTime',
    },
  ]);

  // 搜索表单配置 - 基于原有的 queryParams 对象
  const searchFormSchema = {keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.purchasePlaceholder')}}",
          clearable: true,
        },
      },
      review_status: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseSelectReviewStatus')}}",
          clearable: true,
          options: [
            { label: '待审核', value: 'PENDING' },
            { label: '已通过', value: 'APPROVED' },
            { label: '已拒绝', value: 'REJECTED' },
          ],
        },
      },
      start_create_time: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.startCreateTime')}}",
          type: 'date',
          clearable: true,
        },
      },
      end_create_time: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.endCreateTime')}}",
          type: 'date',
          clearable: true,
        },
      },
      purchase_date: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.purchaseDate')}}",
          type: 'date',
          clearable: true,
        },
      },
      vendor_id: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseSelectVendor')}}",
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
          placeholder: "{{t('purchase.pleaseSelectWarehouse')}}",
          filterable: true,
          clearable: true,
        },
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<PurchaseNewOrderInfo> = {
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
  const gridOptions: VxeGridProps<PurchaseNewOrderInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'purchase_order_no',
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
          return await purchaseApi.getNewOrderList({
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




