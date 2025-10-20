import type { CustomerFeaturePageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createOrUpdateCustomizedField,
  deleteDynamicColumn,
  getPurchaseCustomizedListApi,
} from '@@/purchase/apis';

import addCustomized from '#/components/add-customized/add-customized.vue';
import { useCrud, withEntityParam } from '#/hooks';

export function useCustomerFeature() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerFeaturePageModel>[] = [
    {
      field: 'name',
      minWidth: 200,
      align: 'center',
      fixed: 'left',
      title: t('customer.name'),
    },
    {
      field: 'type',
      minWidth: 150,
      align: 'center',
      title: t('customer.type'),
      slots: { default: 'type' },
    },

    {
      field: 'is_fixed_option',
      minWidth: 100,
      align: 'center',
      title: t('customer.isFixedOption'),
    },
    {
      field: 'is_compulsory',
      minWidth: 120,
      align: 'center',
      title: t('customer.isCompulsory'),
    },
    {
      field: 'creator_name',
      minWidth: 100,
      align: 'center',
      title: t('customer.creator'),
    },
    {
      field: 'create_time',
      minWidth: 100,
      align: 'center',
      title: t('customer.creationTime'),
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
    query: withEntityParam({ entity: 'CUSTOMER' })(
      getPurchaseCustomizedListApi,
    ),
    drop: withEntityParam({ entity: 'CUSTOMER' })(deleteDynamicColumn),
    create: withEntityParam({ entity: 'CUSTOMER' })(
      createOrUpdateCustomizedField,
    ),
    update: withEntityParam({ entity: 'CUSTOMER' })(
      createOrUpdateCustomizedField,
    ),
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      id: 'feature',
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
      connectedComponent: addCustomized,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
