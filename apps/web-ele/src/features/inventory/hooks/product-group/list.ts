import type {
  FirstGroupItem,
  FirstGroupParams,
} from '../../types/product-group';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getFirstGroupList } from '@@/inventory/apis';
import { ProductGroupDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useInventoryProductGroupList() {
  const { t } = useI18n();

  // 左侧表格列配置（一级分组）
  const leftColumns: VxeGridPropTypes.Column<FirstGroupItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'category',
      title: t('product-group.category'),
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'product',
      title: t('product-group.product'),
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'product_code',
      title: t('product-group.product_code'),
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'status',
      title: t('product-group.status'),
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'unit',
      title: t('product-group.unit'),
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'operation',
      title: t('common.action'),
      minWidth: 135,
      fixed: 'right',
      slots: { default: 'leftOperation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.searchKeywords')}}",
        clearable: true,
      },
    },
  };

  // 左侧表格 Hook
  return useCrud<FirstGroupItem, FirstGroupParams>({
    columns: leftColumns,
    searchFormSchema,
    batchOperate: false,
    connectedComponent: ProductGroupDrawer,
    service: {
      query: getFirstGroupList,
    },
  });
}
