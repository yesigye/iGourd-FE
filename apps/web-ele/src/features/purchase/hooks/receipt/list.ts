import type {
  PurchaseReceiptPageModel,
  PurchaseReceiptQueryPageVO,
  ReceiptStatus,
} from '@@/purchase/types';

import { ref } from 'vue';

import { useI18n } from '@igourd/locales';
import { PurchaseReceiptDrawer } from '@@/purchase/components';
import {
  deletePurchaseReceiptApi,
  getPurchaseReceiptPageListApi,
} from '@@/purchase/apis';

import { useCrud } from '#/hooks';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

export function usePurchaseReceipt() {
  const { t } = useI18n(); // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<PurchaseReceiptPageModel>[] = [
    {
      field: 'goods_receipt_note_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('purchase.goodsReceiptNoteNo'),
    },
    {
      field: 'receipt_date',
      width: 200,
      align: 'left',
      title: t('purchase.receiptDate'),
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
      field: 'review_status',
      width: 150,
      align: 'center',
      title: t('purchase.reviewStatus'),
    },
    {
      field: 'total_amount',
      width: 120,
      align: 'left',
      title: t('purchase.totalAmount'),
    },
    {
      field: 'purchase_order_no',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('purchase.purchaseorderno'),
    },
    {
      field: 'receipt_date',
      width: 200,
      align: 'left',
      title: t('purchase.receiptDate'),
    },
    {
      field: 'creator_name',
      width: 200,
      align: 'left',
      title: t('purchase.creator'),
    },
    {
      field: 'create_time',
      width: 200,
      align: 'left',
      title: t('purchase.creationTime'),
      slots: { default: 'operation' },
    },
  ];
  // 选中的行数据
  const selectedRows = ref<PurchaseReceiptPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: PurchaseReceiptQueryPageVO) => {
      const response = await getPurchaseReceiptPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除收货单
    remove: async (data: {
      merchant_id?: number;
      receipt_id_list: number[];
    }) => {
      return await deletePurchaseReceiptApi(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, gridApi, handleEdit, canBatchOperate, handleBatchDelete } =
    useCrud<any, any>({
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
      connectedComponent: PurchaseReceiptDrawer,
    });

  return {
    // 组件
    Grid,
    selectedRows,

    // 配置
    columns: baseColumns,
    // 方法
    handleEdit,
    canBatchOperate,
    handleBatchDelete,

    // API
    gridApi,
  };
}
