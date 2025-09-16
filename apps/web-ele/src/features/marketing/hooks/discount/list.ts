import type { DiscountDTO, DiscountRow } from '@@/marketing/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createDiscountApi,
  deleteDiscountApi,
  getDiscountListApi,
  updateDiscountApi,
} from '@@/marketing/apis';
import { DiscountDrawer } from '@@/marketing/components';

import { useCrud } from '#/hooks';

export function useDiscount() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<DiscountRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('marketing.discountName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'code',
      title: t('marketing.discountCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'type',
      title: t('marketing.discountType'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'ElTag',
        props: {
          type: '{{getTypeTagType(row.type)}}',
          children: '{{getTypeText(row.type)}}',
        },
      },
    },
    {
      field: 'value',
      title: t('marketing.discountValue'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{formatDiscountValue(row)}}',
        },
      },
    },
    {
      field: 'min_amount',
      title: t('marketing.minAmount'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.min_amount ? `¥${row.min_amount.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'max_amount',
      title: t('marketing.maxAmount'),
      width: 120,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.max_amount ? `¥${row.max_amount.toFixed(2)}` : "-"}}',
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
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
    type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('marketing.discountType')}}",
        clearable: true,
        options: [
          { label: t('marketing.typeOptions.percentage'), value: 'percentage' },
          { label: t('marketing.typeOptions.fixed'), value: 'fixed' },
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

  return useCrud<DiscountRow, DiscountDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: DiscountDrawer,
    service: {
      query: getDiscountListApi,
      drop: deleteDiscountApi,
      create: createDiscountApi,
      update: updateDiscountApi,
    },
  });
}
