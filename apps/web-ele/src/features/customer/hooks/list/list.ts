import type { CustomerInfo, CustomerInfoPageQueryParams, CustomerDrawerTransferData } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getCustomerListApi,
  deleteCustomerApi,
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
      field: 'code',
      title: t('customer.customer_code'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'name',
      title: t('customer.customer_name'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'phone_number',
      title: t('customer.phone_number'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'email',
      title: t('customer.email'),
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
      field: 'is_vip',
      title: t('customer.is_vip'),
      minWidth: 100,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        return cellValue ? t('common.yes') : t('common.no');
      },
    },
    {
      field: 'vip_level_name',
      title: t('customer.vip_level'),
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
      title: t('customer.create_time'),
      minWidth: 150,
      sortable: true,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('customer.operation'),
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
      query: getCustomerListApi,
      drop: deleteCustomerApi,
    },
  });
}
