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
      field: 'returned_no',
      title: t('sale.returnedNo'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'order_no',
      title: t('sale.orderNo'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'customer_name',
      title: t('sale.customerName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'customer_code',
      title: t('sale.customerCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'total_amount',
      title: t('sale.totalAmount'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.total_amount ? `¥${row.total_amount.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'status',
      title: t('sale.status'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'ElTag',
        props: {
          type: '{{getStatusTagType(row.status)}}',
          children: '{{getStatusText(row.status)}}',
        },
      },
    },
    {
      field: 'create_time',
      title: t('common.createTime'),
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
