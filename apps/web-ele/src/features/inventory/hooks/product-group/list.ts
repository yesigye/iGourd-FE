import type {
  ProductLabelItem,
  ProductLabelParams,
} from '../../types/product-label';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { deleteProductLabel, getProductList } from '@@/inventory/apis';

import { useCrud } from '#/hooks';

export function useProductGroupList() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns: VxeGridPropTypes.Column<PurchaseCustomizedInfo>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'product_group_name',
      title: t('product-group.product-grid-product-group-name'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'major_name',
      title: t('product-group.product-grid-major-name'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'product_code',
      title: t('product-group.product-grid-product-code'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'status',
      title: t('product-group.product-grid-status'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'major_unit_name',
      title: t('product-group.product-grid-major-unit-name'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      sortable: true,
      minWidth: 180,
      slots: { default: 'operation' },
    },
  ];

  // 搜索表单配置 - 基于原有的 queryParams 对象
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

  return useCrud<ProductLabelItem, ProductLabelParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      // @ts-ignore
      query: getProductList,
      // @ts-ignore
      drop: deleteProductLabel,
      create: '',
      update: '',
    },
  });
}
