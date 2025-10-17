import type { CustomizedDTO, CustomizedRow } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createAdvancePaymentOrderApi,
  deleteAdvancePaymentOrderApi,
  getAdvancePaymentOrderPageListApi,
  updateAdvancePaymentOrderApi,
} from '@@/purchase/apis';
import { CustomizedDrawerForm } from '@@/purchase/components';

import { useCrud, withEntityParam } from '#/hooks';

export function useAdvancePaymentOrder() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<CustomizedRow>[] = [
    {
      field: 'receipt_order_no',
      minWidth: 190,
      title: t('account.receipt_order_no'),
      sortable: true,
    },
    {
      field: 'customer_name',
      minWidth: 190,
      title: t('printTemp.printReceipt.receipt_customer_name'),
      sortable: true,
    },
    {
      field: 'receipt_time',
      minWidth: 170,
      title: t('account.orderDate'),
      align: 'right',
      sortable: true,
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
      field: 'receipt_direction',
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
      field: 'ledger_type',
      minWidth: 130,
      title: t('account.accountType'),
      sortable: true,
      formatter({ cellValue }) {
        return t(
          `collection-voucher.ledger_type_enum.${cellValue.toLocaleLowerCase()}`,
        );
      },
    },
    {
      field: 'remark',
      minWidth: 150,
      title: t('account.remarks'),
      sortable: true,
    },
    {
      field: 'review_time',
      minWidth: 170,
      title: t('account.review_time'),
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
  return useCrud<CustomizedRow, CustomizedDTO>({
    columns,
    toolbarConfig: {
      export: true,
      zoom: true,
      custom: true,
    },
    tabsOption: {
      defaultActiveValue: '蓝单',
      formKey: 'type',
    },
    tabs: [
      { label: '红单', value: '红单' },
      { label: '蓝单', value: '蓝单' },
    ],

    searchFormSchema,
    batchOperate: true,
    connectedComponent: CustomizedDrawerForm,
    service: {
      query: withEntityParam({ entity: 'VENDOR' })(
        getAdvancePaymentOrderPageListApi,
      ),
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
