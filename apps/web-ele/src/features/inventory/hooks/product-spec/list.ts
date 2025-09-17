/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ProductSpecValueItem } from '../../types/product-spec';

import { computed } from 'vue';

import { useI18n } from '@igourd/locales';

import { useCrud } from '#/hooks';

export function useInventoryProductSpec() {
  const { t } = useI18n();

  // 表格列配置
  const tableColumns = computed(() => [
    {
      field: 'spec_value',
      title: t('inventory.product_spec.spec_value'),
      width: 200,
      minWidth: 150,
    },
    {
      field: 'spec_value_code',
      title: t('inventory.product_spec.spec_value_code'),
      width: 200,
      minWidth: 150,
    },
    {
      field: 'status',
      title: t('inventory.product_spec.status'),
      width: 120,
      slot: 'status',
    },
    {
      field: 'creator_name',
      title: t('inventory.product_spec.creator'),
      width: 150,
      minWidth: 120,
    },
    {
      field: 'create_time',
      title: t('inventory.product_spec.create_time'),
      width: 180,
      minWidth: 150,
      formatter: (row: ProductSpecValueItem) => {
        return new Date(row.create_time).toLocaleString();
      },
    },
    {
      field: 'operation',
      title: t('inventory.product_spec.action'),
      width: 150,
      slot: 'operate',
    },
  ]);

  return useCrud({
    // @ts-ignore
    columns: tableColumns.value,
    service: {},
  });
}
