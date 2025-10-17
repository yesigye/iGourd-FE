import type { SaleOrderDTO, SaleOrderRow } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getPurchaseOrderPageListApi } from '@@/purchase/apis';
// import { SaleOrderDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function usePurchaseOrderList(defaultQueryParams?: Record<string, any>) {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<SaleOrderRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'purchase_order_no',
      minWidth: 180,
      align: 'left',
      title: t('order.purchase-order-no'),
    },
    {
      field: 'purchase_date',
      minWidth: 200,
      align: 'left',
      title: t('order.purchase-date'),
    },
    {
      field: 'vendor_name',
      minWidth: 200,
      align: 'left',
      title: t('order.vendor-name'),
    },
    {
      field: 'warehouse_name',
      minWidth: 150,
      align: 'center',
      title: t('order.warehouse'),
    },
    {
      field: 'status',
      minWidth: 150,
      align: 'center',

      title: t('common.now-status'),
      formatter({ cellValue }) {
        return t(`purchase.${cellValue}`);
      },
    },
    {
      field: 'total_amount',
      minWidth: 150,
      align: 'center',
      title: t('order.total-amount'),
    },
    {
      field: 'deposit_amount',
      minWidth: 150,
      align: 'center',
      title: t('purchase.deposit'),
    },
    {
      field: 'cumulative_deposit_amount',
      minWidth: 150,
      align: 'center',
      title: t('order.cumulative-deposit'),
    },
    {
      field: 'unpaid_amount',
      minWidth: 150,
      align: 'center',
      title: t('order.balance'),
    },
    {
      field: 'creator_name',
      minWidth: 150,
      align: 'center',
      title: t('purchase.creator'),
    },
    {
      field: 'create_time',
      minWidth: 150,
      align: 'center',
      title: t('order.creation-time'),
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
        return await getPurchaseOrderPageListApi(params);
      },
    },
  });
  return {
    ...crud,
    columns,
  };
}
