import { disabledTimeListsProps } from 'element-plus/es/components/time-picker/src/props/shared.mjs';
import type { ModePlugin } from '../types';

export const TransferOutMode: ModePlugin = {
  id: 'transfer-out',
  columns(_ctx) {
    return [
      {
        name: 'major_name',
        type: 'string',
        title: 'product_id',
        'x-hidden': true,
      },
      {
        name: 'product_id',
        title: "{{t('common.purchase.major-name')}}",
        'x-component': 'ProductTable.ProductCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 360 },
        },
        'x-decorator-props': {
          required: true,
        },
      },
      {
        name: 'unit_select',
        title: "{{t('common.purchase.sub-product-stock-search-models')}}",
        'x-component': 'ProductTable.UnitCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 160 },
        },
      },
      {
        name: 'sku_barcode',
        title: "{{t('common.purchase.sku-barcode')}}",
        'x-component': 'Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 200 },
          disabled:true
        },
      },
       {
        name: 'last_review_confirm',
        title: "{{t('common.purchase.difference-qty-new')}}",
        'x-component': 'Radio.Group',
        'x-decorator': 'FormItem',
        enum: [
          {
            label: "{{t('common.purchase.transfer-by-quantity')}}",
            value: "IN",
          },
          {
            label: "{{t('common.purchase.transfer-by-out-quantity')}}",
            value: "OUT",
          },
        ],
        'x-component-props': {
          style: { width: 200 },
        },
      },

     

      {
        name: 'transfer_quantity',
        type: 'number',
        title: "{{t('common.purchase.transfer-quantity')}}",
        'x-component': 'ReadonlyNumber',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 140 },
          precision: 8,
        },
        'x-decorator-props': {
          required: true,
        },
      },
      {
        name: 'quantity_base',
        type: 'number',
        title: "{{t('common.purchase.base-quantity')}}",
        'x-component': 'ReadonlyNumber',
        'x-component-props': {
          style: { width: 120 },
        },
      },

      {
        name: 'remark',
        title: "{{t('common.remarks')}}",
        'x-component': 'Input',
        'x-component-props': {
          style: { width: 180 },
        },
      },
    ];
  },
  handleEvent(_evt, data, _ctx) {
    return data;
  },
};
