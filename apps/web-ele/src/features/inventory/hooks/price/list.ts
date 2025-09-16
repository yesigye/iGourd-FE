import type { PriceChangeLogItem, PriceChangeLogParams } from '../../types/price';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventoryPriceApi } from '../../apis/price';
import { useCrud } from '@/composables/useCrud';
import Decimal from 'decimal.js';

export function useInventoryPriceList() {
  const { t } = useI18n();

  // 计算价格差异
  const calculatePriceDiff = (row: PriceChangeLogItem) => {
    return new Decimal(row.final_price || 0).minus(new Decimal(row.origin_price || 0)).toNumber();
  };

  // 获取价格颜色
  const getPriceColor = (row: PriceChangeLogItem) => {
    return new Decimal(calculatePriceDiff(row)).isPositive() ? '#ff0000' : '#13ba07';
  };

  const columns: VxeGridPropTypes.Column<PriceChangeLogItem>[] = [
    {
      field: 'price_type',
      title: t('inventory.changeType'),
      minWidth: 160,
      fixed: 'left',
      formatter: ({ cellValue }) => t(`inventory.${cellValue}`)
    },
    {
      field: 'product_name',
      title: t('inventory.productName'),
      minWidth: 240
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 160
    },
    {
      field: 'origin_price',
      title: t('inventory.preChangePrice'),
      minWidth: 180,
      formatter: ({ cellValue }) => cellValue || 0
    },
    {
      field: 'final_price',
      title: t('inventory.postChangePrice'),
      minWidth: 180,
      formatter: ({ cellValue }) => cellValue || 0
    },
    {
      field: 'change_amount',
      title: t('inventory.changeAmount'),
      minWidth: 180,
      formatter: ({ row }) => {
        const diff = calculatePriceDiff(row);
        return `<span style="color: ${getPriceColor(row)}">${diff}</span>`;
      }
    },
    {
      field: 'remark',
      title: t('inventory.remarks'),
      minWidth: 200
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 200
    },
    {
      field: 'create_time',
      title: t('inventory.creationTime'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime'
    }
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.enterPriceKeywords')}}",
        clearable: true
      }
    },
    price_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.selectPriceType')}}",
        clearable: true,
        options: [
          { label: t('inventory.cost_price'), value: 'COST_PRICE' },
          { label: t('inventory.selling_price'), value: 'SELLING_PRICE' }
        ]
      }
    }
  };

  return useCrud<PriceChangeLogItem, PriceChangeLogParams>({
    columns,
    searchFormSchema,
    batchOperate: false,
    service: {
      query: inventoryPriceApi.getPriceChangeLogList
    }
  });
}
