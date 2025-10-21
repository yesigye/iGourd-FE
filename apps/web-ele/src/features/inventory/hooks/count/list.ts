import type { CountItem } from '../../types/count';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { CountDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';
import { formatNumber } from '#/utils/functions';

import { getCountList, removeCount } from '../../apis/count';

export function useInventoryCountList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<CountItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'physical_stock_take_no',
      title: t('inventory.physical-stock-take-no'),
      minWidth: 230,
      fixed: 'left',
    },
    {
      field: 'physical_stock_take_date',
      title: t('inventory.physical-stock-take-date'),
      minWidth: 160,
      formatter: ({ cellValue }) => (cellValue ? cellValue.split(' ')[0] : ''),
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse'),
      minWidth: 150,
    },
    {
      field: 'origin_total_quantity',
      title: t('inventory.origin-total-quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'physical_total_quantity',
      title: t('inventory.physical-total-quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'total_variance_quantity',
      title: t('inventory.total-variance-quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'total_variance_selling_price',
      title: t('inventory.total-variance-selling-price'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'total_variance_cost',
      title: t('inventory.total-variance-cost'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'review_status',
      title: t('inventory.review'),
      minWidth: 85,
      align: 'center',
      cellRender: {
        name: 'ReviewStatus',
      },
      slots: { default: 'modal' },
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
    {
      field: 'operation',
      title: t('common.operations'),
      width: 200,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const service = {
    query: getCountList,
    drop: removeCount
  };

  const {
    Grid,
    gridApi,
    canBatchOperate,
    Drawer,
    drawerApi,
    handleEdit,
    handleBatchDelete,
    handleDelete,
  } = useCrud({
    service,
    id: 'count',
    columns,
    connectedComponent: CountDrawer,
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
    gridApi,
    Drawer,
    drawerApi,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
    handleDelete,
  };
}
