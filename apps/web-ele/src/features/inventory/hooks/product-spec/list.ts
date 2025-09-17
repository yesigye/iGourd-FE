/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ProductSpecValueItem } from '../../types/product-spec';

import { computed } from 'vue';

import { useI18n } from '@igourd/locales';

import { getProductSpecList } from '@@/inventory/apis';

import { useCrud } from '#/hooks';

export function useInventoryProductSpec() {
  const { t } = useI18n();

  // 表格列配置
  const tableColumns = computed(() => [
    {
      field: 'product_spec_code',
      title: t('inventory.product_spec.product_spec_code'),
      minWidth: 150,
    },
    {
      field: 'product_spec_value',
      title: t('inventory.product_spec.product_spec_value'),

      minWidth: 150,
    },
    {
      field: 'product_spec_name',
      title: t('inventory.product_spec.product_spec_name'),
      width: 120,
    },
    {
      field: 'status',
      title: t('common.commonStatus'),
      minWidth: 120,
    },
    {
      field: 'source_type',
      title: t('inventory.product_spec.source_type'),
      minWidth: 150,
    },
    {
      field: 'operation',
      title: t('common.action'),
      minWidth: 150,
      slots: {
        default: 'operate',
      },
    },
  ]);

  return useCrud({
    // @ts-ignore
    columns: tableColumns.value,
    searchFormSchema: {
      keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder:
            "{{t('inventory.pleaseEnterKeywordsToSearchProductNameProductCode')}}",
          clearable: true,
        },
      },
    },
    service: {
      query: getProductSpecList,
    },
  });
}
