/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { SpoilageItem } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';
import { useEnum } from '#/hooks';
import { getSpoilageList, removeSpoilage } from '@@/inventory/apis';
import { SpoilageDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';
import { retainDecimal8 } from '#/utils/eleValidate';
import { formatNumber } from '#/utils/functions';
import { getEnumLabel } from '#/utils/global';
export function useInventorySpoilageList() {
  const { t } = useI18n();
  const { consumptionReason } = useEnum();


  const columns: VxeGridPropTypes.Column<SpoilageItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'stock_consumption_no',
      title: t('inventory.stock-consumption-no'),
      minWidth: 240,
      fixed: 'left',
    },
    {
      field: 'consumption_date',
      title: t('inventory.stock-consumption-date'),
      minWidth: 240,
      sortable: true,
      formatter: ({ cellValue }) => (cellValue ? cellValue.split(' ')[0] : ''),
    },
    {
      field: 'total_spoilage_quantity',
      title: t('inventory.total-spoilage-quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => {
        return formatNumber(cellValue) && retainDecimal8(cellValue, 8);
      },
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse-name'),
      minWidth: 150,
    },
    {
      field: 'consumption_reason',
      title: t('inventory.consumption-reason'),
      minWidth: 150,
      formatter: ({ cellValue }) => getEnumLabel(consumptionReason,cellValue),
    },
    {
      field: 'status',
      title: t('inventory.review'),
      minWidth: 85,
      fixed: 'right',
      // slots: { default: 'status' },
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
      title: t('inventory.action'),
      minWidth: 135,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-decorator-props': {
        // style: { 'margin-bottom': '0' },
      },
      'x-component-props': {
        placeholder: "{{t('inventory.please-enter-keywords-to-search')}}",
        clearable: true,
      },
    },
    consumption_reason: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-decorator-props': {
        style: { width: '140px' },
      },
      'x-component-props': {
        placeholder: "{{t('spoilage.consumption-reason')}}",
        clearable: true,
        options: consumptionReason,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-decorator-props': {
        style: { width: '140px' },
      },
      'x-component-props': {
        placeholder: "{{t('inventory.status')}}",
        clearable: true,
        options: [
          { label: t('inventory.pending'), value: 'PENDING' },
          { label: t('inventory.approved'), value: 'APPROVED' },
          { label: t('inventory.rejected'), value: 'REJECTED' },
        ],
      },
    },
  };

  // 服务函数
  const service = {
    // 获取列表数据
    query: getSpoilageList,
    // 删除损耗
    drop: removeSpoilage,
  };

  // 使用 CRUD Hook
  const {
    Grid,
    canBatchOperate,
    Drawer,
    handleEdit,
    handleBatchDelete,
    handleDelete,
  } = useCrud({
    // @ts-ignore
    service,
    columns,
    id:"inventory-spoilage-list",
    searchFormSchema,
    batchOperate: true,
    connectedComponent: SpoilageDrawer,
  });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
    handleDelete,
  };
}
