import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { PurchaseOrderDrawer } from '@@/purchase/components';
import type {
  PurchaseOrderQueryPageVO,
  PurchaseOrderPageModel,
  OrderStatus,
  PurchaseOrderModifyVO,
} from '@@/purchase/types';

import {
  getPurchaseOrderPageListApi,
  deletePurchaseOrderApi,
  auditPurchaseOrderApi,
  settlePurchaseOrderApi,
} from '@@/purchase/apis';
import type { VxeGridPropTypes } from '@igourd/plugins/vxe-table';

export function usePurchaseOrder() {
  const { t } = useI18n();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<PurchaseOrderPageModel>[] = [
    {
      field: 'purchase_order_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('purchase.purchaseorderno'),
    },
    {
      field: 'purchase_date',
      width: 200,
      align: 'left',
      title: t('purchase.purchaseDate'),
    },
    {
      field: 'vendor_name',
      width: 120,
      align: 'center',
      title: t('purchase.vendorName'),
    },
    {
      field: 'warehouse_name',
      width: 120,
      align: 'center',
      title: t('purchase.warehouse'),
    },
    {
      field: 'total_amount',
      width: 150,
      align: 'right',
      title: t('purchase.totalAmount'),
    },
    {
      field: 'status',
      width: 150,
      align: 'right',
      title: t('purchase.status'),
    },
    {
      field: 'review_status',
      width: 150,
      align: 'center',
      title: t('purchase.reviewStatus'),
    },
    {
      field: 'total_amount',
      width: 150,
      align: 'center',
      title: t('purchase.totalAmount'),
    },
    {
      field: 'receipted_percentage',
      width: 120,
      align: 'left',
      title: t('purchase.receiptedPCT'),
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
  ];

  // 选中的行数据
  const selectedRows = ref<PurchaseOrderPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: PurchaseOrderQueryPageVO) => {
      const response = await getPurchaseOrderPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除采购订单
    remove: async (data: { order_id_list: number[]; merchant_id?: number }) => {
      return await deletePurchaseOrderApi(data);
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
    Drawer,
  } = useCrud<PurchaseOrderPageModel, PurchaseOrderModifyVO>({
    //@ts-ignore
    service,
    columns: baseColumns,
    searchFormSchema: {
      keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('common.keywords')}}",
          clearable: true,
        },
      },
    },
    batchOperate: true, // 支持批量删除
    connectedComponent: PurchaseOrderDrawer,
  });

  // 处理选择
  const handleSelectionChange = (rows: PurchaseOrderPageModel[]) => {
    selectedRows.value = rows;
  };

  return {
    // 组件
    Grid,

    selectedRows,

    // 方法
    handleEdit,
    handleSelectionChange,

    canBatchOperate,
    handleBatchDelete,
    Drawer,
    // API
    gridApi,
  };
}
