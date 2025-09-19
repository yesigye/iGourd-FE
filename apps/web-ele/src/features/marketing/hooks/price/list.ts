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
      field: 'name',
      title: t('marketing.priceLevelName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'change_type',
      title: t('marketing.priceLevelType'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'change_value',
      title: t('marketing.priceLevelPrice'),
      width: 100,
      align: 'center',
    },
    {
      field: 'change_mode',
      title: t('marketing.changeMode'),
      width: 120,
      align: 'right',
    },
    {
      field: 'effective_time',
      title: t('marketing.effectiveDate'),
      width: 120,
      align: 'right',
    },
    {
      field: 'expiration_time',
      title: t('marketing.expirationTime'),
      width: 120,
      align: 'right',
    },
    {
      field: 'creator_name',
      title: t('marketing.creator'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'create_time',
      title: t('marketing.createTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'status',
      title: t('marketing.switchStatus'),
      width: 100,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operations'),
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
