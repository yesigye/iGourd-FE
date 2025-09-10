import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { storeApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import StoreSettingsDrawerFrom from '../components/store-settings-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface StoreSettingsInfo {
  id: string;
  setting_name: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
  is_required: boolean;
  is_active: boolean;
  creator_name: string;
  create_time: string;
}

export function useStoreSettingsList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: StoreSettingsDrawerFrom,
  });

  // 表格列配置 - 基于原有的表格数据结构
  const columns = computed(() => [


    {
      field: 'setting_name',
      title: "{{t('storeSettings.settingName')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'setting_key',
      title: "{{t('storeSettings.settingKey')}}",
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'setting_value',
      title: "{{t('storeSettings.settingValue')}}",
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'setting_type',
      title: "{{t('storeSettings.settingType')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 设置类型列需要特殊处理，使用自定义渲染
      slots: { default: 'setting_type' },
    },
    {
      field: 'description',
      title: "{{t('storeSettings.description')}}",
      width: 250,
      align: 'left',
      sortable: true,
    },
    {
      field: 'is_required',
      title: "{{t('storeSettings.isRequired')}}",
      width: 100,
      align: 'left',
      sortable: true,
      // 是否必填列需要特殊处理，使用自定义渲染
      slots: { default: 'is_required' },
    },
    {
      field: 'is_active',
      title: "{{t('storeSettings.isActive')}}",
      width: 100,
      align: 'left',
      sortable: true,
      // 是否启用列需要特殊处理，使用自定义渲染
      slots: { default: 'is_active' },
    },
    {
      field: 'creator_name',
      title: "{{t('storeSettings.creator')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'create_time',
      title: "{{t('storeSettings.createTime')}}",
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
          placeholder: "{{t('storeSettings.keywords')}}",
          clearable: true,
        },
      },
      setting_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeSettings.settingName')}}",
          clearable: true,
        },
      },
      setting_key: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeSettings.settingKey')}}",
          clearable: true,
        },
      },
      setting_type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeSettings.pleaseSelectSettingType')}}",
          clearable: true,
          options: [
            { label: "{{t('storeSettings.settingType_STRING'), value: 'STRING' },
            { label: "{{t('storeSettings.settingType_NUMBER'), value: 'NUMBER' },
            { label: "{{t('storeSettings.settingType_BOOLEAN'), value: 'BOOLEAN' },
            { label: "{{t('storeSettings.settingType_JSON'), value: 'JSON' },
            { label: "{{t('storeSettings.settingType_ARRAY'), value: 'ARRAY' },
          ],
        },
      },
      is_required: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeSettings.pleaseSelectIsRequired')}}",
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
          placeholder: "{{t('storeSettings.pleaseSelectIsActive')}}",
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
  const gridEvents: VxeGridListeners<StoreSettingsInfo> = {
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
  const gridOptions: VxeGridProps<StoreSettingsInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'setting_name',
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
          return await storeApi.getStoreSettingsList({
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





