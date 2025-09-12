import type { ProductColumnConfig } from './type';
import { useI18n } from '@igourd/locales';

export const useProductColumns = (type: any) => {
  const { t } = useI18n();

  const baseColumns: ProductColumnConfig[] = [
    {
      prop: 'index',
      label: '#',
      width: 60,
      align: 'center',
      fixed: 'left',
      type: 'custom',
    },
    // {
    //   prop: 'profile_photo',
    //   label: t('common.purchase.profile_photo'),
    //   width: 80,
    //   align: 'center',
    //   fixed: 'left',
    //   isSelect: true,
    //   type: 'custom'
    // },
    {
      prop: 'product_code',
      label:  "{{ t('common.purchase.product_code') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'major_name',
      label: "{{ t('common.purchase.major_name') }}",
      width: 270,
      isSelect: true,
      type: 'custom',
    },
    // 条形码
    {
      prop: 'sku_barcode',
      label: "{{ t('common.purchase.product_barcode') }}",
      width: 170,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'enter_quantity',
      label: "{{ t('common.purchase.quantity') }}",
      width: 200,
      isSelect: true,
      type: 'custom',
      required: true,
    },
    {
      prop: 'product_spec_kvmessage',
      label: "{{ t('common.purchase.product_spec_kvmessage') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'sub_product_stock_search_models',
      label: "{{ t('common.purchase.sub_product_stock_search_models') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'major_unit_name',
      label: "{{ t('common.purchase.major_unit_name') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'basic_unit_radio',
      label: "{{ t('common.purchase.basic_unit_radio') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'purchase_qty',
      label: "{{ t('common.purchase.purchase_qty') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'cost_price',
      label: "{{ t('common.purchase.cost_price') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
  ];

  // 库存相关列
  const stockColumns: ProductColumnConfig[] = [
    {
      prop: 'stock_add_quantity',
      label: " {{ t('common.purchase.stock_add_quantity') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'stock_warning_quantity',
      label: " {{ t('common.purchase.stock_warning_quantity') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
  ];

  // 盘点相关列
  const physicalColumns: ProductColumnConfig[] = [
    {
      prop: 'origin_quantity_message',
      label: " {{ t('common.purchase.stock_total_quantity') }}",
      width: 160,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'sale_warehouse_product_stock_quantity_message',
      label: " {{ t('common.purchase.stock_total_quantity_message') }}",
      width: 160,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'variance_quantity',
      label: " {{ t('inventory.quantityDifference') }}",
      width: '200',
      isSelect: true,
      type: 'custom',
    },
  ];

  //报损单特有
  const spoilageColumns: ProductColumnConfig[] = [
    {
      prop: 'sale_warehouse_product_stock_quantity',
      label: " {{ t('common.purchase.stock_total_quantity') }}",
      width: 160,
      isSelect: true,
      type: 'custom',
    },
    {
      prop: 'sale_warehouse_product_stock_quantity_message',
      label: " {{ t('common.purchase.stock_total_quantity_message') }}",
      width: 160,
      isSelect: true,
      type: 'custom',
    },
  ];

  // 调拨单特有
  const transferColumns: ProductColumnConfig[] = [
    {
      prop: 'transfer_amount',
      label: " {{ t('common.purchase.transfer_amount') }}",
      width: 150,
      isSelect: true,
      type: 'custom',
    },
  ];

  // 组合列显示表格
  const getColumnsByType = (type: string): ProductColumnConfig[] => {
    const allColumns = [...baseColumns];

    let filteredColumns = allColumns;

    if (type === 'stock') {
      filteredColumns = allColumns.filter(
        (col) => col.prop !== 'quantity' && col.prop !== 'enter_quantity',
      );
      return [...filteredColumns, ...stockColumns];
    }

    // if (['spoilage', 'transfer', 'physical'].includes(type)) {
    //   filteredColumns = allColumns.filter(col => col.prop !== 'purchase_qty');
    // }
    switch (type) {
      case 'physical':
        return [...allColumns, ...physicalColumns];
      case 'spoilage':
        return [...allColumns, ...spoilageColumns];
      case 'transfer':
        return [...allColumns, ...spoilageColumns, ...transferColumns];
      case 'receipt':
        return [...allColumns];
      case 'return':
        return [...allColumns];
      default:
        return allColumns;
    }
  };

  const standardColumns = [...baseColumns, ...stockColumns];

  return {
    standardColumns,
    getColumnsByType,
  };
};

export const getDefaultProductItem = (): any => ({
  product_id: null,
  product_code: '',
  product_name: '',
  major_name: '',
  product_unit_name: '',
  product_unit_code: '',
  product_unit_id: '',
  product_barcode: '',
  product_group_id: 0,
  basic_product_id: 0,
  sku_group_code: '',
  basic_unit_radio: 0,
  // 库存相关字段
  stock_quantity: '', // 当前库存数量
  stock_add_quantity: '', // 添加库存数量
  stock_warning_quantity: '', // 库存警告数量
  merchant_id: null,
  sub_product_stock_search_models: [],
  display_major_name: '',
  // 保留一些可能需要的基础字段
  cost_price: null,
  selling_price: null,
  product_group_name: '',
  remark: '',
});
