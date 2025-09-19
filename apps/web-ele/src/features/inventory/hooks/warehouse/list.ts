import type { WarehouseDTO, WarehouseRow } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createWarehouseApi,
  deleteWarehouseApi,
  getWarehouseListApi,
  updateWarehouseApi,
} from '@@/inventory/apis';
import { WarehouseDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useWarehouse() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<WarehouseRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('warehouse.warehouse-name'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'country_name',
      title: t('warehouse.country'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'address',
      title: t('warehouse.address'),
      minWidth: 200,
      align: 'left',
    },
    {
      field: 'is_sale',
      title: t('warehouse.default-sale'),
      minWidth: 200,
      align: 'left',
    },
    {
      field: 'creator_name',
      title: t('common.creator'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'create_time',
      title: t('common.creation-time'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operations'),
      width: 120,
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

  return useCrud<WarehouseRow, WarehouseDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: WarehouseDrawer,
    service: {
      query: getWarehouseListApi,
      drop: deleteWarehouseApi,
      create: createWarehouseApi,
      update: updateWarehouseApi,
    },
  });
}
