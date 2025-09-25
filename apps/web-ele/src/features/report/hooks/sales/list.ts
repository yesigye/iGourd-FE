import type { SalesReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getSalesReportApi } from '@@/report/apis';

import { useCrud } from '#/hooks';
import dayjs from 'dayjs';
import { ref } from 'vue';

export function useSalesReport() {
  const { t } = useI18n();
  const options = ref([]);
  setTimeout(() => {
    options.value = [
      { label: '111', value: '111' },
      { label: '222', value: '222' },
    ];
    console.log(options.value);
  }, 5000);
  const columns: VxeGridPropTypes.Column<SalesReportRow>[] = [
    {
      field: 'product_major_name',
      title: t('sales.product-name'),
      width: 180,
      align: 'center',
      filters: options.value,
    },
    {
      field: 'product_code',
      title: t('sales.product-code'),
      width: 180,
      align: 'center',
    },
    {
      field: 'date',
      title: t('sales.sku-barcode'),
      width: 180,
      align: 'center',
    },
    {
      field: 'date',
      title: t('sales.category'),
      width: 180,
      align: 'center',
    },
    {
      field: 'product_unit_name',
      title: t('sales.unit'),
      width: 180,
      align: 'center',
    },
    {
      field: 'product_cost_price',
      title: t('sales.cost-price'),
      width: 180,
      align: 'center',
    },
    {
      field: 'product_selling_price',
      title: t('sales.selling-price'),
      width: 180,
      align: 'center',
    },
    {
      field: 'sales_quantity',
      title: t('sales.sales-qty'),
      width: 180,
      align: 'center',
    },
    {
      field: 'remain_quantity',
      title: t('sales.remain-qty'),
      width: 180,
      align: 'center',
    },
    {
      field: 'sales_total_amount',
      title: t('sales.sales-amount'),
      width: 180,
      align: 'center',
    },
    {
      field: 'sales_gross_profit',
      title: t('sales.sales-gross-margin'),
      width: 180,
      align: 'center',
    },
    {
      field: 'sales_gross_profit_rate',
      title: t('sales.sales-gross-margin-rate'),
      width: 180,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      width: 180,
      fixed: 'right',
      slots: { default: 'operation' },
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
    scope: {
      initialValues: {
        date_range: [
          dayjs().subtract(1, 'months').format('YYYY-MM-DD'),
          dayjs().format('YYYY-MM-DD'),
        ],
      },
    },
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
        return await getSalesReportApi(params);
      },
    },
  });
}
