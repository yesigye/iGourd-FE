import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import InventoryWarehouseDrawerFrom from '../components/inventory-warehouse-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface WarehouseInfo {
  id: string;
  name: string;
  country_name: string;
  address: string;
  is_default: number;
  is_sale: number;
  creator_name: string;
  create_time: string;
}

export function useInventoryWarehouseList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: InventoryWarehouseDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = [
    {
      field: 'name',
      title: "{{t('inventory.warehouseName')}}",
      width: 210,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'country_name',
      title: "{{t('inventory.country')}}",
      width: 210,
      align: 'left',
      sortable: true,
    },
    {
      field: 'address',
      title: "{{t('inventory.warehouseAddress')}}",
      width: 210,
      align: 'left',
      sortable: true,
    },
    {
      field: 'is_default',
      title: "{{t('inventory.defaultWarehouse')}}",
      width: 200,
      align: 'left',
      sortable: true,
      // 默认仓库列需要特殊处理，使用自定义渲染
      slots: { default: 'is_default' },
    },
    {
      field: 'is_sale',
      title: "{{t('inventory.defaultSale')}}",
      width: 100,
      align: 'left',
      fixed: 'right',
      sortable: true,
      // 默认销售列需要特殊处理，使用自定义渲染
      slots: { default: 'is_sale' },
    },
    {
      field: 'creator_name',
      title: "{{t('inventory.creator')}}",
      width: 200,
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
  ];

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
    name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.warehouseName')}}",
        clearable: true,
      },
    },
    country_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.country')}}",
        clearable: true,
      },
    },
    address: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.warehouseAddress')}}",
        clearable: true,
      },
    },
    is_default: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.pleaseSelectDefaultWarehouse')}}",
        clearable: true,
        options: [
          { label: "{{t('common.yes')}}", value: '1' },
          { label: "{{t('common.no')}}", value: '0' },
        ],
      },
    },
    is_sale: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.pleaseSelectDefaultSale')}}",
        clearable: true,
        options: [
          { label: "{{t('common.yes')}}", value: '1' },
          { label: "{{t('common.no')}}", value: '0' },
        ],
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<WarehouseInfo> = {
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
  const gridOptions: VxeGridProps<WarehouseInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'name',
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
          return await inventoryApi.getWarehouseList({
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
