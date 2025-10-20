import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createAdvancePaymentOrderApi,
  deleteAdvancePaymentOrderApi,
  getAdvancePaymentOrderPageListApi,
  updateAdvancePaymentOrderApi,
} from '@@/purchase/apis';
import { AdvancePaymentOrder } from '@@/purchase/components';

import { useCrud, withEntityParam } from '#/hooks';

export function useAdvancePaymentOrder() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'advance_payment_order_no',
      minWidth: 190,
      title: t('advance-payment-order.order-no'),
      sortable: true,
    },
    {
      field: 'vendor_name',
      minWidth: 190,
      title: t('advance-payment-order.vendor-name'),
      sortable: true,
    },
    {
      field: 'payment_time',
      minWidth: 170,
      title: t('account.orderDate'),
      align: 'right',
      sortable: true,
    },
    {
      field: 'payment_direction',
      minWidth: 140,
      title: t('account.order_dir'),
      sortable: true,
      formatter({ cellValue }) {
        return t(
          `collection-voucher.receipt_direction.${cellValue.toLocaleLowerCase()}`,
        );
      },
    },
    {
      field: 'total_amount',
      minWidth: 150,
      title: t('account.collected_amt'),
      sortable: true,
      align: 'right',
      formatter: 'formatMoney',
    },
    {
      field: 'actual_amount',
      minWidth: 140,
      title: '付款金额',
    },
        {
      field: 'remark',
      minWidth: 150,
      title: t('account.remarks'),
      sortable: true,
    },
    {
      field: 'business_type',
      minWidth: 140,
      title: t('account.businessType'),
      sortable: true,
      formatter({ cellValue }) {
        return t(
          `collection-voucher.business_type.${cellValue.toLocaleLowerCase()}`,
        );
      },
    },

    {
      field: 'review_time',
      minWidth: 170,
      title: t('account.review-time'),
      align: 'right',
      sortable: true,
    },
    {
      field: 'reviewer_name',
      minWidth: 110,
      title: t('account.reviewer'),
      sortable: true,
    },
    {
      field: 'review_status',
      minWidth: 130,
      title: t('common.review'),
      sortable: true,
      fixed: 'right',
      formatter({ cellValue }) {
        return t(`common.review_status.${cellValue}`);
      },
    },
    {
      field: 'actions',
      fixed: 'right',
      title: t('common.action'),
      minWidth: 100,
      slots: {
        default: 'operation',
      },
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
  return useCrud<any, any>({
    columns,
    toolbarConfig: {
      export: true,
      zoom: true,
      custom: true,
    },
    tabsOption: {
      defaultActiveValue: 'ALL',
      formKey: 'payment_direction',
    },
    tabs: [
      { label: '全部', value: 'ALL' },
      { label: '蓝单', value: 'POSITIVE_ORDER' },
      { label: '红单', value: 'NEGATIVE_ORDER' },
    ],

    searchFormSchema,
    batchOperate: true,
    connectedComponent: AdvancePaymentOrder,
    service: {
      query: getAdvancePaymentOrderPageListApi,
      drop: withEntityParam({ entity: 'VENDOR' })(deleteAdvancePaymentOrderApi),
      create: withEntityParam({ entity: 'VENDOR' })(
        createAdvancePaymentOrderApi,
      ),
      update: withEntityParam({ entity: 'VENDOR' })(
        updateAdvancePaymentOrderApi,
      ),
    },
  });
}
