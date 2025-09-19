import type { CustomerFeaturePageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getCustomerFeaturePageListApi,
  deleteCustomerFeatureApi,
} from '@@/customer/apis';
import { CustomerFeatureDrawer } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerFeature() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerFeaturePageModel>[] = [
    {
      field: 'name',
      minWidth: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.name'),
      sortable: true,
    },
    {
      field: 'type',
      minWidth: 150,
      align: 'left',
      title: t('customer.type'),
      sortable: true,
    },
    {
      field: 'feature_type',
      minWidth: 120,
      align: 'center',
      title: t('customer.featureType'),
      sortable: true,
    },
    {
      field: 'is_fixed_option',
      minWidth: 100,
      align: 'center',
      title: t('customer.isFixedOption'),
      sortable: true,
    },
    {
      field: 'is_compulsory',
      minWidth: 120,
      align: 'center',
      title: t('customer.isCompulsory'),
      sortable: true,
    },
    {
      field: 'creator_name',
      minWidth: 100,
      align: 'center',
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
      field: 'operations',
      minWidth: 100,
      align: 'center',
      fixed: 'right',
      title: t('common.operations'),
      slots: { default: 'operations' },
    },
  ];

  // 服务函数
  const service = {
    query: getCustomerFeaturePageListApi,
    remove: async (data: { feature_id_list: number[] }) => {
      return await deleteCustomerFeatureApi(data);
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
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: CustomerFeatureDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
