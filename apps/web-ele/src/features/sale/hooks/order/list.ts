import type { SaleOrderDTO, SaleOrderRow } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useI18n } from '@igourd/locales';
// import { SaleOrderDrawer } from '@@/sale/components';

import {
  createSaleOrderApi,
  customerPageListApi,
  deleteSaleOrderApi,
  getSaleOrderListApi,
  updateSaleOrderApi,
} from '@@/sale/apis';

import { useCrud } from '#/hooks';

function remoteMethod(keywords: string) {
  return customerPageListApi({
    page_num: 1,
    page_size: 15,
    keywords,
  }).then((res) => {
    return res.list.map((item: any) => {
      return {
        ...item,
        label: item.name,
        value: item.id,
      };
    });
  });
}
export function useSaleOrder(defaultQueryParams?: Record<string, any>) {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<SaleOrderRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'order_no',
      title: t('order.order-no'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'customer_name',
      title: t('order.customer'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'order_create_time',
      title: t('order.order-date'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'total_quantity',
      title: t('order.total-qty'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'total_amount',
      title: t('order.total-amt'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'promotion_discount_amount',
      title: t('order.discount'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'other_tax_amount',
      title: t('order.tax'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'round_down_amount',
      title: t('order.wipe'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter:
            '{{row.total_amount ? `¥${row.total_amount.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'subtotal_amount',
      title: t('order.actuaily-paid'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'actuaily_received',
      title: t('order.tendered'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'cash_change_amount',
      title: t('order.give-change'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'status',
      title: t('order.status'),
      width: 100,
      align: 'center',
      slots: { default: 'status' },
    },
    {
      field: 'create_time',
      title: t('common.creation-time'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      width: 300,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];
  const defaultTime = ref<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
  ]);
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
        defaultTime: defaultTime.value,
      },
    },
    customer_id: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'RemoteSelect',
      'x-component-props': {
        placeholder: "{{t('order.customer')}}",
        clearable: true,
        style: {
          width: '160px',
        },
        remoteMethod,
      },
    },
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('order.placeholder-order')}}",
        clearable: true,
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
    id: 'sale_order_export',
    searchFormSchema,
    tabs: [
      { value: 'ORDINARY_ORDER', label: t('order.ordinary-order') },
      { value: 'CREDIT_SALES', label: t('order.credit-sales') },
    ],
    tabsOption: {
      defaultActiveValue: 'ORDINARY_ORDER',
      formKey: 'type',
    },

    toolbarConfig: {
      export: true,
    },
    params: defaultQueryParams ?? {},
    batchOperate: true,
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
      drop: deleteSaleOrderApi,
      create: createSaleOrderApi,
      update: updateSaleOrderApi,
    },
  });
  return {
    ...crud,
    columns,
  };
}
