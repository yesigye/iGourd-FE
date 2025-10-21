import type { ProductDTO, ProductRow } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createProductApi,
  deleteProductApi,
  getProductListApi,
  updateProductApi,
} from '@@/inventory/apis';
import { ProductDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useProduct() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<ProductRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('inventory.productName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'code',
      title: t('inventory.productCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'category',
      title: t('inventory.category'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'brand',
      title: t('inventory.brand'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'unit',
      title: t('inventory.unit'),
      width: 80,
      align: 'center',
    },
    {
      field: 'price',
      title: t('inventory.price'),
      width: 100,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.price ? `¥${row.price.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'cost',
      title: t('inventory.cost'),
      width: 100,
      align: 'right',
      cellRender: {
        name: 'ElText',
        props: {
          formatter: '{{row.cost ? `¥${row.cost.toFixed(2)}` : "-"}}',
        },
      },
    },
    {
      field: 'status',
      title: t('inventory.status'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'ElSwitch',
        props: {
          modelValue: '{{row.status === "active"}}',
          activeValue: 'active',
          inactiveValue: 'inactive',
          onChange: '{{$event => handleStatusChange(row, $event)}}',
        },
      },
    },
    {
      field: 'create_time',
      title: t('common.createTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      width: 120,
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
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
    category: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.category')}}",
        clearable: true,
      },
    },
    brand: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.brand')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.status')}}",
        clearable: true,
        options: [
          { label: t('inventory.statusOptions.active'), value: 'active' },
          { label: t('inventory.statusOptions.inactive'), value: 'inactive' },
        ],
      },
    },
  };

  return useCrud<ProductRow, ProductDTO>({
    columns,
    id:"inventory-product-list",
    searchFormSchema,
    batchOperate: true,
    connectedComponent: ProductDrawer,
    service: {
      query: getProductListApi,
      drop: deleteProductApi,
      create: createProductApi,
      update: updateProductApi,
    },
  });
}
