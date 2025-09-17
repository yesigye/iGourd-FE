import type { CustomerLabelPageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getCustomerLabelPageListApi,
  deleteCustomerLabelApi,
} from '@@/customer/apis';
import { CustomerLabelDrawer } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerLabel() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerLabelPageModel>[] = [
    {
      field: 'label_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.labelName'),
      sortable: true,
    },
    {
      field: 'label_code',
      width: 150,
      align: 'left',
      title: t('customer.labelCode'),
      sortable: true,
    },
    {
      field: 'label_type',
      width: 120,
      align: 'center',
      title: t('customer.labelType'),
      sortable: true,
    },
    {
      field: 'color',
      width: 100,
      align: 'center',
      title: t('customer.color'),
      sortable: true,
    },
    {
      field: 'sort_order',
      width: 100,
      align: 'center',
      title: t('customer.sortOrder'),
      sortable: true,
    },
    {
      field: 'customer_count',
      width: 120,
      align: 'center',
      title: t('customer.customerCount'),
      sortable: true,
    },
    {
      field: 'status',
      width: 100,
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
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async ({ page_num, page_size }: { page_num: number; page_size: number }) => {
      const response = await getCustomerLabelPageListApi({ page_num, page_size });
      return {
        list: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户标签
    remove: async (data: { label_id_list: number[] }) => {
      return await deleteCustomerLabelApi(data);
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
        label_type: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('customer.labelType'),
            options: [
              { label: t('customer.labelType.category'), value: 'CATEGORY' },
              { label: t('customer.labelType.status'), value: 'STATUS' },
              { label: t('customer.labelType.level'), value: 'LEVEL' },
              { label: t('customer.labelType.behavior'), value: 'BEHAVIOR' },
              { label: t('customer.labelType.preference'), value: 'PREFERENCE' },
              { label: t('customer.labelType.other'), value: 'OTHER' },
            ],
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: CustomerLabelDrawer,
    });


  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
