/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { SkuListItem } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteSku, getSkuList } from '@@/inventory/apis';
import { SkuListDrawer } from '@@/inventory/components';

import { useCrud } from '#/hooks';

export function useInventorySkuList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<SkuListItem>[] = [
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
      title: t('inventory.productName'),
      minWidth: 200,
      fixed: 'left',
    },
    {
      field: 'sku_barcode',
      title: t('inventory.sku_list.sku_barcode'),
      minWidth: 180,
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 160,
    },
    {
      field: 'spec_info',
      title: t('inventory.sku_list.spec_info'),
      minWidth: 200,
    },
    {
      field: 'status',
      title: t('inventory.status'),
      minWidth: 120,
      slots: { default: 'status' },
    },
    {
      field: 'selling_price',
      title: t('inventory.sellingPrice'),
      minWidth: 120,
      formatter: ({ cellValue }) => (cellValue ? `$${cellValue}` : '-'),
    },
    {
      field: 'cost_price',
      title: t('inventory.costPrice'),
      minWidth: 120,
      formatter: ({ cellValue }) => (cellValue ? `$${cellValue}` : '-'),
    },
    {
      field: 'stock_quantity',
      title: t('inventory.stockQuantity'),
      minWidth: 120,
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 150,
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
      minWidth: 150,
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
        placeholder: "{{t('inventory.pleaseEnterKeywordsNameAndSku')}}",
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
          { label: t('inventory.onSale'), value: 'ON_SALE' },
          { label: t('inventory.offSale'), value: 'OFF_SALE' },
        ],
      },
    },
  };

  // 服务函数
  const service = {
    // 获取列表数据
    query: getSkuList,

    // 删除SKU
    remove: async (data: { product_info_ids: number[] }) => {
      // @ts-ignore
      return await deleteSku(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      // @ts-ignore
      service,
      columns,
      searchFormSchema,
      batchOperate: true,
      connectedComponent: SkuListDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
