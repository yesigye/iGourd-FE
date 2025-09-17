import type { ChangeLogItem } from '../../types/change-log';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';
import { subtractDecimal } from '@igourd/utils';

import { useCrud } from '#/hooks';
import { formatNumber } from '#/utils/functions';

import { getInventoryChangeLogList } from '../../apis/change-log';

export function useInventoryChangeLogList() {
  const { t } = useI18n();

  // // 变更类型选项
  // const changeTypeOptions = [
  //   { label: t('inventory.purchase'), value: 'PURCHASE' },
  //   { label: t('inventory.sale'), value: 'SALE' },
  //   { label: t('inventory.return'), value: 'RETURN' },
  //   { label: t('inventory.adjustment'), value: 'ADJUSTMENT' },
  //   { label: t('inventory.transferIn'), value: 'TRANSFER_IN' },
  //   { label: t('inventory.transferOut'), value: 'TRANSFER_OUT' },
  //   { label: t('inventory.spoilage'), value: 'SPOILAGE' },
  //   { label: t('inventory.count'), value: 'COUNT' },
  //   { label: t('inventory.other'), value: 'OTHER' },
  // ];

  // // 库存类型选项
  // const stockTypeOptions = [
  //   { label: t('inventory.stock'), value: 'STOCK' },
  //   { label: t('inventory.virtual'), value: 'VIRTUAL' },
  //   { label: t('inventory.all'), value: 'ALL' },
  // ];

  const columns: VxeGridPropTypes.Column<ChangeLogItem>[] = [
    {
      field: 'change_type',
      title: t('inventory.changeType'),
      minWidth: 164,
      fixed: 'left',
      formatter: ({ cellValue }) => {
        const typeMap = {
          PURCHASE: t('inventory.purchase'),
          SALE: t('inventory.sale'),
          RETURN: t('inventory.return'),
          ADJUSTMENT: t('inventory.adjustment'),
          TRANSFER_IN: t('inventory.transferIn'),
          TRANSFER_OUT: t('inventory.transferOut'),
          SPOILAGE: t('inventory.spoilage'),
          COUNT: t('inventory.count'),
          OTHER: t('inventory.other'),
        };
        return typeMap[cellValue as keyof typeof typeMap] || cellValue;
      },
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
      formatter: ({ row }) => {
        const changeQty = subtractDecimal(
          row.final_quantity,
          row.origin_quantity,
        );
        return `${formatNumber(changeQty)} ${row.product_unit_name}`;
      },
    },
    {
      field: 'origin_quantity',
      title: t('inventory.preChangedQuantity'),
      minWidth: 180,
      formatter: ({ row }) =>
        `${formatNumber(row.origin_quantity)} ${row.product_unit_name}`,
    },
    {
      field: 'final_quantity',
      title: t('inventory.postChangedQuantity'),
      minWidth: 180,
      formatter: ({ row }) =>
        `${formatNumber(row.final_quantity)} ${row.product_unit_name}`,
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

  const service = {
    query: getInventoryChangeLogList,
  };

  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns,
      searchFormSchema: {
        keywords: {
          type: 'input',
          name: 'keywords',
          title: t('inventory.keywords'),
          'x-component-props': {
            placeholder: t('inventory.keywordsPlaceholder'),
          },
        },
      },
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
