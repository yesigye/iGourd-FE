import type { SalesReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getSalesReportApi } from '@@/report/apis';

import { useCrud } from '#/hooks';

export function useSalesReport() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<SalesReportRow>[] = [
    {
      field: 'date',
      title: t('report.date'),
      width: 120,
      sortable: true,
      align: 'center',
    },
    {
      field: 'order_count',
      title: t('report.orderCount'),
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
      field: 'product_count',
      title: t('report.productCount'),
      width: 120,
      align: 'right',
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

  return useCrud<SalesReportRow, any>({
    columns,
    searchFormSchema,
    batchOperate: false,
    service: {
      query: getSalesReportApi,
    },
  });
}
