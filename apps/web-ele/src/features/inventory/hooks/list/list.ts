import type { InventoryRow, InventoryUpdateDTO } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getInventoryListApi } from '@@/inventory/apis';
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
      field: 'profile_photo',
      title: t('inventory.productName'),
      minWidth: 150,
      fixed: 'left',
      sortable: true,
      align: 'left',
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'major_name',
      title: t('inventory.major_name'),
      minWidth: 180,
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
      field: 'spec_code',
      title: t('inventory.spec_code'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'sku_barcode',
      title: t('inventory.sku_barcode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'product_unit_names',
      title: t('inventory.product_unit_names'),
      width: 100,
      align: 'right',
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse_name'),
      width: 100,
      align: 'right',
    },
    {
      field: 'stock_quantity_message',
      title: t('inventory.stock'),
      width: 120,
      slots: { default: 'tooltip' },
    },
    {
      field: 'stock_quantity',
      title: t('inventory.stock_quantity_message'),
      width: 120,
      align: 'right',
    },
    {
      field: 'inbound_in_transit_stock_message',
      title: t('inventory.inboundTransitStock'),
      minWidth: 120,
      align: 'center',
      slots: { default: 'tooltipNum' },
    },
    {
      field: 'outbound_in_transit_stock_message',
      title: t('inventory.outboundTransitStock'),
      minWidth: 120,
      align: 'center',
      slots: { default: 'tooltipNum' },
    },
    {
      field: 'product_group_name',
      title: t('inventory.productGroup'),
      minWidth: 120,
      align: 'center',
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 120,
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
      title: t('common.operations'),
      width: 180,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    product_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-decorator-props': {
      },
      'x-component-props': {
        placeholder: "{{t('inventory.productName')}}",
        clearable: true,
      },
    },
    product_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-decorator-props': {
      },
      'x-component-props': {
        placeholder: "{{t('inventory.productCode')}}",
        clearable: true,
      },
    },
    warehouse_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-decorator-props': {
      },
      'x-component-props': {
        placeholder: "{{t('inventory.warehouseName')}}",
        clearable: true,
      },
    },
    warehouse_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-decorator-props': {
      },
      'x-component-props': {
        placeholder: "{{t('list.warehouse-code')}}",
        clearable: true,
      },
    },
  };

  return useCrud<InventoryRow, InventoryUpdateDTO>({
    columns,
    id:"inventory-stock-list",
    searchFormSchema,
    batchOperate: true,
    connectedComponent: InventoryDrawer,
    toolbarConfig: {
      export: true,
      print: false,
      import: false,
    },
    service: {
      query: getInventoryListApi,
    },
  });
}
