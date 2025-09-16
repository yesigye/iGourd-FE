import type { PriceLogItem, PriceLogParams, PriceType } from '../../types/price-log';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventoryPriceLogApi } from '../../apis/price-log';
import { useCrud } from '@/composables/useCrud';
import { useUserStore } from '@igourd/stores/modules/useUserStore';
import { storeToRefs } from 'pinia';
import { ref, computed, h } from 'vue';
import { formatNumber } from '@/common/functions';
import Decimal from 'decimal.js';

export function useInventoryPriceLogList() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const { merchantId } = storeToRefs(userStore);

  // 价格类型选项
  const priceTypeOptions = [
    { label: t('inventory.costPrice'), value: 'COST_PRICE' },
    { label: t('inventory.sellingPrice'), value: 'SELLING_PRICE' },
  ];

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
      }
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
      formatter: ({ cellValue }) => formatNumber(cellValue)
    },
    {
      field: 'final_price',
      title: t('inventory.postChangePrice'),
      minWidth: 180,
      formatter: ({ cellValue }) => formatNumber(cellValue)
    },
    {
      field: 'change_amount',
      title: t('inventory.changeAmount'),
      minWidth: 180,
      formatter: ({ row }) => {
        const changeAmount = new Decimal(row.final_price || 0).minus(new Decimal(row.origin_price || 0)).toNumber();
        const color = changeAmount > 0 ? '#ff0000' : '#13ba07';
        return h('span', { style: { color } }, formatNumber(changeAmount));
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
        options: priceTypeOptions
      }
    },
    product_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.productName')}}",
        clearable: true
      }
    },
    product_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.productCode')}}",
        clearable: true
      }
    },
    date_range: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
      'x-component-props': {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: "{{t('inventory.startDate')}}",
        endPlaceholder: "{{t('inventory.endDate')}}",
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  };

  const crud = useCrud<PriceLogItem, PriceLogParams>({
    columns,
    searchFormSchema,
    batchOperate: false, // 日志页面通常不需要批量操作
    service: {
      query: async (params) => {
        const res = await inventoryPriceLogApi.getInventoryPriceLogList(params);
        if (res.code === 'SUCCESS' && res.data?.list) {
          // 计算变更金额
          res.data.list.forEach((item: PriceLogItem) => {
            item.change_amount = new Decimal(item.final_price || 0).minus(new Decimal(item.origin_price || 0)).toNumber();
          });
        }
        return res;
      }
    },
    defaultQuery: {
      merchant_id: merchantId.value
    }
  });

  // 导出功能
  const handleExport = async () => {
    try {
      const res = await inventoryPriceLogApi.exportInventoryPriceLog({
        ...crud.queryParams.value,
        export_format: 'excel',
        include_details: true
      });

      // 创建下载链接
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory-price-log-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  // 获取统计信息
  const getStatistics = async () => {
    try {
      const res = await inventoryPriceLogApi.getPriceChangeStatistics({
        merchant_id: merchantId.value
      });
      return res.data;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      return null;
    }
  };

  return {
    ...crud,
    priceTypeOptions,
    handleExport,
    getStatistics
  };
}
