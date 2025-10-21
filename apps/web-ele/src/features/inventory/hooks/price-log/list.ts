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
  //   { label: t('inventory.cost-price'), value: 'COST_PRICE' },
  //   { label: t('inventory.selling-price'), value: 'SELLING_PRICE' },
  // ];

  const columns: VxeGridPropTypes.Column<PriceLogItem>[] = [
    {
      field: 'price_type',
      title: t('inventory.change-type'),
      minWidth: 160,
      fixed: 'left',
      formatter: ({ cellValue }) => {
        const typeMap = {
          COST_PRICE: t('inventory.cost-price'),
          SELLING_PRICE: t('inventory.selling-price'),
        };
        return typeMap[cellValue as PriceType] || cellValue;
      },
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
      field: 'sku_barcode',
      title: t('inventory.sku-barcode'),
      minWidth: 160,
    },
    {
      field: 'product_unit_name',
      title: t('inventory.units'),
      minWidth: 160,
    },
    {
      field: 'change_amount',
      title: t('inventory.change-amount'),
      minWidth: 180,
      cellRender: {
        name: 'Amount',
        // @ts-ignore
        computedFn({ row }) {
          return new Decimal(row.final_price || 0)
            .minus(new Decimal(row.origin_price || 0))
            .toNumber();
        },
      },
    },
    {
      field: 'origin_price',
      title: t('inventory.pre-change-price'),
      minWidth: 180,
      formatter: ({ cellValue }) => formatNumber(cellValue),
    },
    {
      field: 'final_price',
      title: t('inventory.post-change-price'),
      minWidth: 180,
      formatter: ({ cellValue }) => formatNumber(cellValue),
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

  const service = {
    query: getInventoryPriceLogList,
  };

  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      id: 'price-log',
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
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
