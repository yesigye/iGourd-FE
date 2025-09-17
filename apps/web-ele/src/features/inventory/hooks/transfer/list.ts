/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { TransferItem } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteTransfer, getTransferList } from '@@/inventory/apis';
import { TransferDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';
import { formatNumber } from '#/utils/functions';

export function useInventoryTransferList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<TransferItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'transfer_type',
      title: t('inventory.transferType'),
      minWidth: 200,
      fixed: 'left',
    },
    {
      field: 'stock_transfer_no',
      title: t('inventory.stock_transfer_no'),
      minWidth: 200,
    },
    {
      field: 'transfer_date',
      title: t('inventory.transfer_date'),
      minWidth: 200,
      sortable: true,
      formatter: ({ cellValue }) => (cellValue ? cellValue.split(' ')[0] : ''),
    },
    {
      field: 'total_transfer_quantity',
      title: t('inventory.total_transfer_quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'source_warehouse_name',
      title: t('inventory.source_warehouse_name'),
      minWidth: 150,
    },
    {
      field: 'destination_warehouse_name',
      title: t('inventory.destination_warehouse_name'),
      minWidth: 150,
    },
    {
      field: 'status',
      title: t('inventory.out_state'),
      minWidth: 168,
      fixed: 'right',
      slots: { default: 'status' },
    },
    {
      field: 'review_status',
      title: t('inventory.status'),
      minWidth: 135,
      fixed: 'right',
      slots: { default: 'reviewStatus' },
    },
    {
      field: 'destination_review_status',
      title: t('inventory.review'),
      minWidth: 120,
      fixed: 'right',
      slots: { default: 'destinationReviewStatus' },
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
        placeholder: "{{t('inventory.enterTransferKeywords')}}",
        clearable: true,
      },
    },
    transfer_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.transferType')}}",
        clearable: true,
        options: [
          {
            label: t('inventory.sameStoreTransfer'),
            value: 'TRANSFER_SAME_STORE',
          },
          {
            label: t('inventory.differentStoreTransfer'),
            value: 'TRANSFER_DIFFERENT_STORE',
          },
          { label: t('inventory.transferOut'), value: 'TRANSFER_IN_ONLY' },
          { label: t('inventory.transferIn'), value: 'TRANSFER_OUT_ONLY' },
        ],
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.status')}}",
        clearable: true,
        options: [
          { label: t('inventory.created'), value: 'CREATED' },
          { label: t('inventory.outbound'), value: 'OUTBOUND' },
          { label: t('inventory.inbound'), value: 'INBOUND' },
          { label: t('inventory.refusedOutbound'), value: 'REFUSED_OUTBOUND' },
          { label: t('inventory.refusedInbound'), value: 'REFUSED_INBOUND' },
        ],
      },
    },
  };

  // 服务函数
  const service = {
    // 获取列表数据
    query: getTransferList,

    // 删除调拨
    remove: async (data: { stock_transfer_ids: number[] }) => {
      // @ts-ignore
      return await deleteTransfer(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      // @ts-ignore
      service,
      columns,
      searchFormSchema,
      batchOperate: true,
      connectedComponent: TransferDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
