import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, confirm } from '@igourd/common-ui';
import { saleApi } from '../apis';
import type { VxeGridListeners, VxeGridProps, VxeGridPropTypes } from '#/adapter/vxe-table';
import SaleEnterDrawerFrom from '../components/sale-enter-drawer.vue';
import { useUserStore } from '@igourd/stores';

// 定义行数据类型
interface SaleEnterInfo {
  id: string;
  customer_id: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  enter_date: string;
  operator: string;
  status: string;
  remark: string;
  create_time: string;
}

export function useSaleEnterList() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const checkedKeys = ref<string[]>([]);

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleEnterDrawerFrom,
    appendToMain: true,
  });

  // 表格列配置
  const columns: VxeGridPropTypes.Column<SaleEnterInfo>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'customer_name',
      title: t('sale.customerName'),
      width: 150,
      sortable: true,
    },
    {
      field: 'product_name',
      title: t('sale.productName'),
      width: 150,
      sortable: true,
    },
    {
      field: 'quantity',
      title: t('sale.quantity'),
      width: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'unit_price',
      title: t('sale.unitPrice'),
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'total_price',
      title: t('sale.totalPrice'),
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'enter_date',
      title: t('sale.enterDate'),
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'operator',
      title: t('sale.operator'),
      width: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: t('sale.status'),
      width: 100,
      formatter: ({ cellValue }) => {
        const statusMap = {
          pending: t('sale.status.pending'),
          confirmed: t('sale.status.confirmed'),
          cancelled: t('sale.status.cancelled'),
        };
        return statusMap[cellValue as keyof typeof statusMap] || cellValue;
      },
    },
    {
      field: 'remark',
      title: t('sale.remark'),
      width: 200,
    },
    {
      field: 'create_time',
      title: t('sale.createTime'),
      width: 160,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: { default: 'operation' },
    },
  ];

  // 搜索表单配置
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('sale.keywords')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('sale.pleaseSelectStatus')}}",
        clearable: true,
        options: [
          { label: "{{t('sale.status.pending')}}", value: 'pending' },
          { label: "{{t('sale.status.confirmed')}}", value: 'confirmed' },
          { label: "{{t('sale.status.cancelled')}}", value: 'cancelled' },
        ],
      },
    },
    dateRange: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
      'x-component-props': {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: "{{t('sale.startDate')}}",
        endPlaceholder: "{{t('sale.endDate')}}",
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<SaleEnterInfo> = {
    checkboxChange(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
    checkboxAll(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
    filterChange({ $grid, filterList }) {
      const query: Record<string, unknown> = {};
      filterList.forEach((item) => {
        query[item.field] = item.values;
      });
      $grid?.commitProxy('reload', query);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<SaleEnterInfo> = {
    columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await saleApi.getEnterList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: currentLoginUserApp.owner_id,
            ...form,
          });
        },
      },
    },
  };

  // 使用 useIgourdVxeGrid
  const [Grid, gridApi] = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
    formOptions: { schema: searchFormSchema, scope: {} },
  });

  // 业务逻辑方法
  const handleEdit = (row: SaleEnterInfo) => {
    drawerApi.setData(row).open();
  };

  const handleView = (row: SaleEnterInfo) => {
    drawerApi.setData({ ...row, mode: 'view' }).open();
  };

  const canBatchDelete = computed(() => checkedKeys.value.length > 0);

  const batchDelete = async () => {
    try {
      await confirm({
        title: t('sale.deleteConfirmTitle'),
        content: t('sale.deleteConfirmText'),
      });
      
      await saleApi.deleteEnterList({
        id_list: checkedKeys.value,
        merchant_id: currentLoginUserApp.owner_id,
      });
      
      gridApi.reload();
      checkedKeys.value = [];
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  const handleExport = () => {
    // 导出逻辑
    console.log('导出销售录入数据');
  };

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

    // 业务方法
    handleEdit,
    handleView,
    canBatchDelete,
    batchDelete,
    handleExport,
  };
}
