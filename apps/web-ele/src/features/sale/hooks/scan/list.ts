// import type { ScanSaleDTO, ScanSaleRow } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { ScanSaleDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function useScanSale() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<ScanSaleRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'scan_no',
      title: t('sale.scanNo'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'product_name',
      title: t('sale.productName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'product_code',
      title: t('sale.productCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'quantity',
      title: t('sale.quantity'),
      width: 100,
      align: 'right',
    },
    {
      field: 'unit_price',
      title: t('sale.unitPrice'),
      width: 100,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter:
            '{{row.unit_price ? `¥${row.unit_price.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'total_amount',
      title: t('sale.total-amount'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter:
            '{{row.total_amount ? `¥${row.total_amount.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'scan_time',
      title: t('sale.scanTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'status',
      title: t('sale.status'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'ElTag',
        props: {
          type: '{{getStatusTagType(row.status)}}',
          children: '{{getStatusText(row.status)}}',
        },
      },
    },
    {
      field: 'create_time',
      title: t('common.createTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      width: 120,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    scan_no: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('sale.scanNo')}}",
        clearable: true,
      },
    },
    product_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('sale.productName')}}",
        clearable: true,
      },
    },
    product_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('sale.productCode')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('sale.status')}}",
        clearable: true,
        options: [
          { label: t('sale.statusOptions.pending'), value: 'pending' },
          { label: t('sale.statusOptions.completed'), value: 'completed' },
          { label: t('sale.statusOptions.cancelled'), value: 'cancelled' },
        ],
      },
    },
    date_range: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
      'x-component-props': {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  };

  return useCrud<any, any>({
    columns,
    id: 'sale-scan-list',
    searchFormSchema,
    batchOperate: true,
    connectedComponent: ScanSaleDrawer,
    // service: {
    //   query: getScanSaleListApi,
    //   drop: deleteScanSaleApi,
    //   create: createScanSaleApi,
    //   update: updateScanSaleApi,
    // },
  });
}
