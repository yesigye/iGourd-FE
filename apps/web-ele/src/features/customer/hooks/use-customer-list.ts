import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { customerApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import CustomerDrawerFrom from '../components/customer-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface CustomerInfo {
  id: string;
  name: string;
  contact_name: string;
  contact_telephone: string;
  phone_no: string;
  email: string;
  type: string;
  status: string;
  balance: number;
  debt: number;
  create_time: string;
}

export function useCustomerList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: CustomerDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'name',
      title: "{{t('customers.customerName')}}",
      width: 200,
      sortable: false,
      fixed: 'left',
      align: 'left',
    },
    {
      field: 'contact_name',
      title: "{{t('customers.contactName')}}",
      width: 180,
      sortable: false,
      align: 'left',
    },
    {
      field: 'contact_telephone',
      title: "{{t('customers.contactTelephone')}}",
      width: 180,
      sortable: false,
      align: 'left',
    },
    {
      field: 'phone_no',
      title: "{{t('customers.phoneNumber')}}",
      width: 180,
      sortable: false,
      align: 'left',
    },
    {
      field: 'email',
      title: "{{t('customers.email')}}",
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'type',
      title: "{{t('customers.customerType')}}",
      width: 150,
      sortable: false,
      align: 'center',
      // 客户类型列需要特殊处理，使用自定义渲染
      slots: { default: 'type' },
    },
    {
      field: 'status',
      title: "{{t('customers.status')}}",
      width: 120,
      sortable: false,
      align: 'center',
      // 状态列需要特殊处理，使用自定义渲染
      slots: { default: 'status' },
    },
    {
      field: 'balance',
      title: "{{t('customers.balance')}}",
      width: 150,
      align: 'center',
      sortable: false,
      // 余额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'debt',
      title: "{{t('customers.debt')}}",
      width: 150,
      align: 'center',
      sortable: false,
      // 债务列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'create_time',
      title: "{{t('customers.creationTime')}}",
      width: 180,
      sortable: false,
      align: 'left',
      formatter: 'formatDateTime',
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
        placeholder: "{{t('customers.customerPlaceholder')}}",
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<CustomerInfo> = {
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
  const gridOptions: VxeGridProps<CustomerInfo> = {
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
          return await customerApi.getPageList({
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
