import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { computed } from 'vue';

import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

import { employeeApi } from '../apis';
import EmployeeDrawerFrom from '../components/employee-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface EmployeeInfo {
  id: string;
  user_id: string;
  login_ids: Array<{
    country_area_code: string;
    login_account: string;
  }>;
  name: string;
  roles: Array<{
    name: string;
  }>;
  creator_name: string;
  create_time: string;
  status: string;
  switch: string;
}

export function useEmployeeList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: EmployeeDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columns 数组
  const columns = computed(() => [
    {
      field: 'login_ids',
      title: "{{t('employee.employee_account')}}",
      width: 206,
      sortable: true,
      // 登录账号列需要特殊处理，使用自定义渲染
      slots: { default: 'login_ids' },
    },
    {
      field: 'name',
      title: "{{t('employee.employee_name')}}",
      width: 206,
      sortable: true,
    },
    {
      field: 'roles',
      title: "{{t('employee.employee_role')}}",
      width: 206,
      sortable: true,
      // 角色列需要特殊处理，使用自定义渲染
      slots: { default: 'roles' },
    },
    {
      field: 'creator_name',
      title: "{{t('employee.creator')}}",
      width: 200,
      sortable: true,
    },
    {
      field: 'create_time',
      title: "{{t('employee.employee_create_time')}}",
      width: 180,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'switch',
      title: "{{t('employee.employee_status')}}",
      width: 85,
      fixed: 'right',
      align: 'center',
      sortable: true,
      // 状态开关列需要特殊处理，使用自定义渲染
      slots: { default: 'switch' },
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

  // 搜索表单配置 - 基于原有的查询参数
  const searchFormSchema = {
    keyword: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('employee.keyword')}}",
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
        placeholder: "{{t('employee.employee_name')}}",
        clearable: true,
      },
    },
    login_account: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('employee.employee_account')}}",
        clearable: true,
      },
    },
    role_id: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('employee.pleaseSelectRole')}}",
        filterable: true,
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
        placeholder: "{{t('employee.pleaseSelectStatus')}}",
        clearable: true,
        options: [
          { label: "{{t('employee.status_ACTIVE')}}", value: 'ACTIVE' },
          { label: "{{t('employee.status_FROZEN')}}", value: 'FROZEN' },
        ],
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<EmployeeInfo> = {
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
  const gridOptions: VxeGridProps<EmployeeInfo> = {
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
          return await employeeApi.getEmployeeList({
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
