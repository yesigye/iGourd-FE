import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, confirm } from '@igourd/common-ui';
import { saleApi } from '../apis';
import type { VxeGridListeners, VxeGridProps, VxeGridPropTypes } from '#/adapter/vxe-table';
import SaleDrawerFrom from '../components/sale-drawer.vue';
import { useUserStore } from '@igourd/stores';

// 定义行数据类型
interface SaleInfo {
  id: string;
  customer_id: string;
  customer_name: string;
  sale_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
}

export function useSaleList() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const checkedKeys = ref<string[]>([]);

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleDrawerFrom,
    appendToMain: true,
  });

  // 表格列配置
  const columns: VxeGridPropTypes.Column<SaleInfo>[] = [
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
      field: 'sale_date',
      title: t('sale.saleDate'),
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'total_amount',
      title: t('sale.totalAmount'),
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'status',
      title: t('sale.status'),
      width: 100,
      formatter: ({ cellValue }) => {
        const statusMap = {
          pending: t('sale.status.pending'),
          confirmed: t('sale.status.confirmed'),
          shipped: t('sale.status.shipped'),
          delivered: t('sale.status.delivered'),
          cancelled: t('sale.status.cancelled'),
          completed: t('sale.status.completed'),
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
          { label: "{{t('sale.status.shipped')}}", value: 'shipped' },
          { label: "{{t('sale.status.delivered')}}", value: 'delivered' },
          { label: "{{t('sale.status.cancelled')}}", value: 'cancelled' },
          { label: "{{t('sale.status.completed')}}", value: 'completed' },
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
  const gridEvents: VxeGridListeners<SaleInfo> = {
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
  const gridOptions: VxeGridProps<SaleInfo> = {
    columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await saleApi.getPageList({
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
  const handleEdit = (row: SaleInfo) => {
    drawerApi.setData(row).open();
  };

  const handleView = (row: SaleInfo) => {
    drawerApi.setData({ ...row, mode: 'view' }).open();
  };

  const canBatchDelete = computed(() => checkedKeys.value.length > 0);

  const batchDelete = async () => {
    try {
      await confirm({
        title: t('sale.deleteConfirmTitle'),
        content: t('sale.deleteConfirmText'),
      });
      
      await saleApi.deleteSales({
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
    console.log('导出销售数据');
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
