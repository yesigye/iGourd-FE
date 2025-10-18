import type { CustomerAccountPageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deleteCustomerAccountApi,
  getCustomerAccountPageListApi,
} from '@@/customer/apis';
import { AccountDrawer } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerAccount() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerAccountPageModel>[] = [
    {
      field: 'customer_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customers.customerName'),
      sortable: true,
    },
    {
      field: 'phone_no',
      width: 200,
      align: 'left',
      title: t('customers.phoneNumber'),
      sortable: true,
    },
    {
      field: 'type',
      width: 200,
      align: 'left',
      title: t('customers.accountType'),
      sortable: true,
    },
    {
      field: 'revenue',
      width: 200,
      align: 'left',
      title: t('customers.revenue'),
      sortable: true,
    },
    {
      field: 'expenditures',
      width: 200,
      align: 'left',
      title: t('customers.expenditures'),
      sortable: true,
    },
    {
      field: 'date',
      width: 200,
      align: 'left',
      title: t('customers.accountDate'),
      sortable: true,
    },
    {
      field: 'remark',
      width: 100,
      align: 'left',
      title: t('customers.remark'),
      sortable: true,
    },
    {
      field: 'transaction_number',
      width: 200,
      align: 'left',
      title: t('customers.transactionNumber'),
      sortable: true,
    },
    {
      field: 'balance',
      width: 100,
      align: 'left',
      title: t('customers.balance'),
      sortable: true,
    },
    {
      field: 'creator',
      width: 100,
      align: 'left',
      title: t('customers.creator'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 200,
      align: 'center',
      fixed: 'right',
      title: t('customers.creationTime'),
      sortable: true,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async ({
      page_num,
      page_size,
    }: {
      page_num: number;
      page_size: number;
    }) => {
      const response = await getCustomerAccountPageListApi({
        page_num,
        page_size,
      });
      return {
        list: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户账户
    remove: async (data: { account_id_list: number[] }) => {
      return await deleteCustomerAccountApi(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      id: 'account',
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('customers.search'),
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: AccountDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
