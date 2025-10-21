import type { InventoryRow, InventoryUpdateDTO } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getStockWarningPageListApi } from '@@/inventory/apis';
import { InventoryDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useStockWarningTable() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<InventoryRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'product_code',
      title: t('common.image'),
      minWidth: 150,
      fixed: 'left',
      sortable: true,
      align: 'center',
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'product_name',
      title: t('stock-warning-table.product-name'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'product_spec_name',
      title: t('stock-warning-table.spec'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'product_group_name',
      title: t('stock-warning-table.category'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'major_unit_name',
      title: t('stock-warning-table.major-unit'),
      minWidth: 150,
      sortable: true,
      align: 'center',
    },
    {
      field: 'product_unit_name',
      title: t('stock-warning-table.unit'),
      width: 100,
      align: 'center',
    },
    {
      field: 'stock_warning_quantity_minimum',
      title: t('stock-warning-table.min-stock'),
      width: 100,
      align: 'center',
    },
    {
      field: 'stock_warning_quantity_safety',
      title: t('stock-warning-table.safety-stock'),
      width: 120,
    },
    {
      field: 'stock_warning_quantity_maximum',
      title: t('stock-warning-table.max-stock'),
      width: 120,
      align: 'center',
    },
    {
      field: 'stock_quantity',
      title: t('stock-warning-table.immediate-stock'),
      width: 180,
      align: 'center',
    },
    {
      field: 'inbound_in_transit_stock',
      title: t('stock-warning-table.inbound-in-transit-stock'),
      width: 180,
      align: 'center',
    },
    {
      field: 'below_min_count',
      title: t('stock-warning-table.min-stock-shortage-qty'),
      width: 180,
      align: 'center',
    },
    {
      field: 'below_safety_count',
      title: t('stock-warning-table.safety-stock-shortage-qty'),
      width: 180,
      align: 'center',
    },
    {
      field: 'above_max_count',
      title: t('stock-warning-table.max-stock-shortage-qty'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'suggested_purchase_qty',
      title: t('stock-warning-table.suggested-purchase-qty'),
      width: 160,
      sortable: true,
      align: 'center',
    },
  ];

  const searchFormSchema = {
    product_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-decorator-props': {
        style: { 'margin-bottom': '0', width: '140px' },
      },
      'x-component-props': {
        placeholder: "{{t('stock-warning-table.stock-warning')}}",
        clearable: true,
        options: [
          {
            label: t('stock-warning-table.product-name'),
            value: 'product_name',
          },
          {
            label: t('stock-warning-table.product-code'),
            value: 'product_code',
          },
        ],
      },
    },
    keyworks: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-decorator-props': {
        style: { 'margin-bottom': '0', width: '300px' },
      },
      'x-component-props': {
        placeholder:
          "{{t('stock-warning-table.enter-product-code-product-name')}}",
        clearable: true,
      },
    },
  };

  return useCrud<InventoryRow, InventoryUpdateDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    id:"inventory-stock-warning-table",
    connectedComponent: InventoryDrawer,
    service: {
      query: getStockWarningPageListApi,
    },
  });
}
