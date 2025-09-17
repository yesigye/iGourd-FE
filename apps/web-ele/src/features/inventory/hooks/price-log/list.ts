import type { PriceLogItem, PriceType } from '../../types/price-log';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import Decimal from 'decimal.js';

import { useCrud } from '#/hooks';
import { formatNumber } from '#/utils/functions';

import { getInventoryPriceLogList } from '../../apis/price-log';

export function useInventoryPriceLogList() {
  const { t } = useI18n();

  // // 价格类型选项
  // const priceTypeOptions = [
  //   { label: t('inventory.costPrice'), value: 'COST_PRICE' },
  //   { label: t('inventory.sellingPrice'), value: 'SELLING_PRICE' },
  // ];

  const columns: VxeGridPropTypes.Column<PriceLogItem>[] = [
    {
      field: 'price_type',
      title: t('inventory.changeType'),
      minWidth: 160,
      fixed: 'left',
      formatter: ({ cellValue }) => {
        const typeMap = {
          COST_PRICE: t('inventory.costPrice'),
          SELLING_PRICE: t('inventory.sellingPrice'),
        };
        return typeMap[cellValue as PriceType] || cellValue;
      },
    },
    {
      field: 'product_name',
      title: t('inventory.productName'),
      minWidth: 240,
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 160,
    },
    {
      field: 'origin_price',
      title: t('inventory.preChangePrice'),
      minWidth: 180,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'final_price',
      title: t('inventory.postChangePrice'),
      minWidth: 180,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'change_amount',
      title: t('inventory.changeAmount'),
      minWidth: 180,
      formatter: ({ row }) => {
        const changeAmount = new Decimal(row.final_price || 0)
          .minus(new Decimal(row.origin_price || 0))
          .toNumber();
        const color = changeAmount > 0 ? '#ff0000' : '#13ba07';
        return `<span style="color: ${color}">${formatNumber(changeAmount)}</span>`;
      },
    },
    {
      field: 'remark',
      title: t('inventory.remarks'),
      minWidth: 200,
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
    query: getInventoryPriceLogList,
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
