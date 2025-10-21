/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ProductListItem } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deleteProduct,
  inventoryProductProfilePageList,
} from '@@/inventory/apis';
import { ProductListDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useInventoryProductList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<ProductListItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'profile_photo',
      title: t('inventory.image'),
      minWidth: 80,
      fixed: 'left',
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'major_name',
      title: t('inventory.product-name-major'),
      minWidth: 200,
      fixed: 'left',
    },
    {
      field: 'product_code',
      title: t('inventory.product-code'),
      minWidth: 160,
    },
    {
      field: 'product_unit_names',
      title: t('inventory.unit'),
      minWidth: 110,
    },
    {
      field: 'major_unit_name',
      title: t('inventory.major-unit-name'),
      minWidth: 110,
    },
    {
      field: 'minor_name',
      title: t('inventory.minor_name'),
      minWidth: 200,
    },
    {
      field: 'status',
      title: t('inventory.status'),
      minWidth: 110,
      slots: {
        default: 'status',
      },
    },
    {
      field: 'product_group_name',
      title: t('inventory.product-group'),
      minWidth: 200,
    },
    {
      field: 'product_label_list',
      title: t('inventory.product-label'),
      minWidth: 180,
      showOverflow: false,
      slots: { default: 'label' },
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
    },
    {
      field: 'operation',
      title: t('inventory.action'),
      minWidth: 170,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-decorator-props': {
        style: { 'margin-bottom': '0' },
        class: 'w-64',
      },
      'x-component-props': {
        placeholder:
          "{{t('inventory.please-enter-keywords-to-search-product-name-product-code')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-decorator-props': {
        style: { 'margin-bottom': '0', width: '140px' },
      },
      'x-component-props': {
        placeholder: "{{t('inventory.sale-status')}}",
        clearable: true,
        options: [
          { label: t('inventory.on-sale'), value: 'ON_SALE' },
          { label: t('inventory.off-sale'), value: 'OFF_SALE' },
        ],
      },
    },
  };

  // 服务函数
  const service = {
    // 获取列表数据
    query: inventoryProductProfilePageList,

    // 删除产品
    remove: deleteProduct,
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    canBatchOperate,
    Drawer,
    handleEdit,
    handleBatchDelete,
  } = useCrud({
    // @ts-ignore
    service,
    id: 'product-list',
    columns,
    gridOptions: {
      showOverflow: false,
    },
    searchFormSchema,
    batchOperate: true,
    connectedComponent: ProductListDrawer,
  });

  return {
    Grid,
    Drawer,
    gridApi,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
