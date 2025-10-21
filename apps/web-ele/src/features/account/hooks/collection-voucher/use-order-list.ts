import type { SaleOrderDTO, SaleOrderRow } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getSaleOrderListApi,
} from '@@/sale/apis';
// import { SaleOrderDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function useOrderList(defaultQueryParams?: Record<string, any>) {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<SaleOrderRow>[] = [
    {
      title: '',
      type: 'checkbox',
      fixed: 'left',
    },
    {
      field: 'order_create_time',
      minWidth: 200,
      title: t('account.order-date'),
    },
    {
      field: 'order_no',
      minWidth: 200,
      title: t('printTemp.order_no'),
    },
    {
      field: 'subtotal_amount',
      minWidth: 200,
      title: t('account.total-amount'),
    },
    {
      field: 'round_down_amount',
      minWidth: 200,
      title: t('printTemp.wipe'),
    },
    {
      field: 'total_amount',
      minWidth: 200,
      title: t('account.transaction-amount'),
    },
    {
      field: 'customer_name',
      minWidth: 200,
      title: t('account.customer'),
    },
    {
      field: 'currency_code',
      minWidth: 200,
      title: t('account.currency'),
    },
    {
      field: 'exchange_rate',
      minWidth: 200,
      title: t('account.exchange-rate'),
    },
    {
      field: 'creator_name',
      title: t('account.creator'),
      minWidth: 200,
    },
    {
      field: 'create_time',
      minWidth: 200,
      title: t('account.create-time'),
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('order.order-no')}}",
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
  interface SaleOrderQueryParams {
    page_num: number;
    page_size: number;
    date_range?: string[];
    start_create_time?: string;
    end_create_time?: string;
  }
  const crud = useCrud<SaleOrderRow, SaleOrderDTO>({
    columns,
    searchFormSchema,
    id:'order-list',
    params: defaultQueryParams ?? {},
    batchOperate: false,
    service: {
      query: async (data: {
        date_range?: string[];
        page_num: number;
        page_size: number;
      }) => {
        const params: SaleOrderQueryParams = { ...data };
        if (data.date_range && data.date_range.length > 0) {
          params.start_create_time = `${data.date_range[0]} 00:00:00`;
          params.end_create_time = `${data.date_range[1]} 23:59:59`;
        }
        return await getSaleOrderListApi(params);
      },
    },
  });
  return {
    ...crud,
    columns,
  };
}
