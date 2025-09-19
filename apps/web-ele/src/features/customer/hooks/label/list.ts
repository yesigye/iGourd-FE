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
      field: 'name',
      minWidth: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.customerLabelName'),
      sortable: true,
    },
    {
      field: 'creator_name',
      minWidth: 150,
      align: 'left',
      title: t('customer.creator'),
      sortable: true,
    },
    {
      field: 'create_time',
      minWidth: 100,
      align: 'center',
      title: t('customer.creationTime'),
      sortable: true,
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

  // 服务函数
  const service = {
    // 获取列表数据
    query: getCustomerLabelPageListApi,

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
              {
                label: t('customer.labelType.preference'),
                value: 'PREFERENCE',
              },
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
