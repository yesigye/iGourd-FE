import type { ChangeLogItem, ChangeLogParams, ChangeType, StockType } from '../../types/change-log';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventoryChangeLogApi } from '../../apis/change-log';
import { useCrud } from '@/composables/useCrud';
import { useUserStore } from '@igourd/stores/modules/useUserStore';
import { storeToRefs } from 'pinia';
import { ref, computed, h } from 'vue';
import { formatNumber } from '@/common/functions';
import { subtractDecimal } from '@/service/decimal.service';

export function useInventoryChangeLogList() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const { merchantId } = storeToRefs(userStore);

  // 变更类型选项
  const changeTypeOptions = [
    { label: t('inventory.purchase'), value: 'PURCHASE' },
    { label: t('inventory.sale'), value: 'SALE' },
    { label: t('inventory.return'), value: 'RETURN' },
    { label: t('inventory.adjustment'), value: 'ADJUSTMENT' },
    { label: t('inventory.transferIn'), value: 'TRANSFER_IN' },
    { label: t('inventory.transferOut'), value: 'TRANSFER_OUT' },
    { label: t('inventory.spoilage'), value: 'SPOILAGE' },
    { label: t('inventory.count'), value: 'COUNT' },
    { label: t('inventory.other'), value: 'OTHER' },
  ];

  // 库存类型选项
  const stockTypeOptions = [
    { label: t('inventory.stock'), value: 'STOCK' },
    { label: t('inventory.virtual'), value: 'VIRTUAL' },
    { label: t('inventory.all'), value: 'ALL' },
  ];

  const columns: VxeGridPropTypes.Column<ChangeLogItem>[] = [
    {
      field: 'change_type',
      title: t('inventory.changeType'),
      minWidth: 164,
      fixed: 'left',
      formatter: ({ cellValue }) => {
        const typeMap = {
          PURCHASE: t('inventory.purchase'),
          SALE: t('inventory.sale'),
          RETURN: t('inventory.return'),
          ADJUSTMENT: t('inventory.adjustment'),
          TRANSFER_IN: t('inventory.transferIn'),
          TRANSFER_OUT: t('inventory.transferOut'),
          SPOILAGE: t('inventory.spoilage'),
          COUNT: t('inventory.count'),
          OTHER: t('inventory.other'),
        };
        return typeMap[cellValue as ChangeType] || cellValue;
      }
    },
    {
      field: 'receipt_no',
      title: t('inventory.receiptNumber'),
      minWidth: 176
    },
    {
      field: 'product_name',
      title: t('inventory.productName'),
      minWidth: 240
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 150
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse'),
      minWidth: 150
    },
    {
      field: 'change_quantity',
      title: t('inventory.changeQuantity'),
      minWidth: 180,
      formatter: ({ row }) => {
        const changeQty = subtractDecimal(row.final_quantity, row.origin_quantity);
        return `${formatNumber(changeQty)} ${row.product_unit_name}`;
      }
    },
    {
      field: 'origin_quantity',
      title: t('inventory.preChangedQuantity'),
      minWidth: 180,
      formatter: ({ row }) => `${formatNumber(row.origin_quantity)} ${row.product_unit_name}`
    },
    {
      field: 'final_quantity',
      title: t('inventory.postChangedQuantity'),
      minWidth: 180,
      formatter: ({ row }) => `${formatNumber(row.final_quantity)} ${row.product_unit_name}`
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
        placeholder: "{{t('inventory.enterKeywordsToSearch')}}",
        clearable: true
      }
    },
    change_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.changeType')}}",
        clearable: true,
        options: changeTypeOptions
      }
    },
    stock_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.stockType')}}",
        clearable: true,
        options: stockTypeOptions
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
    receipt_no: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.receiptNumber')}}",
        clearable: true
      }
    },
    warehouse_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.warehouse')}}",
        clearable: true
      }
    },
    creator_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.creator')}}",
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

  const crud = useCrud<ChangeLogItem, ChangeLogParams>({
    columns,
    searchFormSchema,
    batchOperate: false, // 日志页面通常不需要批量操作
    service: {
      query: async (params) => {
        const res = await inventoryChangeLogApi.getInventoryChangeLogList(params);
        if (res.code === 'SUCCESS' && res.data?.list) {
          // 计算变更数量
          res.data.list.forEach((item: ChangeLogItem) => {
            item.change_quantity = subtractDecimal(item.final_quantity, item.origin_quantity);
          });
        }
        return res;
      }
    },
    defaultQuery: {
      merchant_id: merchantId.value,
      stock_type: 'STOCK'
    }
  });

  // 导出功能
  const handleExport = async () => {
    try {
      const res = await inventoryChangeLogApi.exportInventoryChangeLog({
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
      link.download = `inventory-change-log-${new Date().toISOString().split('T')[0]}.xlsx`;
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
      const res = await inventoryChangeLogApi.getChangeTypeStatistics({
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
    changeTypeOptions,
    stockTypeOptions,
    handleExport,
    getStatistics
  };
}
