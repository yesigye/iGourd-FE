import type { ProductLabelItem, ProductLabelParams } from '../../types/product-label';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventoryProductLabelApi } from '../../apis/product-label';
import { useCrud } from '@/composables/useCrud';

export function useInventoryProductLabelList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<ProductLabelItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left'
    },
    {
      field: 'name',
      title: t('inventory.productLabelName'),
      minWidth: 220,
      fixed: 'left'
    },
    {
      field: 'product_number',
      title: t('inventory.productNumber'),
      minWidth: 200
    },
    {
      field: 'product',
      title: t('inventory.productsDetail'),
      minWidth: 85,
      fixed: 'right',
      slots: { default: 'productDetail' }
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 200
    },
    {
      field: 'create_time',
      title: t('inventory.creationTime'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime'
    },
    {
      field: 'operation',
      title: t('inventory.action'),
      minWidth: 85,
      fixed: 'right',
      slots: { default: 'operation' }
    }
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.pleaseEnterKeywordsToSearchVendorNameCreditLine')}}",
        clearable: true
      }
    }
  };

  return useCrud<ProductLabelItem, ProductLabelParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      query: inventoryProductLabelApi.getProductLabelList,
      drop: inventoryProductLabelApi.deleteProductLabel,
      create: inventoryProductLabelApi.createOrUpdateProductLabel,
      update: inventoryProductLabelApi.createOrUpdateProductLabel,
    }
  });
}
