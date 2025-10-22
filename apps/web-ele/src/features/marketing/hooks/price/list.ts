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
        placeholder: "{{t('marketing.product-name')}}",
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
        title: t('marketing.price-level-name'),
        minWidth: 150,
        sortable: true,
        align: 'left',
      },
      {
        field: 'change_type',
        title: t('marketing.price-level-type'),
        minWidth: 150,
        sortable: true,
        align: 'left',
        formatter: ({ cellValue }) => {
          if (cellValue === 'DECREASE') {
            return t('price-level.enum.change-type.decrease');
          }
          return t('price-level.enum.change-type.increase');
        },
      },
      {
        field: 'change_value',
        title: t('marketing.price-level-price'),
        width: 100,
        align: 'center',
      },
      {
        field: 'change_mode',
        title: t('marketing.change-mode'),
        width: 120,
        align: 'right',
        formatter: ({ cellValue }) => {
          if (cellValue === 'AMOUNT') {
            return t('price-level.enum.change-mode.amount');
          }
          return t('price-level.enum.change-mode.percentage');
        },
      },
      {
        field: 'effective_time',
        title: t('marketing.effective-date'),
        width: 120,
        align: 'right',
      },
      {
        field: 'expiration_time',
        title: t('marketing.expiration-time'),
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
        title: t('marketing.create-time'),
        width: 160,
        sortable: true,
        align: 'center',
      },
      {
        field: 'status',
        title: t('marketing.switch-status'),
        width: 100,
        cellRender: {
          name: 'Switch',
          props: {
            activeValue: 'OPEN',
            inactiveValue: 'CLOSE',
            onChange(value: string, { row }: { row: PriceRow }) {
              debugger
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
