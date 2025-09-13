import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

import { storeApi } from '../apis';
// import StoreManagementDrawerFrom from '../components/store-management-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface StoreManagementInfo {
  id: string;
  store_name: string;
  store_code: string;
  store_type: string;
  manager_name: string;
  contact_phone: string;
  address: string;
  status: string;
  create_time: string;
}

export function useStoreManagementList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: StoreManagementDrawerFrom,
  });

  // 表格列配置 - 基于原有的表格数据结构
  const columns = [
    {
      field: 'store_name',
      title: "{{t('storeManagement.storeName')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'store_code',
      title: "{{t('storeManagement.storeCode')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'store_type',
      title: "{{t('storeManagement.storeType')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 门店类型列需要特殊处理，使用自定义渲染
      slots: { default: 'store_type' },
    },
    {
      field: 'manager_name',
      title: "{{t('storeManagement.managerName')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'contact_phone',
      title: "{{t('storeManagement.contactPhone')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'address',
      title: "{{t('storeManagement.address')}}",
      width: 250,
      align: 'left',
      sortable: true,
    },
    {
      field: 'status',
      title: "{{t('storeManagement.status')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 状态列需要特殊处理，使用自定义渲染
      slots: { default: 'status' },
    },
    {
      field: 'create_time',
      title: "{{t('storeManagement.createTime')}}",
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
        placeholder: "{{t('storeManagement.keywords')}}",
        clearable: true,
      },
    },
    store_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('storeManagement.storeName')}}",
        clearable: true,
      },
    },
    store_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('storeManagement.storeCode')}}",
        clearable: true,
      },
    },
    store_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('storeManagement.pleaseSelectStoreType')}}",
        clearable: true,
        options: [
          {
            label: "{{t('storeManagement.storeType_FLAGSHIP')}}",
            value: 'FLAGSHIP',
          },
          {
            label: "{{t('storeManagement.storeType_STANDARD')}}",
            value: 'STANDARD',
          },
          { label: "{{t('storeManagement.storeType_BASIC')}}", value: 'BASIC' },
          { label: "{{t('storeManagement.storeType_MINI')}}", value: 'MINI' },
        ],
      },
    },
    manager_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('storeManagement.managerName')}}",
        clearable: true,
      },
    },
    contact_phone: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('storeManagement.contactPhone')}}",
        clearable: true,
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
        placeholder: "{{t('storeManagement.pleaseSelectStatus')}}",
        clearable: true,
        options: [
          { label: "{{t('storeManagement.status_ACTIVE')}}", value: 'ACTIVE' },
          {
            label: "{{t('storeManagement.status_INACTIVE')}}",
            value: 'INACTIVE',
          },
          {
            label: "{{t('storeManagement.status_MAINTENANCE')}}",
            value: 'MAINTENANCE',
          },
          { label: "{{t('storeManagement.status_CLOSED')}}", value: 'CLOSED' },
        ],
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<StoreManagementInfo> = {
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
  const gridOptions: VxeGridProps<StoreManagementInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'store_name',
    },
    filterConfig: {
      remote: true,
    },
    columns,
    exportConfig: {},
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      form: false,
      ajax: {
        query: async ({ page }, form = {}) => {
          return await storeApi.getStoreManagementList({
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
