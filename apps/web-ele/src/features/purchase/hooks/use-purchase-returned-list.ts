import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, confirm } from '@igourd/common-ui';
import { getPurchaseReturnedListApi, goodsReceiptDelete } from '../apis';
import type {
  VxeGridListeners,
  VxeGridProps,
  VxeGridPropTypes,
} from '#/adapter/vxe-table';
import PurchaseReturnedDrawerFrom from '../components/purchase-returned-drawer.vue';
import { useUserStore } from '@igourd/stores';

// 定义行数据类型
interface PurchaseReturnedInfo {
  id: string;
  purchase_id: string;
  returned_no: string;
  returned_date: string;
  total_amount: number;
  status: string;
  reason: string;
  remark: string;
  create_time: string;
}

export function usePurchaseReturnedList() {
  const { t } = useI18n();
  const checkedKeys = ref<number[]>([]);
  const { currentLoginUserApp } = useUserStore();
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseReturnedDrawerFrom,
  });

  // 表格列配置
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'returned_no',
      title: t('purchase.purchaseReturnedNo'),
      width: 150,
      sortable: true,
    },
    {
      field: 'returned_date',
      title: t('purchase.returnedDate'),
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'vendor_name',
      title: t('purchase.vendorName'),
      width: 120,
      sortable: true,
    },
    {
      field: 'warehouse_name',
      title: t('purchase.warehouse'),
      width: 100,
    },
    {
      field: 'total_amount',
      title: t('purchase.totalAmount'),
      width: 150,
    },
    {
      field: 'goods_receipt_note_no',
      title: t('purchase.goodsReceiptNoteNo'),
      width: 200,
    },
    {
      field: 'purchase_order_no',
      title: t('purchase.purchaseorderno'),
      width: 100,
    },

    {
      field: 'creator_name',
      title: t('purchase.creator'),
      width: 160,
      sortable: true,
    },
    {
      field: 'create_time',
      title: t('purchase.creationTime'),
      width: 160,
      sortable: true,
      fixed: 'right',
    },
    {
      field: 'review_status',
      title: t('purchase.reviewStatus'),
      width: '85',
      align: 'center',
      fixed: 'right',
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
  const gridOptions: VxeGridProps<PurchaseReturnedInfo> = {
    checkboxConfig: {
      highlight: true,
    },
    filterConfig: {
      remote: true,
    },
    columns: columns,
    exportConfig: {},
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await getPurchaseReturnedListApi({
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
        return goodsReceiptDelete({
          goods_receipt_note_id_list: checkedKeys.value,
          merchant_id: currentLoginUserApp.owner_id,
        });
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
    canBatchDelete,
    batchDelete,
    handleEdit,
  };
}
