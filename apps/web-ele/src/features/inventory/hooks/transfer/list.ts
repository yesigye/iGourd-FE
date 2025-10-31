/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { TransferItem } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getTransferList, removeTransfer } from '@@/inventory/apis';
import { TransferDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';
import { formatNumber } from '#/utils/functions';
import { useEnum } from '#/hooks';
import { getEnumLabel } from '#/utils/global';
const transferTypeList = {
  TRANSFER_SAME_STORE: 'same-store-transfer',
  TRANSFER_DIFFERENT_STORE: 'different-store-transfer',
  TRANSFER_IN_ONLY: 'transfer-out',
  TRANSFER_OUT_ONLY: 'transfer-in',
};
type transferTypeKey = keyof typeof transferTypeList;

export function useInventoryTransferList() {
  const { t } = useI18n();
  const { transferTypeList } = useEnum();

  const columns: VxeGridPropTypes.Column<TransferItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'transfer_type',
      title: t('inventory.transfer-type'),
      minWidth: 200,
      fixed: 'left',
      formatter({ cellValue }: { cellValue: transferTypeKey }) {
        return getEnumLabel(transferTypeList, cellValue);
      },
    },
    {
      field: 'stock_transfer_no',
      title: t('inventory.stock-transfer-no'),
      minWidth: 200,
    },
    {
      field: 'transfer_date',
      title: t('inventory.transfer-date'),
      minWidth: 200,
      sortable: true,
      formatter: ({ cellValue }) => (cellValue ? cellValue.split(' ')[0] : ''),
    },
    {
      field: 'total_transfer_quantity',
      title: t('inventory.total-transfer-quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'source_warehouse_name',
      title: t('inventory.source-warehouse-name'),
      minWidth: 150,
    },
    {
      field: 'destination_warehouse_name',
      title: t('inventory.destination-warehouse-name'),
      minWidth: 150,
    },
    {
      field: 'status',
      title: t('inventory.out-state'),
      minWidth: 168,
      fixed: 'right',
      slots: { default: 'status' },
    },
    {
      field: 'review_status',
      title: t('inventory.review'),
      minWidth: 120,
      fixed: 'right',
      slots: { default: 'review_status' },
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
      title: t('inventory.action'),
      minWidth: 145,
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
        placeholder: "{{t('inventory.enter-transfer-keywords')}}",
        clearable: true,
      },
    },
  };

  // 服务函数
  const service = {
    // 获取列表数据
    query: getTransferList,

    // 删除调拨
    drop: removeTransfer,
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    handleCreate,
    canBatchOperate,
    Drawer,
    drawerApi,
    handleEdit,
    handleBatchDelete,
    handleDelete,
  } = useCrud({
    // @ts-ignore
    service,
    id: 'transfer',
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: TransferDrawer,
  });

  return {
    Grid,
    gridApi,
    Drawer,
    drawerApi,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
    handleCreate,
    handleDelete,
  };
}
