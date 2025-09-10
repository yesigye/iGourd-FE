import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import InventoryPriceDrawerFrom from '../components/inventory-price-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface InventoryPriceInfo {
  id: string;
  price_no: string;
  price_date: string;
  warehouse_name: string;
  product_name: string;
  product_code: string;
  sku_name: string;
  sku_code: string;
  cost_price: number;
  selling_price: number;
  price_type: string;
  status: string;
  creator_name: string;
  create_time: string;
}

export function useInventoryPriceList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: InventoryPriceDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'price_no',
      title: "{{t('inventory.priceNo')}}",
      width: 180,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'price_date',
      title: "{{t('inventory.priceDate')}}",
      width: 150,
      align: 'left',
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'warehouse_name',
      title: "{{t('inventory.warehouseName')}}",
      width: 150,
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
      field: 'sku_name',
      title: "{{t('inventory.skuName')}}",
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'sku_code',
      title: "{{t('inventory.skuCode')}}",
      width: 150,
      align: 'left',
      sortable: true,
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
      field: 'price_type',
      title: "{{t('inventory.priceType')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 价格类型列需要特殊处理，使用自定义渲染
      slots: { default: 'price_type' },
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
      price_no: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.priceNo')}}",
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
      price_type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectPriceType')}}",
          clearable: true,
          options: [
            { label: "{{t('inventory.priceType_COST'), value: 'COST' },
            { label: "{{t('inventory.priceType_SELLING'), value: 'SELLING' },
            { label: "{{t('inventory.priceType_WHOLESALE'), value: 'WHOLESALE' },
            { label: "{{t('inventory.priceType_RETAIL'), value: 'RETAIL' },
          ],
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
            { label: "{{t('inventory.status_PENDING'), value: 'PENDING' },
            { label: "{{t('inventory.status_APPROVED'), value: 'APPROVED' },
            { label: "{{t('inventory.status_REJECTED'), value: 'REJECTED' },
            { label: "{{t('inventory.status_COMPLETED'), value: 'COMPLETED' },
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
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<InventoryPriceInfo> = {
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
  const gridOptions: VxeGridProps<InventoryPriceInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'price_no',
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
          return await inventoryApi.getPriceList({
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




