import type { FinancialReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useI18n } from '@igourd/locales';

import { getFinancialReportApi } from '@@/report/apis';
import dayjs from 'dayjs';

import { useCrud } from '#/hooks';

export function useFinancialReport() {
  const { t } = useI18n();
  const query = ref<QueryForm>({
    page_num: 1,
    page_size: 10,
  });
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
      slots: { default: 'revenue_amount' },
    },
    {
      field: 'expendityre_amount',
      title: t('financial.expenditure'),
      align: 'center',
      slots: { default: 'expendityre_amount' },
    },
    {
      field: 'financial_category_name',
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
        rangeSeparator: t('common.range-separator'),
        startPlaceholder: t('common.start-date'),
        endPlaceholder: t('common.end-date'),
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: t('sales.placeholder-keywords'),
        class: 'w-[244px]',
        style: {
          width: '240px',
        },
      },
    },
  };

  return {
    ...useCrud<FinancialReportRow, any>({
      columns,
      id: 'report-financial-list',
      searchFormSchema,
      batchOperate: false,
      pagerConfig: {
        enabled: false,
      },
      service: {
        query: async (params: {
          date_range?: string[];
          end_date?: string;
          page_num: number;
          page_size: number;
          start_date?: string;
          tabKey: string;
          time_range: string;
        }) => {
          // 开始时间默认是当前时间-一个月
          params.end_date =
            params.date_range?.[1]?.concat(' 23:59:59') ||
            `${dayjs().format('YYYY-MM-DD')} 23:59:59`;
          params.start_date =
            params.date_range?.[0]?.concat(' 00:00:00') ||
            `${dayjs().subtract(1, 'months').format('YYYY-MM-DD')} 00:00:00`;
          params.tabKey = 'day';
          params.time_range = 'DAY';
          query.value = params;
          const response = await getFinancialReportApi(params);
          return response;
        },
      },
    }),
    query,
  };
}
