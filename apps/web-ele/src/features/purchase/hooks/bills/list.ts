import type { PurchaseBillDTO, PurchaseBillRow } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createPurchaseBillApi,
  deletePurchaseBillApi,
  getPurchaseBillsListApi,
  updatePurchaseBillApi,
} from '@@/purchase/apis';
import { PurchaseBillDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function usePurchaseBills(defaultQueryParams?: Record<string, any>) {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<PurchaseBillRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'purchase_bill_no',
      title: t('purchase.purchasebillno'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'total_amount',
      title: t('purchase.total-amount'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'paid_amount',
      title: t('purchase.paid-amount'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'unpaid_amount',
      title: t('purchase.unpaid-amount'),
      width: 120,
      align: 'right',
    },
    {
      field: 'vendor_name',
      title: t('purchase.vendor-name'),
      width: 120,
      align: 'right',
    },
    {
      field: 'payment_status',
      title: t('purchase.paymentstatus'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'PaymentStatus',
      },
    },
    {
      field: 'purchase_order_no',
      title: t('purchase.purchaseorderno'),
      width: 100,
      align: 'center',
    },
    {
      field: 'create_time',
      title: t('purchase.creation-time'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'creator_name',
      title: t('purchase.creator'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('purchase.operation'),
      width: 150,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: t('common.keywords'),
        clearable: true,
      },
    },
  };

  return useCrud<PurchaseBillRow, PurchaseBillDTO>({
    columns,
    id:"marketing-bills-order-list",
    params: defaultQueryParams,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: PurchaseBillDrawer,
    service: {
      query: getPurchaseBillsListApi,
      drop: deletePurchaseBillApi,
      create: createPurchaseBillApi,
      update: updatePurchaseBillApi,
    },
  });
}
