import type {
  InventoryChangeLogItem,
  InventoryChangeLogParams,
} from '../../types/change';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getInventoryChangeLogList } from '@@/inventory/apis';

import { useCrud } from '#/hooks';

export function useInventoryChangeList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<InventoryChangeLogItem>[] = [
    {
      field: 'change_type',
      title: t('inventory.change-type'),
      minWidth: 164,
      fixed: 'left',
      formatter: ({ cellValue }) => t(`inventory.${cellValue}`),
    },
    {
      field: 'receipt_no',
      title: t('inventory.receipt-number'),
      minWidth: 176,
    },
    {
      field: 'product_name',
      title: t('inventory.product-name'),
      minWidth: 240,
    },
    {
      field: 'product_code',
      title: t('inventory.product-code'),
      minWidth: 150,
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse'),
      minWidth: 150,
    },
    {
      field: 'product_unit_name',
      title: t('inventory.warehouse'),
      minWidth: 150,
    },
    {
      field: 'change_quantity',
      title: t('inventory.change-quantity'),
      minWidth: 180,
      formatter: ({ row }) => `${row.change_quantity} ${row.product_unit_name}`,
    },
    {
      field: 'origin_quantity',
      title: t('inventory.pre-changed-quantity'),
      minWidth: 180,
      formatter: ({ row }) => `${row.origin_quantity} ${row.product_unit_name}`,
    },
    {
      field: 'final_quantity',
      title: t('inventory.post-changed-quantity'),
      minWidth: 180,
      formatter: ({ row }) => `${row.final_quantity} ${row.product_unit_name}`,
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 200,
    },
    {
      field: 'create_time',
      title: t('inventory.creation-time'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime',
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.please-enter-keywords')}}",
        clearable: true,
      },
    },
    change_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.change-type')}}",
        clearable: true,
        options: [
          { label: t('inventory.point_exchange'), value: 'POINT_EXCHANGE' },
          { label: t('inventory.stock_unpack'), value: 'STOCK_UNPACK' },
          { label: t('inventory.goods_receipt'), value: 'GOODS_RECEIPT' },
          {
            label: t('inventory.cancel_stock_count'),
            value: 'CANCEL_PHYSICAL_STOCK_TAKE',
          },
          {
            label: t('inventory.cancel_stock_consumption'),
            value: 'CANCEL_STOCK_CONSUMPTION',
          },
          { label: t('inventory.edit_stock'), value: 'EDIT_STOCK' },
          {
            label: t('inventory.stock_transfer_out'),
            value: 'STOCK_TRANSFER_OUT',
          },
          { label: t('inventory.sales_dispatch'), value: 'SALES_DISPATCH' },
          {
            label: t('inventory.stock_transfer_out_cancel'),
            value: 'STOCK_TRANSFER_OUT_CANCEL',
          },
          { label: t('inventory.sales_returned'), value: 'SALES_RETURNED' },
          { label: t('inventory.stock_pack'), value: 'STOCK_PACK' },
          {
            label: t('inventory.physical_stock_take'),
            value: 'PHYSICAL_STOCK_TAKE',
          },
          {
            label: t('inventory.stock_transfer_in'),
            value: 'STOCK_TRANSFER_IN',
          },
          {
            label: t('inventory.purchase_returned'),
            value: 'PURCHASE_RETURNED',
          },
          {
            label: t('inventory.stock_consumption'),
            value: 'STOCK_CONSUMPTION',
          },
          {
            label: t('inventory.stock_transfer_in_cancel'),
            value: 'STOCK_TRANSFER_IN_CANCEL',
          },
          { label: t('inventory.initial_stock'), value: 'INITIAL_STOCK' },
          { label: t('inventory.delete_stock'), value: 'DELETE_STOCK' },
        ],
      },
    },
  };

  return useCrud<InventoryChangeLogItem, InventoryChangeLogParams>({
    columns,
    id:"inventory-change-list",
    searchFormSchema,
    batchOperate: false,
    service: {
      query: getInventoryChangeLogList,
    },
  });
}
