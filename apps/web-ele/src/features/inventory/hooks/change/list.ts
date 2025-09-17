import type {
  InventoryChangeLogItem,
  InventoryChangeLogParams,
} from '../../types/change';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { useCrud } from '#/hooks';

import { getInventoryChangeLogList } from '@@/inventory/apis';

export function useInventoryChangeList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<InventoryChangeLogItem>[] = [
    {
      field: 'change_type',
      title: t('inventory.changeType'),
      minWidth: 164,
      fixed: 'left',
      formatter: ({ cellValue }) => t(`inventory.${cellValue}`),
    },
    {
      field: 'receipt_no',
      title: t('inventory.receiptNumber'),
      minWidth: 176,
    },
    {
      field: 'product_name',
      title: t('inventory.productName'),
      minWidth: 240,
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 150,
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse'),
      minWidth: 150,
    },
    {
      field: 'change_quantity',
      title: t('inventory.changeQuantity'),
      minWidth: 180,
      formatter: ({ row }) => `${row.change_quantity} ${row.product_unit_name}`,
    },
    {
      field: 'origin_quantity',
      title: t('inventory.preChangedQuantity'),
      minWidth: 180,
      formatter: ({ row }) => `${row.origin_quantity} ${row.product_unit_name}`,
    },
    {
      field: 'final_quantity',
      title: t('inventory.postChangedQuantity'),
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
      title: t('inventory.creationTime'),
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
        placeholder: "{{t('inventory.pleaseEnterKeywords')}}",
        clearable: true,
      },
    },
    change_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.changeType')}}",
        clearable: true,
        options: [
          { label: t('inventory.POINT_EXCHANGE'), value: 'POINT_EXCHANGE' },
          { label: t('inventory.STOCK_UNPACK'), value: 'STOCK_UNPACK' },
          { label: t('inventory.GOODS_RECEIPT'), value: 'GOODS_RECEIPT' },
          {
            label: t('inventory.CANCEL_STOCK_COUNT'),
            value: 'CANCEL_PHYSICAL_STOCK_TAKE',
          },
          {
            label: t('inventory.CANCEL_STOCK_CONSUMPTION'),
            value: 'CANCEL_STOCK_CONSUMPTION',
          },
          { label: t('inventory.EDIT_STOCK'), value: 'EDIT_STOCK' },
          {
            label: t('inventory.STOCK_TRANSFER_OUT'),
            value: 'STOCK_TRANSFER_OUT',
          },
          { label: t('inventory.SALES_DISPATCH'), value: 'SALES_DISPATCH' },
          {
            label: t('inventory.STOCK_TRANSFER_OUT_CANCEL'),
            value: 'STOCK_TRANSFER_OUT_CANCEL',
          },
          { label: t('inventory.SALES_RETURNED'), value: 'SALES_RETURNED' },
          { label: t('inventory.STOCK_PACK'), value: 'STOCK_PACK' },
          {
            label: t('inventory.PHYSICAL_STOCK_TAKE'),
            value: 'PHYSICAL_STOCK_TAKE',
          },
          {
            label: t('inventory.STOCK_TRANSFER_IN'),
            value: 'STOCK_TRANSFER_IN',
          },
          {
            label: t('inventory.PURCHASE_RETURNED'),
            value: 'PURCHASE_RETURNED',
          },
          {
            label: t('inventory.STOCK_CONSUMPTION'),
            value: 'STOCK_CONSUMPTION',
          },
          {
            label: t('inventory.STOCK_TRANSFER_IN_CANCEL'),
            value: 'STOCK_TRANSFER_IN_CANCEL',
          },
          { label: t('inventory.INITIAL_STOCK'), value: 'INITIAL_STOCK' },
          { label: t('inventory.DELETE_STOCK'), value: 'DELETE_STOCK' },
        ],
      },
    },
  };

  return useCrud<InventoryChangeLogItem, InventoryChangeLogParams>({
    columns,
    searchFormSchema,
    batchOperate: false,
    service: {
      query: getInventoryChangeLogList,
    },
  });
}
