import type { ReturnedOrderDTO, ReturnedOrderRow } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  approveReturnedOrderApi,
  createReturnedOrderApi,
  deleteReturnedOrderApi,
  getReturnedOrderListApi,
  updateReturnedOrderApi,
} from '@@/sale/apis';
import { ReturnedOrderDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function useReturnedOrder() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<ReturnedOrderRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'order_returned_no',
      title: t('sale.refund_order_no'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'customer_name',
      title: t('sale.refund_time'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'order_returned_total_quantity',
      title: t('sale.refund_quantity'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'order_no',
      title: t('sale.sales_order_no'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'status',
      title: t('sale.status'),
      width: 120,
      align: 'right',
    },
    {
      field: 'creator_name',
      title: t('sales.creator'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'create_time',
      title: t('sales.creation_time'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      width: 150,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    returned_no: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('sale.returnedNo')}}",
        clearable: true,
      },
    },
    order_no: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('sale.orderNo')}}",
        clearable: true,
      },
    },
    customer_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('sale.customerName')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('sale.status')}}",
        clearable: true,
        options: [
          { label: t('sale.statusOptions.draft'), value: 'draft' },
          { label: t('sale.statusOptions.pending'), value: 'pending' },
          { label: t('sale.statusOptions.approved'), value: 'approved' },
          { label: t('sale.statusOptions.rejected'), value: 'rejected' },
          { label: t('sale.statusOptions.completed'), value: 'completed' },
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

  return useCrud<ReturnedOrderRow, ReturnedOrderDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: ReturnedOrderDrawer,
    service: {
      query: getReturnedOrderListApi,
      drop: deleteReturnedOrderApi,
      create: createReturnedOrderApi,
      update: updateReturnedOrderApi,
    },
  });
}
