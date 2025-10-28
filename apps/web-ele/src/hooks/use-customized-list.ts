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

export function useCustomizedFeature(type: string) {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerFeaturePageModel>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      minWidth: 200,
      align: 'center',
      fixed: 'left',
      title: t('add-customized.name'),
    },
    {
      field: 'type',
      minWidth: 150,
      align: 'center',
      title: t('add-customized.type'),
      formatter: ({ cellValue })=>{
        return cellValue.label;
      },
    },

    {
      field: 'is_fixed_option',
      minWidth: 100,
      align: 'center',
      title: t('add-customized.is-fixed-option'),
      slots: { default: 'is_fixed_option' },
    },
    {
      field: 'is_compulsory',
      minWidth: 120,
      align: 'center',
      title: t('add-customized.is-compulsory'),
      slots: { default: 'is_compulsory' },
    },
    {
      field: 'creator_name',
      minWidth: 100,
      align: 'center',
      title: t('add-customized.creator'),
    },
    {
      field: 'create_time',
      minWidth: 100,
      align: 'center',
      title: t('add-customized.creation-time'),
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
    query: withEntityParam({ entity: type })(getPurchaseCustomizedListApi),
    drop: withEntityParam({ entity: type })(deleteDynamicColumn),
    create: withEntityParam({ entity: type })(createOrUpdateCustomizedField),
    update: withEntityParam({ entity: type })(createOrUpdateCustomizedField),
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete,handleDelete,handleView} =
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
            placeholder: t('add-customized.search-placeholder'),
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
    handleDelete,
    handleView
  };
}
