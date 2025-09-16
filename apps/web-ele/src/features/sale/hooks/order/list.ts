import type { SaleOrderDTO, SaleOrderRow } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  approveSaleOrderApi,
  createSaleOrderApi,
  deleteSaleOrderApi,
  getSaleOrderListApi,
  updateSaleOrderApi,
} from '@@/sale/apis';
import { SaleOrderDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function useSaleOrder() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<SaleOrderRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
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
          { label: t('sale.statusOptions.cancelled'), value: 'cancelled' },
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

  return useCrud<SaleOrderRow, SaleOrderDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: SaleOrderDrawer,
    service: {
      query: getSaleOrderListApi,
      drop: deleteSaleOrderApi,
      create: createSaleOrderApi,
      update: updateSaleOrderApi,
    },
  });
}
