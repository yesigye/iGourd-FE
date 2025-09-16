import type { InventoryRow, InventoryUpdateDTO } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  batchUpdateInventoryApi,
  getInventoryListApi,
  updateInventoryApi,
} from '@@/inventory/apis';
import { InventoryDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useInventory() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<InventoryRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'product_name',
      title: t('inventory.productName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouseName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'warehouse_code',
      title: t('inventory.warehouseCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'quantity',
      title: t('inventory.quantity'),
      width: 100,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.quantity || 0}}',
        },
      },
    },
    {
      field: 'available_quantity',
      title: t('inventory.availableQuantity'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.available_quantity || 0}}',
        },
      },
    },
    {
      field: 'reserved_quantity',
      title: t('inventory.reservedQuantity'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.reserved_quantity || 0}}',
        },
      },
    },
    {
      field: 'unit',
      title: t('inventory.unit'),
      width: 80,
      align: 'center',
    },
    {
      field: 'last_update_time',
      title: t('inventory.lastUpdateTime'),
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
    product_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.productName')}}",
        clearable: true,
      },
    },
    product_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.productCode')}}",
        clearable: true,
      },
    },
    warehouse_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.warehouseName')}}",
        clearable: true,
      },
    },
    warehouse_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.warehouseCode')}}",
        clearable: true,
      },
    },
  };

  return useCrud<InventoryRow, InventoryUpdateDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: InventoryDrawer,
    service: {
      query: getInventoryListApi,
      update: updateInventoryApi,
    },
  });
}
