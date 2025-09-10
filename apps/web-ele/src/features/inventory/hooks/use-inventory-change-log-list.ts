import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

// 定义库存变更日志数据类型
interface InventoryChangeLogInfo {
  id: string;
  change_type: string;
  receipt_no: string;
  product_name: string;
  product_code: string;
  warehouse_name: string;
  change_quantity: number;
  origin_quantity: number;
  final_quantity: number;
  product_unit_name: string;
  remark: string;
  creator_name: string;
  create_time: string;
}

export function useInventoryChangeLogList() {
  const { t } = useI18n();
  
  // 搜索表单配置
  const searchFormSchema = {
    type: 'object',
    properties: {
      change_type: {
        type: 'string',
        title: "{{t('inventory.changeType')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectChangeType')}}",
          clearable: true,
          options: [
            { label: "{{t('inventory.purchase')}}", value: 'PURCHASE' },
            { label: "{{t('inventory.sale')}}", value: 'SALE' },
            { label: "{{t('inventory.transfer')}}", value: 'TRANSFER' },
            { label: "{{t('inventory.adjustment')}}", value: 'ADJUSTMENT' },
          ],
        },
      },
      keywords: {
        type: 'string',
        title: "{{t('inventory.search')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseEnterKeywords')}}",
          clearable: true,
        },
      },
    },
  };

  // 表格列配置
  const columns = [
    {
      field: 'change_type',
      title: "{{t('inventory.changeType')}}",
      width: 164,
      fixed: 'left',
      slots: { default: 'change_type' },
    },
    {
      field: 'receipt_no',
      title: "{{t('inventory.receiptNumber')}}",
      width: 176,
      showOverflow: 'tooltip',
    },
    {
      field: 'product_name',
      title: "{{t('inventory.productName')}}",
      width: 240,
      showOverflow: 'tooltip',
    },
    {
      field: 'product_code',
      title: "{{t('inventory.productCode')}}",
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'warehouse_name',
      title: "{{t('inventory.warehouse')}}",
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'change_quantity',
      title: "{{t('inventory.changeQuantity')}}",
      width: 180,
      align: 'right',
      formatter: ({ row }) => {
        const changeQty = row.final_quantity - row.origin_quantity;
        return `${changeQty} ${row.product_unit_name}`;
      },
    },
    {
      field: 'origin_quantity',
      title: "{{t('inventory.preChangedQuantity')}}",
      width: 180,
      align: 'right',
      formatter: ({ row }) => {
        return `${row.origin_quantity} ${row.product_unit_name}`;
      },
    },
    {
      field: 'final_quantity',
      title: "{{t('inventory.postChangedQuantity')}}",
      width: 180,
      align: 'right',
      formatter: ({ row }) => {
        return `${row.final_quantity} ${row.product_unit_name}`;
      },
    },
    {
      field: 'remark',
      title: "{{t('inventory.remarks')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'creator_name',
      title: "{{t('inventory.creator')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'create_time',
      title: "{{t('inventory.creationTime')}}",
      width: 180,
    },
  ];

  // Grid 事件配置
  const gridEvents: VxeGridListeners<InventoryChangeLogInfo> = {
    filterChange({ $grid, filterList }) {
      const query: Record<string, unknown> = {};
      filterList.forEach((item) => {
        query[item.field] = item.values;
      });
      $grid.commitProxy('reload', query);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<InventoryChangeLogInfo> = {
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
          return await inventoryApi.getChangeLogList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            stock_type: 'STOCK',
            ...form,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: true,
      import: false,
      refresh: true,
      zoom: true,
    },
  };

  // 使用 useIgourdVxeGrid
  const { Grid, gridApi } = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
    formOptions: { schema: searchFormSchema },
  });

  return {
    // 组件
    Grid,
    gridApi,

    // 配置
    columns,
    searchFormSchema,
    gridEvents,
    gridOptions,
  };
}

