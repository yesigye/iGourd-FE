import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

// 定义价格变更日志数据类型
interface InventoryPriceLogInfo {
  id: string;
  price_type: string;
  product_name: string;
  product_code: string;
  origin_price: number;
  final_price: number;
  change_amount: number;
  remark: string;
  creator_name: string;
  create_time: string;
}

export function useInventoryPriceLogList() {
  const { t } = useI18n();
  
  // 搜索表单配置
  const searchFormSchema = {
    type: 'object',
    properties: {
      price_type: {
        type: 'string',
        title: "{{t('inventory.changeType')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('inventory.selectPriceType')}}",
          clearable: true,
          options: [
            { label: "{{t('inventory.cost_price')}}", value: 'COST_PRICE' },
            { label: "{{t('inventory.selling_price')}}", value: 'SELLING_PRICE' },
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
          placeholder: "{{t('inventory.enterPriceKeywords')}}",
          clearable: true,
        },
      },
    },
  };

  // 表格列配置
  const columns = [
    {
      field: 'price_type',
      title: "{{t('inventory.changeType')}}",
      width: 160,
      fixed: 'left',
      slots: { default: 'price_type' },
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
      width: 160,
      showOverflow: 'tooltip',
    },
    {
      field: 'origin_price',
      title: "{{t('inventory.preChangePrice')}}",
      width: 180,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toFixed(2) : '0.00';
      },
    },
    {
      field: 'final_price',
      title: "{{t('inventory.postChangePrice')}}",
      width: 180,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toFixed(2) : '0.00';
      },
    },
    {
      field: 'change_amount',
      title: "{{t('inventory.changeAmount')}}",
      width: 180,
      align: 'right',
      slots: { default: 'change_amount' },
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
  const gridEvents: VxeGridListeners<InventoryPriceLogInfo> = {
    filterChange({ $grid, filterList }) {
      const query: Record<string, unknown> = {};
      filterList.forEach((item) => {
        query[item.field] = item.values;
      });
      $grid.commitProxy('reload', query);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<InventoryPriceLogInfo> = {
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
          return await inventoryApi.getPriceLogList({
            page_num: page.currentPage,
            page_size: page.pageSize,
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

