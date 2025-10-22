import type { CustomizedDTO, CustomizedRow } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createPaymentOrderApi,
  deletePaymentOrderApi,
  getPaymentOrderPageListApi,
  updatePaymentOrderApi,
} from '@@/purchase/apis';

import addCustomized from '#/components/add-customized/add-customized.vue';
import { useCrud, withEntityParam } from '#/hooks';

export function usePaymentOrder() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<CustomizedRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('payment-order.order-no'),
      minWidth: 170,
      sortable: true,
      align: 'center',
      filters: [{ label: 'test', value: 'test' }],
    },
    {
      field: 'type',
      title: t('payment-order.vendor-name'),
      minWidth: 120,
      sortable: true,
      align: 'center',
      formatter: ({ cellValue }) => {
        if (cellValue === 'SELECT') return t('purchase.select');
        return t('purchase.input');
      },
    },
    {
      field: 'is_fixed_option',
      title: t('payment-order.order-date'),
      minWidth: 200,
      sortable: true,
      align: 'center',
      formatter: ({ cellValue }) => {
        if (cellValue) return t('purchase.fixed');
        return t('purchase.user-created');
      },
    },
    {
      field: 'is_compulsory',
      title: t('payment-order.payment-amount'),
      minWidth: 150,
      sortable: true,
      align: 'center',
      formatter: ({ cellValue }) => {
        if (cellValue) return t('purchase.yes');
        return t('purchase.no');
      },
    },
    {
      field: 'creator_name',
      title: t('payment-order.order-dir'),
      minWidth: 180,
      sortable: true,
      align: 'center',
    },
    {
      field: 'create_time',
      title: t('payment-order.business-type'),
      sortable: true,
      align: 'center',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'create_time',
      title: t('payment-order.account-type'),
      sortable: true,
      align: 'center',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'create_time',
      title: t('payment-order.data-source'),
      sortable: true,
      align: 'center',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'create_time',
      title: t('payment-order.service-fee'),
      sortable: true,
      align: 'center',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'create_time',
      title: t('payment-order.remarks'),
      sortable: true,
      align: 'center',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'create_time',
      title: t('payment-order.payment-information'),
      align: 'center',
      minWidth: 180,
      formatter: 'formatDateTime',
      children: [
        {
          field: 'payment_account',
          title: t('payment-order.payment-account'),
          sortable: true,
          align: 'center',
          minWidth: 180,
          formatter: 'formatDateTime',
        },
        {
          field: 'payment_method',
          title: t('payment-order.payment-method'),
          sortable: true,
          align: 'center',
          minWidth: 180,
          formatter: 'formatDateTime',
        },
        {
          field: 'payment_amount',
          title: t('payment-order.payment-amount'),
          sortable: true,
          align: 'center',
          minWidth: 180,
          formatter: 'formatDateTime',
        },
        {
          field: 'service_fee',
          title: t('payment-order.service-fee'),
          sortable: true,
          align: 'center',
          minWidth: 180,
          formatter: 'formatDateTime',
        },
      ],
    },
    {
      field: 'review',
      title: t('payment-order.review'),
      sortable: true,
      align: 'center',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('purchase.operation'),
      sortable: true,
      minWidth: 180,
      slots: { default: 'operation' },
    },
  ];
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
  };
  return useCrud<CustomizedRow, CustomizedDTO>({
    columns,
    id:"purchase-payment-order-list",
    toolbarConfig: {
      export: true,
      zoom: true,
      custom: true,
    },
    searchFormSchema,
    batchOperate: true,
    connectedComponent: addCustomized,
    service: {
      query: withEntityParam({ entity: 'VENDOR' })(getPaymentOrderPageListApi),
      drop: withEntityParam({ entity: 'VENDOR' })(deletePaymentOrderApi),
      create: withEntityParam({ entity: 'VENDOR' })(createPaymentOrderApi),
      update: withEntityParam({ entity: 'VENDOR' })(updatePaymentOrderApi),
    },
  });
}
