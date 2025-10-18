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
        return t(`inventory.${cellValue}`);
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
      field: 'product_unit_name',
      title: t('inventory.units'),
      minWidth: 240,
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
      field: 'remark',
      title: t('inventory.remarks'),
      minWidth: 240,
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
    // {
    //   field: 'operation',
    //   title: t('common.operations'),
    //   width: 120,
    //   fixed: 'right',
    //   slots: { default: 'operation' },
    // },
  ];

  const service = {
    query: getInventoryChangeLogList,
  };

  const {
    Grid,
    handleCreate,
    canBatchOperate,
    Drawer,
    handleEdit,
    handleBatchDelete,
  } = useCrud({
    service,
    id: 'change-log',
    columns,
    searchFormSchema: {
      keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('common.keywords')}}",
          clearable: true,
        },
      },
    },
  });

  return {
    Grid,
    Drawer,
    handleCreate,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
