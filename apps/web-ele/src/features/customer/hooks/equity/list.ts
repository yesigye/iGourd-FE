import type { CustomerEquityPageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getCustomerEquityPageListApi } from '@@/customer/apis';
import { CustomerEquityDrawer } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerEquity() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerEquityPageModel>[] = [
    {
      field: 'customer_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.customerName'),
    },
    {
      field: 'equity_type',
      width: 150,
      align: 'center',
      title: t('customer.equityType'),
    },
    {
      field: 'equity_value',
      width: 120,
      align: 'right',
      title: t('customer.equityValue'),
    },
    {
      field: 'equity_unit',
      width: 100,
      align: 'center',
      title: t('customer.equityUnit'),
    },
    {
      field: 'description',
      width: 250,
      align: 'left',
      title: t('customer.description'),
    },
    {
      field: 'granted_date',
      width: 150,
      align: 'center',
      title: t('customer.grantedDate'),
    },
    {
      field: 'expiry_date',
      width: 150,
      align: 'center',
      title: t('customer.expiryDate'),
    },
    {
      field: 'status',
      width: 120,
      align: 'center',
      title: t('customer.status'),
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('customer.creatorName'),
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('customer.createTime'),
    },
  ];

  // 服务函数
  const service = {
    query: getCustomerEquityPageListApi,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'input',
          name: 'keywords',
          title: t('customer.keywords'),
          'x-component-props': {
            placeholder: t('customer.keywordsPlaceholder'),
          },
        },
      },
      connectedComponent: CustomerEquityDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
