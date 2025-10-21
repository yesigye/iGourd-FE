/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  ProductLabelItem,
  ProductLabelParams,
} from '../../types/product-label';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createProductLabel,
  productUnbindApi,
  getProductlabelProductPage,
  updateProductLabel,
} from '@@/inventory/apis';

import { useCrud } from '#/hooks';

export function useInventoryProductLabelList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<ProductLabelItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },

    {
      field: 'product_label_name',
      title: t('inventory.product-label-name'),
      minWidth: 220,
    },
    {
      field: 'major_name',
      title: t('common.product'),
      minWidth: 85,
    },

    {
      field: 'major_unit_name',
      title: t('inventory.product_unit_name'),
      minWidth: 85,
    },
    {
      field: 'status',
      title: t('inventory.status'),
      minWidth: 85,
      slots: {
        default: 'status',
      },
    },

    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 200,
    },
    {
      field: 'create_time',
      title: t('inventory.creation-time'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('inventory.action'),
      minWidth: 85,
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
        placeholder:
          "{{t('inventory.please-enter-keywords-to-search-vendor-name-credit-line')}}",
        clearable: true,
      },
    },
  };
  let queryParam = '';
  // 查询数据
  const handleQueryTable = (qParam) => {
    queryParam = qParam;
    uCrud.gridApi.reload();
  };

  const uCrud = useCrud<ProductLabelItem, ProductLabelParams>({
    columns,
    id:"inventory-product-group-list2",
    searchFormSchema,
    searchFormAppendTo: '#product-label-search',
    batchOperate: true,
    service: {
      // @ts-ignore
      query: async (params) => {
        if (!queryParam) {
          return;
        }
        const resultList = await getProductlabelProductPage({
          ...params,
          product_label_id: queryParam,
        });
        resultList.list.forEach((item) => {
          item.product_label_name = item.product_label_list[0].name;
        });
        return resultList;
      },
      // @ts-ignore
      drop: async (params) => {
        productUnbindApi({
          product_label_id: queryParam,
          product_profile_ids: params,
        }).then(()=>{
          uCrud.gridApi.reload();
        })
      },
      create: createProductLabel,
      update: updateProductLabel,
    },
  });

  return { ...uCrud, handleQueryTable };
}
