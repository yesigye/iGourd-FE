/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { SkuListItem } from '@@/inventory/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteSku, getSkuList, modifySku } from '@@/inventory/apis';
import { SkuListDrawer } from '@@/inventory/components';

import { useCrud, withEntityParam } from '#/hooks';

export function useInventorySkuList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<SkuListItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'major_name_spec',
      title: t('sku-list.major_name'),
      minWidth: 80,
      fixed: 'left',
      slots: { default: 'image' },
    },
    {
      field: 'product_code',
      title: t('inventory.product_code'),
      minWidth: 200,
      fixed: 'left',
    },
    {
      field: 'sku_barcode',
      title: t('sku-list.sku_barcode'),
      minWidth: 180,
    },
    {
      field: 'product_unit_name',
      title: t('sku-list.product_unit_name'),
      minWidth: 160,
    },
    {
      field: 'selling_price',
      title: t('sku-list.selling_price'),
      minWidth: 200,
    },
    {
      field: 'cost_price',
      title: t('sku-list.cost_price'),
      minWidth: 200,
    },
    {
      field: 'spec_code',
      title: t('sku-list.spec_code'),
      minWidth: 200,
    },
    {
      field: 'stock_total_quantity_message',
      title: t('sku-list.stock_total_quantity'),
      minWidth: 200,
    },
    {
      field: 'monthly_sales_quantity',
      title: t('sku-list.monthly_sales_quantity'),
      minWidth: 200,
    },
    {
      field: 'status',
      title: t('inventory.status'),
      minWidth: 120,
    },
    {
      field: 'creator_name',
      title: t('sku-list.creator_name'),
      minWidth: 120,
    },

    {
      field: 'create_time',
      title: t('sku-list.creation_time'),
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
    form: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'inline',
      },
      properties: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-decorator-props': {
            style: { 'margin-bottom': '0' },
          },
          'x-component-props': {
            placeholder: "{{t('inventory.pleaseEnterKeywordsNameAndSku')}}",
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
            placeholder: "{{t('inventory.status')}}",
            clearable: true,
            options: [
              { label: t('inventory.onSale'), value: 'ON_SALE' },
              { label: t('inventory.offSale'), value: 'OFF_SALE' },
            ],
          },
        },
      },
    },
  };


  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      // @ts-ignore
      // service,
      columns,
      searchFormSchema,
      batchOperate: true,
      connectedComponent: SkuListDrawer,
      service: {
        query: withEntityParam({})(getSkuList),
        create: withEntityParam({})(modifySku),
        update: withEntityParam({})(modifySku),
        drop: async (data) => {
              const params = { product_info_ids: data };
              // @ts-ignore
              return await deleteSku(params);
            },
      },
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
