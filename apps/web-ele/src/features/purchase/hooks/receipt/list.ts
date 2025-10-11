import type { PurchaseReceiptPageModel } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deletePurchaseReceiptApi,
  getPurchaseReceiptDetailApi,
  getPurchaseReceiptPageListApi,
} from '@@/purchase/apis';
import { PurchaseReceiptDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function usePurchaseReceipt() {
  const { t } = useI18n(); // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<PurchaseReceiptPageModel>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'goods_receipt_note_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('receipt.no'),
    },
    {
      field: 'receipt_date',
      width: 200,
      align: 'left',
      title: t('receipt.date'),
    },
    {
      field: 'vendor_name',
      width: 120,
      align: 'center',
      title: t('receipt.vendor-name'),
    },
    {
      field: 'warehouse_name',
      width: 150,
      align: 'right',
      title: t('receipt.warehouse'),
    },
    {
      field: 'purchase_order_no',
      align: 'center',
      width: 150,
      title: t('receipt.purchase-order-no'),
    },
    {
      field: 'pay_status',
      align: 'center',
      width: 150,
      title: t('receipt.pay-status'),
    },
    {
      field: 'creator_name',
      width: 200,
      align: 'left',
      title: t('common.creator'),
    },
    {
      field: 'create_time',
      width: 200,
      align: 'left',
      title: t('purchase.creationTime'),
    },
    {
      field: 'review_status',
      width: 150,
      align: 'center',
      title: t('purchase.reviewStatus'),
      cellRender: {
        name: 'ReviewStatus',
      },
      slots: { default: 'modal' },
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
    query: getPurchaseReceiptPageListApi,
    //detail: getPurchaseReceiptDetailApi,
    // 删除收货单
    remove: deletePurchaseReceiptApi,
  };

  const searchFormSchema = {
    form: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'inline',
      },
      properties: {
        date_range: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-decorator-props': {
            style: { 'margin-bottom': '0', width: '200px' },
            class: 'mr-2',
          },
          'x-component-props': {
            placeholder: t('purchase.good-placeholder'),
            type: 'datetimerange',
          },
        },
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-decorator-props': {
            style: { 'margin-bottom': '0', width: '160px' },
          },
          'x-component-props': {
            placeholder: t('purchase.good-placeholder'),
          },
        },
      },
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    canBatchOperate,
    Drawer,
    handleEdit,
    handleBatchDelete,
  } = useCrud({
    service,
    columns: baseColumns,
    searchFormSchema: searchFormSchema,
    batchOperate: true, // 支持批量删除
    connectedComponent: PurchaseReceiptDrawer,
  });

  return {
    Grid,
    gridApi,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
