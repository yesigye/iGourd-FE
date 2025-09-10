import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import ProductDrawerFrom from '../components/product-drawer.vue';

// 定义行数据类型
interface ProductInfo {
  id: string;
  product_name: string;
  product_code: string;
  major_name: string;
  selling_price: number;
  profile_photo: string;
  product_group_id: string;
  product_group_name: string;
  status: string;
  create_time: string;
}

export function useProductList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ProductDrawerFrom,
  });

  // 表格列配置
  const columns = [
    {
      field: 'product_name',
      title: "{{t('inventory.productName')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'product_code',
      title: "{{t('inventory.productCode')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'major_name',
      title: "{{t('inventory.majorName')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'selling_price',
      title: "{{t('inventory.sellingPrice')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'product_group_name',
      title: "{{t('inventory.productGroupName')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'status',
      title: "{{t('inventory.status')}}",
      width: 100,
    },
    {
      field: 'create_time',
      title: "{{t('inventory.createTime')}}",
      width: 160,
      sortable: true,
      formatter: 'formatDateTime',
    },
  ];

  // 搜索表单配置
  const searchFormSchema = {
    product_group_id: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('inventory.pleaseSelectProductGroup')}}",
        filterable: true,
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
        options: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
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
        placeholder: "{{t('inventory.keywords')}}",
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<ProductInfo> = {
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
  const gridOptions: VxeGridProps<ProductInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'product_name',
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
          return await inventoryApi.getProductList({
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
