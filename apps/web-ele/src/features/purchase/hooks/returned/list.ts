import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  PurchaseReturnedQueryPageVO,
  PurchaseReturnedPageModel,
  ReturnedStatus,
  ReturnedType,
} from '@@/purchase/types';

import {
  getPurchaseReturnedPageListApi,
  deletePurchaseReturnedApi,
  auditPurchaseReturnedApi,
} from '@@/purchase/apis';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

export function usePurchaseReturned() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<PurchaseReturnedPageModel>[] = [
    {
      field: 'purchase_returned_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('purchase.purchaseReturnedNo'),
    },
    {
      field: 'returned_date',
      width: 200,
      align: 'left',
      title: t('purchase.returnedDate'),
    },
    {
      field: 'returned_type',
      width: 150,
      align: 'center',
      title: t('purchase.returnedType'),
    },
    {
      field: 'vendor_name',
      width: 120,
      align: 'center',
      title: t('purchase.vendorName'),
    },
    {
      field: 'warehouse_name',
      width: 150,
      align: 'right',
      title: t('purchase.warehouse'),
    },
    {
      field: 'total_amount',
      width: 150,
      align: 'center',
      title: t('purchase.totalAmount'),
    },
    {
      field: 'goods_receipt_note_no',
      width: 200,
      align: 'left',
      title: t('purchase.goodsReceiptNoteNo'),
    },
    {
      field: 'purchase_order_no',
      width: 120,
      align: 'left',
      title: t('purchase.purchaseorderno'),
    },
    {
      field: 'creator_name',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('purchase.creator'),
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('purchase.creationTime'),
    },
    {
      field: 'review_status',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('purchase.reviewStatus'),
    },
    {
      field: 'options',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('common.operations'),
      slots: { default: 'operation' },
    },
  ];
  // 查询参数
  const queryParams = ref<PurchaseReturnedQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<PurchaseReturnedPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: PurchaseReturnedQueryPageVO) => {
      const response = await getPurchaseReturnedPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除退货单
    remove: async (data: {
      returned_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deletePurchaseReturnedApi(data);
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    handleEdit,
    handleDelete,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,
  } = useCrud({
    service,
    columns: baseColumns,
    searchFormSchema: [
      {
        type: 'input',
        name: 'keywords',
        title: t('purchase.search'),
        placeholder: t('purchase.searchPlaceholder'),
      },
      {
        type: 'select',
        name: 'status',
        title: t('purchase.status'),
        options: [
          { label: t('purchase.status.draft'), value: 'DRAFT' },
          { label: t('purchase.status.pending'), value: 'PENDING' },
          { label: t('purchase.status.approved'), value: 'APPROVED' },
          { label: t('purchase.status.returned'), value: 'RETURNED' },
          { label: t('purchase.status.cancelled'), value: 'CANCELLED' },
        ],
      },
      {
        type: 'select',
        name: 'returned_type',
        title: t('purchase.returnedType'),
        options: [
          {
            label: t('purchase.returnedType.qualityIssue'),
            value: 'QUALITY_ISSUE',
          },
          { label: t('purchase.returnedType.damaged'), value: 'DAMAGED' },
          { label: t('purchase.returnedType.wrongItem'), value: 'WRONG_ITEM' },
          {
            label: t('purchase.returnedType.excessStock'),
            value: 'EXCESS_STOCK',
          },
          { label: t('purchase.returnedType.other'), value: 'OTHER' },
        ],
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('purchase.returnedDate'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [ReturnedDrawer, { openDrawer: openReturnedDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();
  const [AuditDrawer, { openDrawer: openAuditDrawer }] = useDrawer<{
    returnedId: number;
    status: ReturnedStatus;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      returned_type: val.searchVal?.returned_type || undefined,
      start_date: val.searchVal?.dateRange?.[0] || undefined,
      end_date: val.searchVal?.dateRange?.[1] || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: PurchaseReturnedPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openReturnedDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditReturned = (row: PurchaseReturnedPageModel) => {
    openReturnedDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: PurchaseReturnedPageModel) => {
    openReturnedDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理审核
  const handleAudit = (
    row: PurchaseReturnedPageModel,
    status: ReturnedStatus,
  ) => {
    openAuditDrawer(true, { returnedId: row.id, status });
  };

  // 处理批量删除
  const handleBatchDeleteReturned = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deletePurchaseReturnedApi({
        merchant_id: userStore.merchantId,
        returned_id_list: selectedRows.value.map((item) => item.id),
      });
      refresh();
      selectedRows.value = [];
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  // 页码改变
  const handleCurrentChange = (val: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_num: val,
    };
  };

  // 页面大小改变
  const handleSizeChange = (val: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_size: val,
    };
  };

  return {
    // 组件
    Grid,
    ReturnedDrawer,
    AuditDrawer,

    // 数据
    queryParams,
    selectedRows,

    // 配置
    columns: baseColumns,

    // 方法
    handleEdit,
    handleDelete,
    handleSearch,
    handleSelectionChange,
    handleAdd,
    handleEditReturned,
    handleDetail,
    handleAudit,
    handleBatchDeleteReturned,
    handleCurrentChange,
    handleSizeChange,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,

    // API
    gridApi,
  };
}
