/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { ModePlugin } from '../types';

import { calcLineAmounts } from '../core/calc-engine';
import { handleQuantityChangeLocal } from '../core/quantity-engine';
import { toNum } from '../utils/shared-calculations';

export const TransferMode: ModePlugin = {
  id: 'transfer',
  columns(_ctx) {
    return [
      {
        name: 'major_name',
        title: '商品',
        'x-component': 'ProductTable.ProductCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 260 },
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
        name: 'sku_id',
        title: 'SKU',
        'x-component': 'ProductTable.SkuSelect',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 200 },
        },
      },
      {
        name: 'display_quantity',
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
