import type {
  CustomerInfo,
  CustomerInfoPageQueryParams,
  CustomerDrawerTransferData,
} from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getCustomerPageListApi,
  deleteCustomerDataApi,
  createCustomerDataApi,
  updateCustomerDataApi
} from '@@/customer/apis';
import { CustomerDrawerForm } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerList() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<CustomerInfo>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('customer.customer-name'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'salesman_name',
      title: t('customer.sales-man'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'contact_name',
      title: t('customer.contact-name'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'balance',
      title: t('customer.balance'),
      minWidth: 120,
      sortable: true,
      align: 'left',
      formatter: 'formatMoney',
    },
    {
      field: 'points',
      title: t('customer.points'),
      minWidth: 100,
      sortable: true,
      align: 'left',
    },
    {
      field: 'debt_amount',
      title: t('customer.debt'),
      minWidth: 100,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        return cellValue ? t('common.yes') : t('common.no');
      },
    },
    {
      field: 'vip_code',
      title: t('customer.vip-code'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_level',
      title: t('customer.vip-level'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_points_multiple',
      title: t('customer.vip-points-multiple'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_discount_percentage',
      title: t('customer.vip-discount-percentage'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_rights_expiration_date',
      title: t('customer.vip-rights-expiration-date'),
      minWidth: 250,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_other_rights',
      title: t('customer.vip-other-rights'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_begin_time',
      title: t('customer.vip-begin-time'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'label_id_list',
      title: t('customer.customer-label'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'address',
      title: t('customer.address'),
      minWidth: 200,
      sortable: true,
      align: 'left',
    },
    {
      field: 'last_order_date',
      title: t('customer.last-order-date'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'remark',
      title: t('customer.remark'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'creator_name',
      title: t('customer.creator'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('customer.creation-time'),
      minWidth: 150,
      sortable: true,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('common.operations'),
      sortable: true,
      minWidth: 180,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('customer.customer-placeholder')}}",
        clearable: true,
      },
    },
  };

  return useCrud<CustomerInfo, CustomerInfoPageQueryParams>({
    columns,
    id:"customer-list",
    searchFormSchema,
    batchOperate: true,
    connectedComponent: CustomerDrawerForm,
    service: {
      query: getCustomerPageListApi,
      drop: deleteCustomerDataApi,
      create: createCustomerDataApi,
      update: updateCustomerDataApi,
    },
  });
}
