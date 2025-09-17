import type { CustomerIntegralPageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getCustomerIntegralPageListApi,
  deleteCustomerIntegralApi,
} from '@@/customer/apis';
import { CustomerIntegralDrawer } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerIntegral() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerIntegralPageModel>[] = [
    {
      field: 'customer_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.customerName'),
      sortable: true,
    },
    {
      field: 'integral_type',
      width: 120,
      align: 'center',
      title: t('customer.integralType'),
      sortable: true,
    },
    {
      field: 'points',
      width: 120,
      align: 'right',
      title: t('customer.points'),
      sortable: true,
    },
    {
      field: 'status',
      width: 120,
      align: 'center',
      title: t('customer.status'),
      sortable: true,
    },
    {
      field: 'description',
      width: 200,
      align: 'left',
      title: t('customer.description'),
      sortable: true,
    },
    {
      field: 'earn_date',
      width: 150,
      align: 'center',
      title: t('customer.earnDate'),
      sortable: true,
    },
    {
      field: 'expire_date',
      width: 150,
      align: 'center',
      title: t('customer.expireDate'),
      sortable: true,
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('customer.creatorName'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('customer.createTime'),
      sortable: true,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async ({ page_num, page_size }: { page_num: number; page_size: number }) => {
      const response = await getCustomerIntegralPageListApi({ page_num, page_size });
      return {
        list: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户积分
    remove: async (data: { integral_id_list: number[] }) => {
      return await deleteCustomerIntegralApi(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('customer.searchPlaceholder'),
          },
        },
        integral_type: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('customer.integralType'),
            options: [
              { label: t('customer.integralType.earn'), value: 'EARN' },
              { label: t('customer.integralType.spend'), value: 'SPEND' },
              { label: t('customer.integralType.expire'), value: 'EXPIRE' },
              { label: t('customer.integralType.adjust'), value: 'ADJUST' },
              { label: t('customer.integralType.refund'), value: 'REFUND' },
            ],
          },
        },
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('customer.status'),
            options: [
              { label: t('customer.status.active'), value: 'ACTIVE' },
              { label: t('customer.status.expired'), value: 'EXPIRED' },
              { label: t('customer.status.used'), value: 'USED' },
              { label: t('customer.status.cancelled'), value: 'CANCELLED' },
            ],
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: CustomerIntegralDrawer,
    });


  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
