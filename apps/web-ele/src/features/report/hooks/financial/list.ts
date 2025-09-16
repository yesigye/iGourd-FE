import type { FinancialReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getFinancialReportApi } from '@@/report/apis';

import { useCrud } from '#/hooks';

export function useFinancialReport() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<FinancialReportRow>[] = [
    {
      field: 'date',
      title: t('report.date'),
      width: 120,
      sortable: true,
      align: 'center',
    },
    {
      field: 'income',
      title: t('report.income'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.income ? `¥${row.income.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'expense',
      title: t('report.expense'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.expense ? `¥${row.expense.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'profit',
      title: t('report.profit'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.profit ? `¥${row.profit.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'profit_margin',
      title: t('report.profitMargin'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.profit_margin ? `${row.profit_margin.toFixed(2)}%` : "-"}}',
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

  return useCrud<FinancialReportRow, any>({
    columns,
    searchFormSchema,
    batchOperate: false,
    service: {
      query: getFinancialReportApi,
    },
  });
}
