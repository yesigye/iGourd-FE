import type {
  ProductFeatureItem,
  ProductFeatureParams,
} from '@@/inventory/types';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import { useI18n } from '@igourd/locales';
import {
  getDynamicColumnList,
  createDynamicColumn,
  updateDynamicColumn,
  deleteDynamicColumn,
} from '@@/inventory/apis';

import { FeatureDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useInventoryProductFeatureList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<ProductFeatureItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('inventory.name'),
      minWidth: 200,
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'type',
      title: t('inventory.type'),
      minWidth: 160,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue === 'SELECT'
          ? t('inventory.select')
          : t('inventory.input');
      },
    },
    {
      field: 'is_fixed_option',
      title: t('inventory.selectionType'),
      minWidth: 165,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? t('inventory.userCreated') : t('inventory.fixed');
      },
    },
    {
      field: 'is_compulsory',
      title: t('inventory.compulsory'),
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? 'Yes' : 'No';
      },
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'create_time',
      title: t('inventory.creationTime'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('common.action'),
      minWidth: 180,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
  };

  return useCrud<ProductFeatureItem, ProductFeatureParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: FeatureDrawer,
    service: {
      query: getDynamicColumnList,
      create: createDynamicColumn,
      update: updateDynamicColumn,
      drop: deleteDynamicColumn,
    },
  });
}
