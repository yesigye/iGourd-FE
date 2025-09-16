import type { PurchaseBillDTO, PurchaseBillRow } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  approvePurchaseBillApi,
  createPurchaseBillApi,
  deletePurchaseBillApi,
  getPurchaseBillsListApi,
  updatePurchaseBillApi,
} from '@@/purchase/apis';
import { PurchaseBillDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function usePurchaseBills() {
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
      title: t('purchase.totalAmount'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'paid_amount',
      title: t('purchase.paidAmount'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'unpaid_amount',
      title: t('purchase.unpaid_amount'),
      width: 120,
      align: 'right',
    },
    {
      field: 'vendor_name',
      title: t('purchase.vendor_name'),
      width: 120,
      align: 'right',
    },
    {
      field: 'payment_status',
      title: t('purchase.paymentstatus'),
      width: 100,
      align: 'center',
    },
    {
      field: 'create_time',
      title: t('purchase.creationTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'review_status',
      title: t('purchase.reviewStatus'),
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
      field: 'create_time',
      title: t('purchase.creationTime'),
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
    bill_no: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('purchase.billNo')}}",
        clearable: true,
      },
    },
    supplier_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('purchase.supplierName')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('purchase.status')}}",
        clearable: true,
        options: [
          { label: t('purchase.statusOptions.draft'), value: 'draft' },
          { label: t('purchase.statusOptions.pending'), value: 'pending' },
          { label: t('purchase.statusOptions.approved'), value: 'approved' },
          { label: t('purchase.statusOptions.rejected'), value: 'rejected' },
          { label: t('purchase.statusOptions.completed'), value: 'completed' },
        ],
      },
    },
    date_range: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
      'x-component-props': {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  };

  return useCrud<PurchaseBillRow, PurchaseBillDTO>({
    columns,
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
