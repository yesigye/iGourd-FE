import type { PriceDTO, PriceRow } from '@@/marketing/types';

import { useI18n } from '@igourd/locales';

import {
  createOrUpdatePriceApi,
  deletePriceApi,
  getPriceDetailApi,
  getPriceListApi,
  updatePriceStatusApi,
} from '@@/marketing/apis';
import { PriceDrawer } from '@@/marketing/components';

import { useCrud } from '#/hooks';

export function usePrice() {
  const { t } = useI18n();

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

  const {
    Grid,
    Drawer,
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
    gridApi,
  } = useCrud<PriceRow, PriceDTO>({
    columns: [
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
        formatter: ({ cellValue }) => {
          if (cellValue === 'DECREASE') {
            return t('priceLevel.enum.changeType.decrease');
          }
          return t('priceLevel.enum.changeType.increase');
        },
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
        formatter: ({ cellValue }) => {
          if (cellValue === 'AMOUNT') {
            return t('priceLevel.enum.changeMode.amount');
          }
          return t('priceLevel.enum.changeMode.percentage');
        },
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
        cellRender: {
          name: 'Switch',
          props: {
            activeValue: 'OPEN',
            inactiveValue: 'CLOSE',
            onChange(value: string, { row }: { row: PriceRow }) {
              updatePriceStatusApi({
                id: row.id,
                status: value,
              }).then(() => {
                gridApi.reload();
              });
            },
          },
        },
      },
      {
        field: 'operation',
        title: t('common.operations'),
        width: 135,
        fixed: 'right',
        slots: { default: 'operation' },
      },
    ],
    id:"marketing-price-list",
    searchFormSchema,
    batchOperate: true,
    connectedComponent: PriceDrawer,
    service: {
      query: getPriceListApi,
      detail: getPriceDetailApi,
      drop: deletePriceApi,
      create: createOrUpdatePriceApi,
      update: createOrUpdatePriceApi,
    },
  });
  return { Grid, Drawer, handleEdit, canBatchOperate, handleBatchDelete };
}
