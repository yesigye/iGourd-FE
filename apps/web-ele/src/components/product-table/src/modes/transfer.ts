import { disabledTimeListsProps } from 'element-plus/es/components/time-picker/src/props/shared.mjs';
import type { ModePlugin } from '../types';

export const TransferMode: ModePlugin = {
  id: 'transfer',
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
        name: 'transfer_in_quantity',
        type: 'number',
        title: "{{t('common.purchase.transfer-in-quantity')}}",
        'x-component': 'ProductTable.QuantityCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 140 },
          precision: 8,
        },
        'x-col-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              'hidden': "{{ $deps[0] == 'OUTBOUND'}}",
            },
          },
        },
        'x-decorator-props': {
          // required: true,
        },
      },
      {
        name: 'transfer_out_quantity',
        type: 'number',
        title: "{{t('common.purchase.transfer-out-quantity')}}",
        'x-component': 'ProductTable.QuantityCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 140 },
          precision: 8,
        },
        'x-decorator-props': {
          // required: true,
        },
        'x-col-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              'hidden': "{{ $deps[0] == 'INBOUND'}}",
            },
          },
        },
      },

      {
        name: 'transfer_quantity',
        type: 'number',
        title: "{{t('common.purchase.transfer-quantity')}}",
        'x-component': 'ProductTable.QuantityCell',
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
