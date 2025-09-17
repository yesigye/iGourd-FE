import type { PurchaseReceiptPageModel } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deletePurchaseReceiptApi,
  getPurchaseReceiptPageListApi,
} from '@@/purchase/apis';
import { PurchaseReceiptDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

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

  // 服务函数
  const service = {
    // 获取列表数据
    query: getPurchaseReceiptPageListApi,

    // 删除收货单
    remove: deletePurchaseReceiptApi,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('common.keywords'),
            clearable: true,
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: PurchaseReceiptDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
