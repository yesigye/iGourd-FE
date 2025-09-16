import type { PriceDTO, PriceRow } from '@@/marketing/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createPriceApi,
  deletePriceApi,
  getPriceListApi,
  updatePriceApi,
} from '@@/marketing/apis';
import { PriceDrawer } from '@@/marketing/components';

import { useCrud } from '#/hooks';

export function usePrice() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<PriceRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'product_name',
      title: t('marketing.productName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'product_code',
      title: t('marketing.productCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'price_type',
      title: t('marketing.priceType'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'ElTag',
        props: {
          type: '{{getTypeTagType(row.price_type)}}',
          children: '{{getTypeText(row.price_type)}}',
        },
      },
    },
    {
      field: 'price',
      title: t('marketing.price'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.price ? `¥${row.price.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'cost',
      title: t('marketing.cost'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.cost ? `¥${row.cost.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'margin',
      title: t('marketing.margin'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.margin ? `¥${row.margin.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'start_time',
      title: t('marketing.startTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'end_time',
      title: t('marketing.endTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'status',
      title: t('marketing.status'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'ElSwitch',
        props: {
          modelValue: '{{row.status === "active"}}',
          activeValue: 'active',
          inactiveValue: 'inactive',
          onChange: '{{$event => handleStatusChange(row, $event)}}',
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
    product_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('marketing.productName')}}",
        clearable: true,
      },
    },
    product_code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('marketing.productCode')}}",
        clearable: true,
      },
    },
    price_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('marketing.priceType')}}",
        clearable: true,
        options: [
          { label: t('marketing.priceTypeOptions.retail'), value: 'retail' },
          { label: t('marketing.priceTypeOptions.wholesale'), value: 'wholesale' },
          { label: t('marketing.priceTypeOptions.vip'), value: 'vip' },
        ],
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('marketing.status')}}",
        clearable: true,
        options: [
          { label: t('marketing.statusOptions.active'), value: 'active' },
          { label: t('marketing.statusOptions.inactive'), value: 'inactive' },
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

  return useCrud<PriceRow, PriceDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: PriceDrawer,
    service: {
      query: getPriceListApi,
      drop: deletePriceApi,
      create: createPriceApi,
      update: updatePriceApi,
    },
  });
}
