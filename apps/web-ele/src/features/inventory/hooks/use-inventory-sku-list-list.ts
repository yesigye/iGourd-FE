import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import InventorySkuListDrawerFrom from '../components/inventory-sku-list-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface InventorySkuListInfo {
  id: string;
  sku_code: string;
  sku_name: string;
  product_name: string;
  product_code: string;
  sku_barcode: string;
  product_unit_name: string;
  warehouse_name: string;
  stock_quantity: number;
  cost_price: number;
  selling_price: number;
  creator_name: string;
  create_time: string;
}

export function useInventorySkuListList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: InventorySkuListDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'sku_code',
      title: "{{t('inventory.skuCode')}}",
      width: 150,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'sku_name',
      title: "{{t('inventory.skuName')}}",
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'product_name',
      title: "{{t('inventory.productName')}}",
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'product_code',
      title: "{{t('inventory.productCode')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'sku_barcode',
      title: "{{t('inventory.skuBarcode')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'product_unit_name',
      title: "{{t('inventory.productUnitName')}}",
      width: 120,
      align: 'left',
      sortable: true,
    },
    {
      field: 'warehouse_name',
      title: "{{t('inventory.warehouseName')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'stock_quantity',
      title: "{{t('inventory.stockQuantity')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 库存数量列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'cost_price',
      title: "{{t('inventory.costPrice')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 成本价列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'selling_price',
      title: "{{t('inventory.sellingPrice')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 销售价列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
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
  const searchFormSchema = {keywords: {
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
      sku_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.skuCode')}}",
          clearable: true,
        },
      },
      sku_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.skuName')}}",
          clearable: true,
        },
      },
      product_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.productName')}}",
          clearable: true,
        },
      },
      product_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.productCode')}}",
          clearable: true,
        },
      },
      sku_barcode: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.skuBarcode')}}",
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
          placeholder: "{{t('inventory.pleaseSelectWarehouse')}}",
          filterable: true,
          clearable: true,
        },
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<InventorySkuListInfo> = {
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
  const gridOptions: VxeGridProps<InventorySkuListInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'sku_name',
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
          return await inventoryApi.getSkuListList({
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




