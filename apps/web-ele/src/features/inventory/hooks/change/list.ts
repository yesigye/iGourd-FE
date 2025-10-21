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
          { label: t('inventory.point-exchange'), value: 'POINT_EXCHANGE' },
          { label: t('inventory.stock-unpack'), value: 'STOCK_UNPACK' },
          { label: t('inventory.goods-receipt'), value: 'GOODS_RECEIPT' },
          {
            label: t('inventory.cancel-stock-count'),
            value: 'CANCEL_PHYSICAL_STOCK_TAKE',
          },
          {
            label: t('inventory.cancel-stock-consumption'),
            value: 'CANCEL_STOCK_CONSUMPTION',
          },
          { label: t('inventory.edit-stock'), value: 'EDIT_STOCK' },
          {
            label: t('inventory.stock-transfer-out'),
            value: 'STOCK_TRANSFER_OUT',
          },
          { label: t('inventory.sales-dispatch'), value: 'SALES_DISPATCH' },
          {
            label: t('inventory.stock-transfer-out_cancel'),
            value: 'STOCK_TRANSFER_OUT_CANCEL',
          },
          { label: t('inventory.sales-returned'), value: 'SALES_RETURNED' },
          { label: t('inventory.stock-pack'), value: 'STOCK_PACK' },
          {
            label: t('inventory.physical-stock-take'),
            value: 'PHYSICAL_STOCK_TAKE',
          },
          {
            label: t('inventory.stock-transfer-in'),
            value: 'STOCK_TRANSFER_IN',
          },
          {
            label: t('inventory.purchase-returned'),
            value: 'PURCHASE_RETURNED',
          },
          {
            label: t('inventory.stock-consumption'),
            value: 'STOCK_CONSUMPTION',
          },
          {
            label: t('inventory.stock-transfer-in_cancel'),
            value: 'STOCK_TRANSFER_IN_CANCEL',
          },
          { label: t('inventory.initial-stock'), value: 'INITIAL_STOCK' },
          { label: t('inventory.delete-stock'), value: 'DELETE_STOCK' },
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
