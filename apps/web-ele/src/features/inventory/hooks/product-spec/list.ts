/* eslint-disable @typescript-eslint/ban-ts-comment */

import { computed } from 'vue';

import { useI18n } from '@igourd/locales';

import {
  deleteProductSpecValue,
  getProductSpecValueList,
} from '@@/inventory/apis';

import { useCrud } from '#/hooks';

export function useInventoryProductSpec() {
  const { t } = useI18n();

  const sourceTypeOptions = [
    {
      label: t('product-spec.source-type.manual-entry'),
      value: 'MANUAL_ENTRY',
    },
    { label: t('product-spec.source-type.system'), value: 'SYSTEM' },
    { label: t('product-spec.source-type.bulk-import'), value: 'BULK_IMPORT' },
  ];

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
      title: t('common.common-status'),
      minWidth: 120,
      slots: {
        default: 'status',
      },
    },
    {
      field: 'source_type',
      title: t('inventory.product_spec.source_type'),
      minWidth: 150,
      formatter: ({ cellValue }) => {
        const option = sourceTypeOptions.find((opt) => {
          return opt.value === cellValue;
        });
        return option ? option.label : row.source_type;
      },
    },
    {
      field: 'operation',
      title: t('common.action'),
      minWidth: 150,
      slots: {
        default: 'operation',
      },
    },
  ]);
  let queryParam = '';
  // 查询数据
  const handleQueryTable = (qParam) => {
    queryParam = qParam;
    uCrud.gridApi.reload();
  };
  const uCrud = useCrud({
    // @ts-ignore
    columns: tableColumns.value,
    id: 'label',
    searchFormAppendTo: '#product-spec-search',
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
      query: async (data: {
        date_range?: string[];
        page_num: number;
        page_size: number;
      }) => {
        const params = { ...data, product_spec_id: queryParam };
        return await getProductSpecValueList(params);
      },
      drop: deleteProductSpecValue,
    },
  });
  return { ...uCrud, handleQueryTable };
}
