import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { storeApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import StoreStaffDrawerFrom from '../components/store-staff-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface StoreStaffInfo {
  id: string;
  staff_name: string;
  staff_code: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  status: string;
  hire_date: string;
  creator_name: string;
  create_time: string;
}

export function useStoreStaffList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: StoreStaffDrawerFrom,
  });

  // 表格列配置 - 基于原有的表格数据结构
  const columns = computed(() => [


    {
      field: 'staff_name',
      title: "{{t('storeStaff.staffName')}}",
      width: 150,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'staff_code',
      title: "{{t('storeStaff.staffCode')}}",
      width: 120,
      align: 'left',
      sortable: true,
    },
    {
      field: 'position',
      title: "{{t('storeStaff.position')}}",
      width: 120,
      align: 'left',
      sortable: true,
    },
    {
      field: 'department',
      title: "{{t('storeStaff.department')}}",
      width: 120,
      align: 'left',
      sortable: true,
    },
    {
      field: 'phone',
      title: "{{t('storeStaff.phone')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'email',
      title: "{{t('storeStaff.email')}}",
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'status',
      title: "{{t('storeStaff.status')}}",
      width: 100,
      align: 'left',
      sortable: true,
      // 状态列需要特殊处理，使用自定义渲染
      slots: { default: 'status' },
    },
    {
      field: 'hire_date',
      title: "{{t('storeStaff.hireDate')}}",
      width: 120,
      align: 'left',
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'creator_name',
      title: "{{t('storeStaff.creator')}}",
      width: 120,
      align: 'left',
      sortable: true,
    },
    {
      field: 'create_time',
      title: "{{t('storeStaff.createTime')}}",
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
          placeholder: "{{t('storeStaff.keywords')}}",
          clearable: true,
        },
      },
      staff_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeStaff.staffName')}}",
          clearable: true,
        },
      },
      staff_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeStaff.staffCode')}}",
          clearable: true,
        },
      },
      position: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeStaff.pleaseSelectPosition')}}",
          clearable: true,
          options: [
            { label: "{{t('storeStaff.position_MANAGER'), value: 'MANAGER' },
            { label: "{{t('storeStaff.position_SUPERVISOR'), value: 'SUPERVISOR' },
            { label: "{{t('storeStaff.position_CASHIER'), value: 'CASHIER' },
            { label: "{{t('storeStaff.position_SALES'), value: 'SALES' },
            { label: "{{t('storeStaff.position_STOCK'), value: 'STOCK' },
            { label: "{{t('storeStaff.position_CLEANER'), value: 'CLEANER' },
          ],
        },
      },
      department: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeStaff.pleaseSelectDepartment')}}",
          clearable: true,
          options: [
            { label: "{{t('storeStaff.department_MANAGEMENT'), value: 'MANAGEMENT' },
            { label: "{{t('storeStaff.department_SALES'), value: 'SALES' },
            { label: "{{t('storeStaff.department_INVENTORY'), value: 'INVENTORY' },
            { label: "{{t('storeStaff.department_FINANCE'), value: 'FINANCE' },
            { label: "{{t('storeStaff.department_HR'), value: 'HR' },
            { label: "{{t('storeStaff.department_IT'), value: 'IT' },
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
          placeholder: "{{t('storeStaff.pleaseSelectStatus')}}",
          clearable: true,
          options: [
            { label: "{{t('storeStaff.status_ACTIVE'), value: 'ACTIVE' },
            { label: "{{t('storeStaff.status_INACTIVE'), value: 'INACTIVE' },
            { label: "{{t('storeStaff.status_ON_LEAVE'), value: 'ON_LEAVE' },
            { label: "{{t('storeStaff.status_TERMINATED'), value: 'TERMINATED' },
          ],
        },
      },
      hire_date_start: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeStaff.hireDateStart')}}",
          type: 'date',
          clearable: true,
        },
      },
      hire_date_end: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('storeStaff.hireDateEnd')}}",
          type: 'date',
          clearable: true,
        },
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<StoreStaffInfo> = {
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
  const gridOptions: VxeGridProps<StoreStaffInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'staff_name',
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
          return await storeApi.getStoreStaffList({
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






