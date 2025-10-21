import type { FinancialReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getFinancialReportApi } from '@@/report/apis';

import { useCrud } from '#/hooks';
import dayjs from 'dayjs';

export function useFinancialReport() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<FinancialReportRow>[] = [
    {
      field: 'financial_category_name',
      title: t('financial.financial-category'),

      align: 'center',
    },
    {
      field: 'revenue_amount',
      title: t('financial.revenue'),
      align: 'center',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.income ? `¥${row.income.toFixed(2)}` : "-"}}',
          type: 'primary',
        },
      },
    },
    {
      field: 'expendityre_amount',
      title: t('financial.expenditure'),
      align: 'center',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.expendityre_amount ? `¥${row.expendityre_amount.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'creator',
      title: t('common.creator'),
      align: 'center',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.profit ? `¥${row.profit.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'time_period',
      title: t('financial.time-period'),

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
    id:"report-financial-list",
    searchFormSchema,
    batchOperate: false,
    service: {
      query: async (params: {
        page_num: number;
        page_size: number;
        start_date?: string;
        end_date?: string;
        tabKey: string;
        time_range: string;
      }) => {
        // 开始时间默认是当前时间-一个月
        params.end_date =
          params.end_date || dayjs().format('YYYY-MM-DD') + ' 23:59:59';
        params.start_date =
          params.start_date ||
          dayjs().subtract(1, 'months').format('YYYY-MM-DD') + ' 00:00:00';
        params.tabKey = 'months';
        params.time_range = 'MONTH';
        let response = await getFinancialReportApi(params);
        console.log('getFinancialReportApi', response);
        return {
          list: response || [],
          total: response?.data?.total || 0,
        };
      },
    },
  });
}
