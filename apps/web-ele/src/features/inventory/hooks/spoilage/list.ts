/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { SpoilageItem } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getSpoilageList, removeSpoilage } from '@@/inventory/apis';
import { SpoilageDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';
import { retainDecimal8 } from '#/utils/eleValidate';
import { formatNumber } from '#/utils/functions';

export function useInventorySpoilageList() {
  const { t } = useI18n();
  // 枚举报损原因
  const consumptionReason = [
    {
      value: 'EXPIRED_GOODS',
      label: t('spoilage.consumption-reason-enum.expired-products'),
    },
    {
      value: 'DAMAGED_GOODS',
      label: t('spoilage.consumption-reason-enum.damaged-products'),
    },
    {
      value: 'PERSONAL_USES',
      label: t('spoilage.consumption-reason-enum.personal-use'),
    },
    {
      value: 'RAW_MATERIALS',
      label: t('spoilage.consumption-reason-enum.raw_materials'),
    },
    {
      value: 'OTHERS',
      label: t('spoilage.consumption-reason-enum.others'),
    },
  ];

  const columns: VxeGridPropTypes.Column<SpoilageItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'stock_consumption_no',
      title: t('inventory.stockConsumptionNo'),
      minWidth: 240,
      fixed: 'left',
    },
    {
      field: 'consumption_date',
      title: t('inventory.stockConsumptionDate'),
      minWidth: 240,
      sortable: true,
      formatter: ({ cellValue }) => (cellValue ? cellValue.split(' ')[0] : ''),
    },
    {
      field: 'total_spoilage_quantity',
      title: t('inventory.total_spoilage_quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => {
        return formatNumber(cellValue) && retainDecimal8(cellValue, 8);
      },
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse_name'),
      minWidth: 150,
    },
    {
      field: 'consumption_reason',
      title: t('inventory.consumption_reason'),
      minWidth: 150,
      formatter: ({ cellValue }) => t(`inventory.${cellValue}`),
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
      title: t('inventory.creationTime'),
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
      'x-component-props': {
        placeholder: "{{t('inventory.pleaseEnterKeywordsToSearch')}}",
        clearable: true,
      },
    },
    consumption_reason: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
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
      'x-component-props': {
        placeholder: "{{t('inventory.status')}}",
        clearable: true,
        options: [
          { label: t('inventory.PENDING'), value: 'PENDING' },
          { label: t('inventory.APPROVED'), value: 'APPROVED' },
          { label: t('inventory.REJECTED'), value: 'REJECTED' },
        ],
      },
    },
  };

  // 服务函数
  const service = {
    // 获取列表数据
    query: getSpoilageList,
    // 删除损耗
    drop: async (data) => {
      // @ts-ignore
      const params = { stock_consumption_ids: data };
      return await removeSpoilage(params);
    },
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
