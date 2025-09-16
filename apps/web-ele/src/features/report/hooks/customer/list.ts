import type { CustomerReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getCustomerReportApi } from '@@/report/apis';

import { useCrud } from '#/hooks';

export function useCustomerReport() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<CustomerReportRow>[] = [
    {
      field: 'customer_name',
      title: t('report.customerName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'customer_code',
      title: t('report.customerCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'total_orders',
      title: t('report.totalOrders'),
      width: 120,
      align: 'right',
    },
    {
      field: 'total_amount',
      title: t('report.totalAmount'),
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
      field: 'avg_order_amount',
      title: t('report.avgOrderAmount'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.avg_order_amount ? `¥${row.avg_order_amount.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'last_order_date',
      title: t('report.lastOrderDate'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'create_time',
      title: t('common.createTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
  ];

  const searchFormSchema = {
    customer_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('report.customerName')}}",
        clearable: true,
      },
    },
    customer_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('report.customerCode')}}",
        clearable: true,
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

  return useCrud<CustomerReportRow, any>({
    columns,
    searchFormSchema,
    batchOperate: false,
    service: {
      query: getCustomerReportApi,
    },
  });
}
