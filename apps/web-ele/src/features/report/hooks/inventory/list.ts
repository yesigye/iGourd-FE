import type { InventoryReportRow } from '@@/report/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getInventoryReportApi } from '@@/report/apis';

import { useCrud } from '#/hooks';

export function useInventoryReport() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<InventoryReportRow>[] = [
    {
      field: 'product_name',
      title: t('report.productName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'product_code',
      title: t('report.productCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'warehouse_name',
      title: t('report.warehouseName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'current_stock',
      title: t('report.currentStock'),
      width: 120,
      align: 'right',
    },
    {
      field: 'min_stock',
      title: t('report.minStock'),
      width: 120,
      align: 'right',
    },
    {
      field: 'max_stock',
      title: t('report.maxStock'),
      width: 120,
      align: 'right',
    },
    {
      field: 'stock_status',
      title: t('report.stockStatus'),
      width: 120,
      align: 'center',
      cellRender: {
        name: 'ElTag',
        props: {
          type: '{{getStockStatusTagType(row.stock_status)}}',
          children: '{{getStockStatusText(row.stock_status)}}',
        },
      },
    },
    {
      field: 'last_update_time',
      title: t('report.lastUpdateTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
  ];

  const searchFormSchema = {
    product_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('report.productName')}}",
        clearable: true,
      },
    },
    product_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('report.productCode')}}",
        clearable: true,
      },
    },
    warehouse_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('report.warehouseName')}}",
        clearable: true,
      },
    },
    stock_status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('report.stockStatus')}}",
        clearable: true,
        options: [
          { label: t('report.stockStatusOptions.normal'), value: 'normal' },
          { label: t('report.stockStatusOptions.low'), value: 'low' },
          { label: t('report.stockStatusOptions.out'), value: 'out' },
        ],
      },
    },
  };

  return useCrud<InventoryReportRow, any>({
    columns,
    searchFormSchema,
    batchOperate: false,
    service: {
      query: getInventoryReportApi,
    },
  });
}
