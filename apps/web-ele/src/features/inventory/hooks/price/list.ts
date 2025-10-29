import type {
  PriceChangeLogItem,
  PriceChangeLogParams,
} from '../../types/price';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import Decimal from 'decimal.js';

import { useCrud } from '#/hooks';

import { getPriceChangeLogList } from '../../apis/price';

export function useInventoryPriceList() {
  const { t } = useI18n();

  // 计算价格差异
  const calculatePriceDiff = (row: PriceChangeLogItem) => {
    return new Decimal(row.final_price || 0)
      .minus(new Decimal(row.origin_price || 0))
      .toNumber();
  };

  // 获取价格颜色
  const getPriceColor = (row: PriceChangeLogItem) => {
    return new Decimal(calculatePriceDiff(row)).isPositive()
      ? '#ff0000'
      : '#13ba07';
  };

  const columns: VxeGridPropTypes.Column<PriceChangeLogItem>[] = [
    {
      field: 'price_type',
      title: t('inventory.change-type'),
      minWidth: 160,
      fixed: 'left',
      formatter: ({ cellValue }) => t(`inventory.${cellValue}`),
    },
    {
      field: 'product_name',
      title: t('inventory.product-name'),
      minWidth: 240,
    },
    {
      field: 'product_code',
      title: t('inventory.product-code'),
      minWidth: 160,
    },
    {
      field: 'origin_price',
      title: t('inventory.pre-change-price'),
      minWidth: 180,
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      field: 'final_price',
      title: t('inventory.post-change-price'),
      minWidth: 180,
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      field: 'change_amount',
      title: t('inventory.change-amount'),
      minWidth: 180,
      formatter: ({ row }) => {
        const diff = calculatePriceDiff(row);
        return `<span style="color: ${getPriceColor(row)}">${diff}</span>`;
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
        placeholder: "{{t('inventory.enter-price-keywords')}}",
        clearable: true,
      },
    },
    price_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.select-price-type')}}",
        clearable: true,
        options: [
          { label: t('inventory.cost_price'), value: 'COST_PRICE' },
          { label: t('inventory.selling_price'), value: 'SELLING_PRICE' },
        ],
      },
    },
  };

  return useCrud<PriceChangeLogItem, PriceChangeLogParams>({
    columns,
    id: 'inventory-price-log-list',
    searchFormSchema,
    batchOperate: false,
    service: {
      query: getPriceChangeLogList,
    },
  });
}
