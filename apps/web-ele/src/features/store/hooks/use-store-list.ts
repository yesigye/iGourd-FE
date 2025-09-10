import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { storeApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import StoreDrawerFrom from '../components/store-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface StoreInfo {
  id: string;
  short_name: string;
  full_name: string;
  business_type: string;
  industry_name: string;
  status: string;
  create_time: string;
  owned_quantity: number;
  used_quantity: number;
  package: string;
}

export function useStoreList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: StoreDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columns 数组
  const columns = computed(() => [


    {
      field: 'short_name',
      title: "{{t('storeList.short_name')}}",
      width: 206,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'id',
      title: "{{t('storeList.id')}}",
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'full_name',
      title: "{{t('storeList.full_name')}}",
      width: 235,
      align: 'left',
      sortable: true,
    },
    {
      field: 'business_type',
      title: "{{t('storeList.business_type')}}",
      width: 235,
      align: 'left',
      sortable: true,
      // 业务类型列需要特殊处理，使用自定义渲染
      slots: { default: 'business_type' },
    },
    {
      field: 'industry_name',
      title: "{{t('storeList.industry_name')}}",
      width: 235,
      align: 'left',
      sortable: true,
    },
    {
      field: 'status',
      title: "{{t('storeList.status')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 状态列需要特殊处理，使用自定义渲染
      slots: { default: 'status' },
    },
    {
      field: 'create_time',
      title: "{{t('storeList.create_time')}}",
      width: 235,
      align: 'left',
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'owned_quantity',
      title: "{{t('storeList.owned_quantity')}}",
      width: 235,
      align: 'left',
      sortable: true,
      // 拥有数量列需要特殊处理，使用自定义渲染
      slots: { default: 'owned_quantity' },
    },
    {
      field: 'used_quantity',
      title: "{{t('storeList.used_quantity')}}",
      width: 235,
      align: 'left',
      sortable: true,
      // 使用数量列需要特殊处理，使用自定义渲染
      slots: { default: 'used_quantity' },
    },
    {
      field: 'package',
      title: "{{t('storeList.package')}}",
      width: 235,
      align: 'left',
      sortable: true,
      // 套餐列需要特殊处理，使用自定义渲染
      slots: { default: 'package' },
    },
    {
      field: 'action',
      title: "{{t('common.action')}}",
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: { default: 'action' },
    },
  ]);

  // 搜索表单配置 - 基于原有的查询参数（只有 keywords）
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
        placeholder: "{{t('storeList.searchInput')}}",
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<StoreInfo> = {
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
  const gridOptions: VxeGridProps<StoreInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'short_name',
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
          return await storeApi.getStoreList({
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





