import type { UnitItem, UnitParams } from '../../types/unit';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { createUnit, deleteUnit, getUnitList } from '@@/inventory/apis';
import { UnitDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useInventoryUnitList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<UnitItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('inventory.unit-name'),
      minWidth: 150,
      fixed: 'left',
    },

    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 150,
    },
    {
      field: 'create_time',
      title: t('inventory.creation-time'),
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'operation',
      title: t('inventory.action'),
      minWidth: 85,
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
        placeholder: "{{t('inventory.unit-search-placeholder')}}",
        clearable: true,
      },
    },
  };

  return useCrud<UnitItem, UnitParams>({
    columns,
    id:"inventory-unit-list",
    searchFormSchema,
    batchOperate: true,
    connectedComponent: UnitDrawer,
    service: {
      query: getUnitList,
      drop: deleteUnit,
      create: createUnit,
    },
  });
}
