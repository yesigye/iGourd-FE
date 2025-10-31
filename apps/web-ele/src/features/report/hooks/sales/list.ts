import type { SalesReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useI18n } from '@igourd/locales';

import { getSalesReportApi } from '@@/report/apis';
import dayjs from 'dayjs';

import { useCrud } from '#/hooks';

export function useSalesReport() {
  const { t } = useI18n();
  const options = ref([]);
  const query = ref<QueryForm>({
    page_num: 1,
    page_size: 10,
  });
  const columns: VxeGridPropTypes.Column<SalesReportRow>[] = [
    {
      field: 'product_major_name',
      title: t('sales.product-name'),
      width: 180,
      align: 'left',
      filters: options.value,
    },
    {
      field: 'product_code',
      title: t('sales.product-code'),
      width: 180,
      align: 'left',
    },
    {
      field: 'date',
      title: t('sales.sku-barcode'),
      width: 180,
      align: 'left',
    },
    {
      field: 'date',
      title: t('sales.category'),
      width: 180,
      align: 'left',
    },
    {
      field: 'product_unit_name',
      title: t('sales.unit'),
      width: 180,
      align: 'left',
    },
    {
      field: 'product_cost_price',
      title: t('sales.cost-price'),
      width: 180,
      align: 'left',
    },
    {
      field: 'product_selling_price',
      title: t('sales.selling-price'),
      width: 180,
      align: 'left',
    },
    {
      field: 'sales_quantity',
      title: t('sales.sales-qty'),
      width: 180,
      align: 'left',
    },
    {
      field: 'remain_quantity',
      title: t('sales.remain-qty'),
      width: 180,
      align: 'left',
    },
    {
      field: 'sales_total_amount',
      title: t('sales.sales-amount'),
      width: 180,
      align: 'left',
    },
    {
      field: 'sales_gross_profit',
      title: t('sales.sales-gross-margin'),
      width: 180,
      align: 'left',
    },
    {
      field: 'sales_gross_profit_rate',
      title: t('sales.sales-gross-margin-rate'),
      width: 180,
      align: 'left',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      width: 180,
      fixed: 'right',
      slots: { default: 'operation' },
      align: 'left',
    },
  ];

  const searchFormSchema = {
    date_range: {
      type: 'array',
      default: [
        new Date().toISOString().split('T')[0], // 今天开始 YYYY-MM-DD
        new Date().toISOString().split('T')[0], // 今天结束 YYYY-MM-DD
      ],
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
    ...useCrud<SalesReportRow, any>({
      columns,
      id: 'product_month_report_export',
      searchFormSchema,
      scope: {
        initialValues: {
          date_range: [
            `${dayjs().subtract(1, 'months').format('YYYY-MM-DD')} `,
            `${dayjs().format('YYYY-MM-DD')} `,
          ],
        },
      },
      tabsOption: {
        defaultActiveValue: 'ALL',
        formKey: 'product_month_report_export',
      },
      toolbarConfig: {
        export: true,
      },
      batchOperate: false,
      service: {
        query: async (params: {
          end_date?: string;
          page_num: number;
          page_size: number;
          start_date?: string;
          tabKey: string;
          time_range: string;
        }) => {
          // 开始时间默认是当前时间-一个月
          params.end_date = params.date_range?.[1]
            ? `${params.date_range?.[1]} 23:59:59`
            : `${dayjs().format('YYYY-MM-DD')} 23:59:59`;
          params.start_date = params.date_range?.[0]
            ? `${params.date_range?.[0]} 00:00:00`
            : `${dayjs().subtract(1, 'months').format('YYYY-MM-DD')} 00:00:00`;
          params.tabKey = 'DAY';
          params.time_range = 'DAY';
          query.value = params;
          return await getSalesReportApi(params);
        },
      },
    }),
    query,
  };
}
