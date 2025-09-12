import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, confirm } from '@igourd/common-ui';
import { saleApi } from '../apis';
import type { VxeGridListeners, VxeGridProps, VxeGridPropTypes } from '#/adapter/vxe-table';
import SaleOrderDrawerFrom from '../components/sale-order-drawer.vue';
import { useUserStore } from '@igourd/stores';

// 定义行数据类型 - 基于原有的表格数据结构
interface SaleOrderInfo {
  id: string;
  order_no: string;
  customer_name: string;
  order_create_time: string;
  total_quantity: number;
  total_amount: number;
  round_down_amount: number;
  total_paid_amount: number;
  status: string;
  creator_name: string;
  create_time: string;
}

export function useSaleOrderList() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const checkedKeys = ref<string[]>([]);

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleOrderDrawerFrom,
    appendToMain: true,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns: VxeGridPropTypes.Column<SaleOrderInfo>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'order_no',
      title: t('sales.saleOrderNo'),
      width: 165,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'customer_name',
      title: t('sales.customer'),
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'order_create_time',
      title: t('sales.orderDate'),
      width: 180,
      align: 'left',
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'total_quantity',
      title: t('sales.totalQuantity'),
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'total_amount',
      title: t('sales.totalPrice'),
      width: 180,
      align: 'left',
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'round_down_amount',
      title: t('sales.roundDownAmount'),
      width: 180,
      align: 'left',
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'total_paid_amount',
      title: t('sales.totalPaidAmount'),
      width: 180,
      align: 'left',
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'status',
      title: t('sales.status'),
      width: 130,
      align: 'center',
      fixed: 'right',
      sortable: true,
      formatter: ({ cellValue }) => {
        const statusMap = {
          CANCEL: t('common.status.CANCEL'),
          PENDING: t('common.status.paying'),
          PAID: t('common.status.PAID'),
        };
        return statusMap[cellValue as keyof typeof statusMap] || cellValue;
      },
    },
    {
      field: 'creator_name',
      title: t('sales.creator'),
      width: 200,
      align: 'left',
      sortable: true,
    },
    {
      field: 'create_time',
      title: t('sales.creationTime'),
      width: 170,
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

  // 搜索表单配置 - 基于原有的查询参数
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('sales.searchOrderPlaceholder')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('common.selectStatus')}}",
        clearable: true,
        options: [
          { label: "{{t('common.status.CANCEL')}}", value: 'CANCEL' },
          { label: "{{t('common.status.paying')}}", value: 'PENDING' },
          { label: "{{t('common.status.PAID')}}", value: 'PAID' },
        ],
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<SaleOrderInfo> = {
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
  const gridOptions: VxeGridProps<SaleOrderInfo> = {
    columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await saleApi.getOrderList({
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
  const handleEdit = (row: SaleOrderInfo) => {
    drawerApi.setData(row).open();
  };

  const handleView = (row: SaleOrderInfo) => {
    drawerApi.setData({ ...row, mode: 'view' }).open();
  };

  const canBatchDelete = computed(() => checkedKeys.value.length > 0);

  const batchDelete = async () => {
    try {
      await confirm({
        title: t('sales.deleteConfirmTitle'),
        content: t('sales.deleteConfirmText'),
      });
      
      await saleApi.cancelOrder({
        id_list: checkedKeys.value,
        merchant_id: currentLoginUserApp.owner_id,
        status: 'CANCEL',
      });
      
      gridApi.reload();
      checkedKeys.value = [];
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  const handleExport = () => {
    // 导出逻辑
    console.log('导出订单数据');
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
