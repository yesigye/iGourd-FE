import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deletePurchaseOrderApi,
  getPurchaseOrderPageListApi,
} from '@@/purchase/apis';
import { PurchaseOrderDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function usePurchaseOrder() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'purchase_order_no',
      minWidth: 180,
      align: 'left',
      fixed: 'left',
      title: t('purchase.purchaseorderno'),
    },
    {
      field: 'purchase_date',
      minWidth: 200,
      align: 'left',
      title: t('purchase.purchaseDate'),
    },
    {
      field: 'vendor_name',
      minWidth: 200,
      align: 'left',
      title: t('purchase.vendorName'),
    },
    {
      field: 'warehouse_name',
      minWidth: 150,
      align: 'center',
      title: t('purchase.warehouse'),
    },
    {
      field: 'status',
      minWidth: 150,
      align: 'center',

      title: t('purchase.status'),
      formatter({ cellValue }) {
        return t(`purchase.${cellValue}`);
      },
    },
    {
      field: 'review_status',
      minWidth: 80,
      align: 'center',
      fixed: 'right',
      title: t('purchase.reviewStatus'),
      cellRender: {
        name: 'ReviewStatus',
      },
    },
    {
      field: 'total_amount',
      minWidth: 150,
      align: 'right',
      title: t('purchase.totalAmount'),
    },
    {
      field: 'receipted_percentage',
      minWidth: 120,
      align: 'center',
      title: t('purchase.receiptedPCT'),
    },
    {
      field: 'creator_name',
      minWidth: 150,
      align: 'center',
      title: t('purchase.creator'),
    },
    {
      field: 'create_time',
      minWidth: 180,
      align: 'center',
      title: t('purchase.creationTime'),
    },
    {
      field: 'operation',
      minWidth: 180,
      fixed: 'right',
      title: t('common.operations'),
      slots: {
        default: 'operation',
      },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getPurchaseOrderPageListApi,
    // 删除订单
    remove: deletePurchaseOrderApi,
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
            placeholder: t('purchase.searchPlaceholder'),
          },
        },
      },
      batchOperate: true,
      connectedComponent: PurchaseOrderDrawer,
    });

  return {
    // 组件
    Grid,
    Drawer,

    // 方法
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
