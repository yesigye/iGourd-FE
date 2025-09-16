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
      field: 'code',
      title: t('inventory.warehouseCode'),
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
      field: 'contact_person',
      title: t('inventory.contactPerson'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'contact_phone',
      title: t('inventory.contactPhone'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'status',
      title: t('inventory.status'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'ElSwitch',
        props: {
          modelValue: '{{row.status === "active"}}',
          activeValue: 'active',
          inactiveValue: 'inactive',
          onChange: '{{$event => handleStatusChange(row, $event)}}',
        },
      },
    },
    {
      field: 'create_time',
      title: t('common.createTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operation'),
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
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.status')}}",
        clearable: true,
        options: [
          { label: t('inventory.statusOptions.active'), value: 'active' },
          { label: t('inventory.statusOptions.inactive'), value: 'inactive' },
        ],
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
