import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { employeeApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

// 定义角色数据类型
interface RoleInfo {
  role_id: string;
  name: string;
  remark: string;
  creator_name: string;
  create_time: string;
  type: string;
  source_type: string;
}

export function useEmployeeRoleList() {
  const { t } = useI18n();
  
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: () => import('../components/employee-role-drawer.vue'),
  });

  // 搜索表单配置
  const searchFormSchema = {
    type: 'object',
    properties: {
      keywords: {
        type: 'string',
        title: "{{t('employee.roleKeywords')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('employee.roleKeywords')}}",
          clearable: true,
        },
      },
    },
  };

  // 表格列配置
  const columns = [
    {
      field: 'name',
      title: "{{t('employee.roleName')}}",
      width: 150,
      fixed: 'left',
      showOverflow: 'tooltip',
    },
    {
      field: 'remark',
      title: "{{t('employee.roleDesc')}}",
      width: 180,
      showOverflow: 'tooltip',
    },
    {
      field: 'creator_name',
      title: "{{t('employee.creator')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'create_time',
      title: "{{t('employee.createDate')}}",
      width: 180,
    },
  ];

  // Grid 事件配置
  const gridEvents: VxeGridListeners<RoleInfo> = {
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
  const gridOptions: VxeGridProps<RoleInfo> = {
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
          return await employeeApi.getRoleList({
            page_num: page.currentPage,
            page_size: page.pageSize,
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
  const { Grid, gridApi } = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
    formOptions: { schema: searchFormSchema },
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

