import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import InventoryTransferDrawerFrom from '../components/inventory-transfer-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface InventoryTransferInfo {
  id: string;
  transfer_no: string;
  transfer_date: string;
  from_warehouse_name: string;
  to_warehouse_name: string;
  total_quantity: number;
  total_amount: number;
  status: string;
  creator_name: string;
  create_time: string;
}

export function useInventoryTransferList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: InventoryTransferDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [
    {
      field: 'transfer_no',
      title: "{{t('inventory.transferNo')}}",
      width: 180,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'transfer_date',
      title: "{{t('inventory.transferDate')}}",
      width: 150,
      align: 'left',
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'from_warehouse_name',
      title: "{{t('inventory.fromWarehouse')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'to_warehouse_name',
      title: "{{t('inventory.toWarehouse')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'total_quantity',
      title: "{{t('inventory.totalQuantity')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 总数量列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'total_amount',
      title: "{{t('inventory.totalAmount')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 总金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'status',
      title: "{{t('inventory.status')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 状态列需要特殊处理，使用自定义渲染
      slots: { default: 'status' },
    },
    {
      field: 'creator_name',
      title: "{{t('inventory.creator')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'create_time',
      title: "{{t('inventory.creationTime')}}",
      width: 180,
      align: 'left',
      sortable: true,
      formatter: 'formatDateTime',
    },
  ]);

  // 搜索表单配置 - 基于原有的查询参数
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
        placeholder: "{{t('inventory.keywords')}}",
        clearable: true,
      },
    },
    transfer_no: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.transferNo')}}",
        clearable: true,
      },
    },
    from_warehouse_id: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.pleaseSelectFromWarehouse')}}",
        filterable: true,
        clearable: true,
      },
    },
    to_warehouse_id: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.pleaseSelectToWarehouse')}}",
        filterable: true,
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
        placeholder: "{{t('inventory.pleaseSelectStatus')}}",
        clearable: true,
        options: [
          { label: "{{t('inventory.status_PENDING')}}", value: 'PENDING' },
          { label: "{{t('inventory.status_APPROVED')}}", value: 'APPROVED' },
          { label: "{{t('inventory.status_REJECTED')}}", value: 'REJECTED' },
          { label: "{{t('inventory.status_COMPLETED')}}", value: 'COMPLETED' },
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
        placeholder: "{{t('inventory.startDate')}}",
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
        placeholder: "{{t('inventory.endDate')}}",
        type: 'date',
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<InventoryTransferInfo> = {
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
  const gridOptions: VxeGridProps<InventoryTransferInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'transfer_no',
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
          return await inventoryApi.getTransferList({
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
