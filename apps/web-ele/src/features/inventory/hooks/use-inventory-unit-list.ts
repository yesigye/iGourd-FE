import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import InventoryUnitDrawerFrom from '../components/inventory-unit-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface InventoryUnitInfo {
  id: string;
  unit_name: string;
  unit_code: string;
  unit_type: string;
  conversion_rate: number;
  is_base_unit: boolean;
  is_active: boolean;
  creator_name: string;
  create_time: string;
}

export function useInventoryUnitList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: InventoryUnitDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'unit_name',
      title: "{{t('inventory.unitName')}}",
      width: 150,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'unit_code',
      title: "{{t('inventory.unitCode')}}",
      width: 120,
      align: 'left',
      sortable: true,
    },
    {
      field: 'unit_type',
      title: "{{t('inventory.unitType')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 单位类型列需要特殊处理，使用自定义渲染
      slots: { default: 'unit_type' },
    },
    {
      field: 'conversion_rate',
      title: "{{t('inventory.conversionRate')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 转换率列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'is_base_unit',
      title: "{{t('inventory.isBaseUnit')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 是否基础单位列需要特殊处理，使用自定义渲染
      slots: { default: 'is_base_unit' },
    },
    {
      field: 'is_active',
      title: "{{t('inventory.isActive')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 是否启用列需要特殊处理，使用自定义渲染
      slots: { default: 'is_active' },
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
      unit_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.unitName')}}",
          clearable: true,
        },
      },
      unit_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.unitCode')}}",
          clearable: true,
        },
      },
      unit_type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectUnitType')}}",
          clearable: true,
          options: [
            { label: "{{t('inventory.unitType_WEIGHT'), value: 'WEIGHT' },
            { label: "{{t('inventory.unitType_VOLUME'), value: 'VOLUME' },
            { label: "{{t('inventory.unitType_LENGTH'), value: 'LENGTH' },
            { label: "{{t('inventory.unitType_AREA'), value: 'AREA' },
            { label: "{{t('inventory.unitType_COUNT'), value: 'COUNT' },
          ],
        },
      },
      is_base_unit: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectIsBaseUnit')}}",
          clearable: true,
          options: [
            { label: "{{t('common.yes'), value: 'true' },
            { label: "{{t('common.no'), value: 'false' },
          ],
        },
      },
      is_active: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectIsActive')}}",
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
  const gridEvents: VxeGridListeners<InventoryUnitInfo> = {
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
  const gridOptions: VxeGridProps<InventoryUnitInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'unit_name',
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
          return await inventoryApi.getUnitList({
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




