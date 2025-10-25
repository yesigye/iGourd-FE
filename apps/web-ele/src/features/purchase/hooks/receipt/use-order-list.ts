// 选择预支付单 弹窗表格  2025年10月24日17:03:07

import type { SaleOrderDTO, SaleOrderRow } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getAdvancePaymentOrderPageListApi,
} from '@@/purchase/apis';
// import { SaleOrderDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function usePreOrderList(defaultQueryParams?: Record<string, any>) {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<SaleOrderRow>[] = [
    {
      title: '',
      type: 'checkbox',
      fixed: 'left',
    },
     {
      field: 'amout',
      minWidth: 200,
      title: t("receipt.settle-amount"),
      editRender: { name: 'input' },
    },
    {
      field: 'payment_time',
      minWidth: 200,
      title: t('receipt.order-date'),
    },
    {
      field: 'advance_payment_order_no',
      minWidth: 200,
      title: t('print-temp.order-no'),
    },
    {
      field: 'total_amount',
      minWidth: 200,
      title: t('receipt.transaction-amount'),
    },
    {
      field: 'remaining_amount',
      minWidth: 200,
      title: t('receipt.remaining-amount'),
    },
    {
      field: 'used_amount',
      minWidth: 200,
      title: t('receipt.used-amount'),
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
        return await getAdvancePaymentOrderPageListApi(params);
      },
    },
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      beforeEditMethod({ row }) {
        return true;
      },
    },
  });
  return {
    ...crud,
    columns,
  };
}
