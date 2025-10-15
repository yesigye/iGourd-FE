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
        title: '商品',
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
        title: '单位',
        'x-component': 'ProductTable.UnitCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 160 },
        },
      },
      {
        name: 'sku_barcode',
        title: 'SKU条形码',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 200 },
          disabled:true
        },
      },
      {
        name: 'transfer_quantity',
        type: 'number',
        title: '调拨数量',
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
        title: '基础数量',
        'x-component': 'ReadonlyNumber',
        'x-component-props': {
          style: { width: 120 },
        },
      },

      {
        name: 'remark',
        title: '备注',
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
