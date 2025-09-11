import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, confirm } from '@igourd/common-ui';
import { goodsReceiptDelete, purchaseApi } from '../apis';
import type {
  VxeGridListeners,
  VxeGridProps,
  VxeGridPropTypes,
} from '#/adapter/vxe-table';
import PurchaseReceiptDrawerFrom from '../components/purchase-receipt-drawer.vue';
import { useUserStore } from '@igourd/stores';

// 定义行数据类型 - 基于原有的表格数据结构
interface PurchaseReceiptInfo {
  id: string;
  goods_receipt_note_no: string;
  receipt_date: string;
  vendor_name: string;
  warehouse_name: string;
  review_status: string;
  total_amount: number;
  purchase_order_no: string;
  creator_name: string;
  create_time: string;
}

export function usePurchaseReceiptList() {
  const { t } = useI18n();
  const checkedKeys = ref<number[]>([]);
  const { currentLoginUserApp } = useUserStore();
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseReceiptDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'goods_receipt_note_no',
      title: t('purchase.goodsReceiptNoteNo'),
      width: 230,
      sortable: false,
      fixed: 'left',
      align: 'left',
    },
    {
      field: 'receipt_date',
      title: t('purchase.receiptDate'),
      width: 200,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vendor_name',
      title: t('purchase.vendorName'),
      width: 180,
      sortable: false,
      align: 'left',
    },
    {
      field: 'warehouse_name',
      title: t('purchase.warehouse'),
      width: 150,
      sortable: false,
      align: 'center',
    },
    {
      field: 'review_status',
      title: t('purchase.reviewStatus'),
      width: 85,
      sortable: false,
      fixed: 'right',
      align: 'center',
      // 审核状态列需要特殊处理，使用自定义渲染
      slots: { default: 'review_status' },
    },
    {
      field: 'total_amount',
      title: t('purchase.totalAmount'),
      width: 150,
      align: 'center',
      sortable: false,
      // 金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'purchase_order_no',
      title: t('purchase.purchaseorderno'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'creator_name',
      title: t('purchase.creator'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('purchase.creationTime'),
      width: 180,
      sortable: false,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'action',
      title: t('common.action'),
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: { default: 'action' },
    },
  ];

  // 搜索表单配置 - 基于原有的 searchParms 对象
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
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
  const gridOptions: VxeGridProps<PurchaseReceiptInfo> = {
    columns: columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await purchaseApi.getReceiptList({
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
