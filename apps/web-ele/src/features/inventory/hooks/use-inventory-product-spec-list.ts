import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import InventoryProductSpecDrawerFrom from '../components/inventory-product-spec-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface InventoryProductSpecInfo {
  id: string;
  name: string;
  type: string;
  is_fixed_option: boolean;
  is_compulsory: boolean;
  creator_name: string;
  create_time: string;
}

export function useInventoryProductSpecList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: InventoryProductSpecDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'name',
      title: "{{t('inventory.name')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'type',
      title: "{{t('inventory.type')}}",
      width: 160,
      align: 'left',
      sortable: true,
      // 类型列需要特殊处理，使用自定义渲染
      slots: { default: 'type' },
    },
    {
      field: 'is_fixed_option',
      title: "{{t('inventory.selectionType')}}",
      width: 165,
      align: 'left',
      sortable: true,
      // 选择类型列需要特殊处理，使用自定义渲染
      slots: { default: 'is_fixed_option' },
    },
    {
      field: 'is_compulsory',
      title: "{{t('inventory.compulsory')}}",
      width: 180,
      align: 'left',
      sortable: true,
      // 是否必填列需要特殊处理，使用自定义渲染
      slots: { default: 'is_compulsory' },
    },
    {
      field: 'creator_name',
      title: "{{t('inventory.creator')}}",
      width: 180,
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
      name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.name')}}",
          clearable: true,
        },
      },
      type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectType')}}",
          clearable: true,
          options: [
            { label: "{{t('inventory.type_SELECT'), value: 'SELECT' },
            { label: "{{t('inventory.type_INPUT'), value: 'INPUT' },
          ],
        },
      },
      is_fixed_option: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectSelectionType')}}",
          clearable: true,
          options: [
            { label: "{{t('common.yes'), value: 'true' },
            { label: "{{t('common.no'), value: 'false' },
          ],
        },
      },
      is_compulsory: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectCompulsory')}}",
          clearable: true,
          options: [
            { label: "{{t('common.yes'), value: 'true' },
            { label: "{{t('common.no'), value: 'false' },
          ],
        },
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<InventoryProductSpecInfo> = {
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
  const gridOptions: VxeGridProps<InventoryProductSpecInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'name',
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
          return await inventoryApi.getProductSpecList({
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




