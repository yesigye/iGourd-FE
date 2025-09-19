import type {
  CustomerInfo,
  CustomerInfoPageQueryParams,
} from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getIntegralLogList } from '@@/customer/apis';
import { CustomerDrawerForm } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useIntegralLogList() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<CustomerInfo>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'change_type',
      title: t('customer.changeType'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'customer_name',
      title: t('customer.customer'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'order_id',
      title: t('customer.relatedOrders'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'total_amount',
      title: t('customer.amount'),
      minWidth: 120,
      sortable: true,
      align: 'left',
      formatter: 'formatMoney',
    },
    {
      field: 'origin_points',
      title: t('customer.originalValueOfPoints'),
      minWidth: 100,
      sortable: true,
      align: 'left',
    },
    {
      field: 'change_points',
      title: t('customer.changeValue'),
      minWidth: 100,
      sortable: true,
      align: 'left',
    },
    {
      field: 'final_points',
      title: t('customer.afterTheChange'),
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
    batchOperate: false,
    connectedComponent: CustomerDrawerForm,
    service: {
      query: getIntegralLogList,
    },
  });
}
