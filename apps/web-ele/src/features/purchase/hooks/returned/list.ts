import type { PurchaseReturnedPageModel } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deletePurchaseReturnedApi,
  getPurchaseReturnedPageListApi,
} from '@@/purchase/apis';
import { PurchaseReturnedDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function usePurchaseReturned() {
  const { t } = useI18n();
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
      title: t('purchase.creator'),
    },
    {
      field: 'create_time',
      width: 150,
      align: 'center',
      fixed: 'right',
      title: t('purchase.creationTime'),
    },
    {
      field: 'review_status',
      width: 80,
      align: 'center',
      fixed: 'right',
      title: t('purchase.reviewStatus'),
      cellRender: {
        name: 'ReviewStatus',
      },
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

  // 服务函数
  const service = {
    // 获取列表数据
    query: getPurchaseReturnedPageListApi,
    // 删除退货单
    remove: async (data: { returned_id_list: number[] }) => {
      return await deletePurchaseReturnedApi(data);
    },
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
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: PurchaseReturnedDrawer,
    });

  return {
    // 组件
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
