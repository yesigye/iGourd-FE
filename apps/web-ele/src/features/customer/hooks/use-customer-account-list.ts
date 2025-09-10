import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { customerApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

// 定义客户账户数据类型
interface CustomerAccountInfo {
  id: string;
  name: string;
  phone_no: string;
  type: string;
  revenue: number;
  expenditures: number;
  date: string;
  remark: string;
  transactionNumber: string;
  balance: number;
  creator: string;
  create_time: string;
}

export function useCustomerAccountList() {
  const { t } = useI18n();
  
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: () => import('../components/customer-account-drawer.vue'),
  });

  // 搜索表单配置
  const searchFormSchema = {
    type: 'object',
    properties: {
      keywords: {
        type: 'string',
        title: "{{t('customers.search')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('customers.search')}}",
          clearable: true,
        },
      },
    },
  };

  // 表格列配置
  const columns = [
    {
      field: 'name',
      title: "{{t('customers.customerName')}}",
      width: 200,
      fixed: 'left',
      showOverflow: 'tooltip',
    },
    {
      field: 'phone_no',
      title: "{{t('customers.phoneNumber')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'type',
      title: "{{t('customers.accountType')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'revenue',
      title: "{{t('customers.revenue')}}",
      width: 200,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'expenditures',
      title: "{{t('customers.expenditures')}}",
      width: 200,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'date',
      title: "{{t('customers.accountDate')}}",
      width: 200,
    },
    {
      field: 'remark',
      title: "{{t('customers.remark')}}",
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'transactionNumber',
      title: "{{t('customers.transactionNumber')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'balance',
      title: "{{t('customers.balance')}}",
      width: 100,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'creator',
      title: "{{t('customers.creator')}}",
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'create_time',
      title: "{{t('customers.creationTime')}}",
      width: 200,
      fixed: 'right',
    },
  ];

  // Grid 事件配置
  const gridEvents: VxeGridListeners<CustomerAccountInfo> = {
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
  const gridOptions: VxeGridProps<CustomerAccountInfo> = {
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
          return await customerApi.getAccountList({
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

