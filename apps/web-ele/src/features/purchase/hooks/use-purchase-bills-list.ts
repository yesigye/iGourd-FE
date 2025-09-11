import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, confirm } from '@igourd/common-ui';
import { getPurchaseBillsListApi } from '../apis';
import type {
  VxeGridListeners,
  VxeGridProps,
  VxeGridPropTypes,
} from '#/adapter/vxe-table';
import PurchaseBillsDrawerFrom from '../components/purchase-bills-drawer.vue';
import { useUserStore } from '@igourd/stores';

// 定义行数据类型
interface PurchaseBillsInfo {
  id: string;
  purchase_id: string;
  bill_no: string;
  bill_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
}

export function usePurchaseBillsList() {
  const { t } = useI18n();
  const checkedKeys = ref<number[]>([]);
  const { currentLoginUserApp } = useUserStore();
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseBillsDrawerFrom,
  });

  // 表格列配置
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'purchase_bill_no',
      title: t('purchase.purchasebillno'),
      width: 150,
      sortable: true,
    },
    {
      field: 'total_amount',
      title: t('purchase.totalAmount'),
      width: 120,
      sortable: true,
    },
    {
      field: 'paid_amount',
      title: t('purchase.paidAmount'),
      width: 120,
      sortable: true,
    },
    {
      field: 'unpaid_amount',
      title: t('purchase.unpaid_amount'),
      width: 120,
      sortable: true,
    },
    {
      field: 'vendor_name',
      title: t('purchase.paymentstatus'),
      width: 120,
      sortable: true,
    },
    {
      field: 'purchase_order_no',
      title: t('purchase.purchaseorderno'),
      width: 120,
      sortable: true,
    },
        {
      field: 'create_time',
      title: t('purchase.creationTime'),
      width: 120,
      sortable: true,
    },
    {
      field: 'review_status',
      title: t('purchase.reviewStatus'),
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },

    {
      field: 'creator_name',
      title: t('purchase.creator'),
      width: 100,
    },
    {
      field: 'create_time',
      title: t('purchase.creationTime'),
      width: 160,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'action',
      title: t('common.action'),
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: { default: 'actions' },
    },
  ];

  // 搜索表单配置
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<any> = {
    checkboxChange(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
    checkboxAll(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<PurchaseBillsInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'bill_no',
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
          return getPurchaseBillsListApi({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: '1938848394566025217',
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

  async function handleEdit(row: any) {
    drawerApi.setData(row).open();
  }
  const canBatchDelete = computed(() => checkedKeys.value.length > 0);

  function batchDelete() {
    confirm({
      title: t('purchase.deleteConfirmTitle'),
      content: t('purchase.deleteConfirmText'),
    })
      .then(() => {
        // return goodsReceiptDelete({
        //   goods_receipt_note_id_list: checkedKeys.value,
        //   merchant_id: currentLoginUserApp.owner_id,
        // });
      })
      .then(() => {
        gridApi.reload();
        checkedKeys.value = [];
      });
  }

  return {
    // 组件
    Grid,
    Drawer,
    gridApi,
    drawerApi,
    handleEdit,
    canBatchDelete,
    batchDelete,
  };
}
