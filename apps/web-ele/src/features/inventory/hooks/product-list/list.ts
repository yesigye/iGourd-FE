/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ProductListItem } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteProduct, getProductList } from '@@/inventory/apis';
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
      slots: { default: 'image' },
    },
    {
      field: 'major_name',
      title: t('inventory.productNameMajor'),
      minWidth: 200,
      fixed: 'left',
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 160,
    },
    {
      field: 'product_unit_names',
      title: t('inventory.unit'),
      minWidth: 110,
    },
    {
      field: 'major_unit_name',
      title: t('inventory.major_unit_name'),
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
      slots: { default: 'status' },
    },
    {
      field: 'product_group_name',
      title: t('inventory.productGroup'),
      minWidth: 200,
      slots: { default: 'productGroup' },
    },
    {
      field: 'product_label_list',
      title: t('inventory.productLabel'),
      minWidth: 280,
      slots: { default: 'productLabel' },
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 200,
    },
    {
      field: 'create_time',
      title: t('inventory.creationTime'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime',
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
      'x-component-props': {
        placeholder:
          "{{t('inventory.pleaseEnterKeywordsToSearchProductNameProductCode')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.saleStatus')}}",
        clearable: true,
        options: [
          { label: t('inventory.onSale'), value: 'ON_SALE' },
          { label: t('inventory.offSale'), value: 'OFF_SALE' },
        ],
      },
    },
  };

  // 服务函数
  const service = {
    // 获取列表数据
    query: getProductList,

    // 删除产品
    remove: deleteProduct,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      // @ts-ignore
      service,
      columns,
      searchFormSchema,
      batchOperate: true,
      connectedComponent: ProductListDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
