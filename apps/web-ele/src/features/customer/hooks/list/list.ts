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
      title: t('customer.customerName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'salesman_name',
      title: t('customer.salesman'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'contact_name',
      title: t('customer.contact_name'),
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
      title: t('customer.vipCode'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_level',
      title: t('customer.vipLevel'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_points_multiple',
      title: t('customer.vipPointsMultiple'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_discount_percentage',
      title: t('customer.vipDiscountPercentage'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_rights_expiration_date',
      title: t('customer.vipRightsExpirationDate'),
      minWidth: 250,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_other_rights',
      title: t('customer.vipOtherRights'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'vip_begin_time',
      title: t('customer.vipBeginTime'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'label_id_list',
      title: t('customer.customerLabel'),
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
      title: t('customer.lastOrderDate'),
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
      title: t('customer.creationTime'),
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
        placeholder: "{{t('customer.customerPlaceholder')}}",
        clearable: true,
      },
    },
  };

  return useCrud<CustomerInfo, CustomerInfoPageQueryParams>({
    columns,
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
