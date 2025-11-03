import type { DiscountDTO, DiscountRow } from '@@/marketing/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createOrUpdateDiscount,
  deleteDiscountApi,
  getDiscountDetailApi,
  getDiscountListApi,
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
      title: t('marketing.promotionalname'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'type',
      title: t('marketing.promotiontype'),
      minWidth: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (cellValue === 'DISCOUNT') {
          return t('discount.enum.type.discount');
        }
        return t('discount.enum.type.reduction');
      },
      align: 'left',
    },
    {
      field: 'minimum_amount',
      title: t('marketing.sumofconsumption'),
      width: 100,
      align: 'center',
    },
    {
      field: 'reduce_amount',
      title: t('marketing.fulldeduction'),
      width: 120,
      align: 'right',
    },
    {
      field: 'discount_percentage',
      title: t('marketing.discount-ptg'),
      width: 120,
      align: 'right',
    },
    {
      field: 'channel',
      title: t('marketing.scopeofapplication'),
      width: 120,
      formatter: ({ cellValue }) => {
        if (cellValue === 'STORE') {
          return t('discount.enum.channel.store');
        }
        return t('discount.enum.channel.online');
      },
      align: 'right',
    },
    {
      field: 'effective_time',
      title: t('marketing.effective-time'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'expiration_time',
      title: t('marketing.expiration-time'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'creator_name',
      title: t('marketing.creator'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    // Added a column for the 'status' with custom rendering
    {
      field: 'status',
      // added the status field with translation
      title: t('discount.form.status'),
      width: 100,
      sortable: true,
      align: 'center',
      // added this slot property to use custom rendering for the 'status' field using a switch component
      slots: { default: 'status' },
    },
    {
      field: 'operation',
      title: t('common.operations'),
      width: 135,
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
  };

  return useCrud<DiscountRow, DiscountDTO>({
    columns,
    id: 'marketing-discount-list',
    searchFormSchema,
    batchOperate: true,
    connectedComponent: DiscountDrawer,
    service: {
      query: getDiscountListApi,
      drop: deleteDiscountApi,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      detail: getDiscountDetailApi,
      create: createOrUpdateDiscount,
      update: createOrUpdateDiscount,
    },
  });
}
