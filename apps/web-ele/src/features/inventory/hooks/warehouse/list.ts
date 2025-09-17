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
      title: t('inventory.warehouseName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'country_name',
      title: t('inventory.country'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'address',
      title: t('inventory.address'),
      minWidth: 200,
      align: 'left',
    },
    {
      field: 'is_sale',
      title: t('inventory.defaultSale'),
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
      title: t('inventory.creationTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('inventory.creationTime'),
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
