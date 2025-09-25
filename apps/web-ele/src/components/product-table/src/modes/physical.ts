/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { ModePlugin } from '../types';

import { calcLineAmounts } from '../core/calc-engine';
import {
  fromBaseQuantity,
  handleQuantityChangeLocal,
} from '../core/quantity-engine';

const toNum = (v: any) =>
  v === null || v === '' || Number.isNaN(+v) ? null : +v;

export const PhysicalMode: ModePlugin = {
  id: 'physical',
  quantityBridge: {
    legacyKeys: ['physical_quantity'],
    readDisplay(line, _ctx) {
      if (toNum(line.display_quantity) !== null) return +line.display_quantity!;
      const lv = toNum((line as any).physical_quantity);
      if (lv !== null) {
        const unit = line.unit_code ?? 'minor';
        const ratio = Math.max(+line.basic_unit_radio! || 1, 1);
        return unit === 'major' ? lv / ratio : lv;
      }
      return fromBaseQuantity(line).display_quantity ?? null;
    },
    writeDisplayLocal(line, v, ctx) {
      const next = handleQuantityChangeLocal({
        ...line,
        display_quantity: v ?? 0,
      });
      const unit = next.unit_code ?? 'minor';
      const ratio = Math.max(+next.basic_unit_radio! || 1, 1);
      const legacyVal =
        unit === 'major'
          ? +next.display_quantity! * ratio
          : +next.display_quantity!;
      (next as any).physical_quantity = Number.isFinite(legacyVal)
        ? legacyVal
        : 0;
      return calcLineAmounts(next, ctx.vatMode);
    },
  },
  columns() {
    return [
      {
        key: 'major_name',
        title: '商品',
        width: 260,
        component: 'ProductTable.ProductCell',
        decorator: 'FormItem',
        required: true,
      },
      {
        key: 'unit_select',
        title: '单位',
        width: 160,
        component: 'ProductTable.UnitCell',
        decorator: 'FormItem',
      },
      {
        key: 'sku_id',
        title: 'SKU',
        width: 200,
        component: 'ProductTable.SkuSelect',
        decorator: 'FormItem',
      },
      {
        key: 'display_quantity',
        title: '盘点数量',
        width: 140,
        component: 'ProductTable.QuantityCell',
        decorator: 'FormItem',
        required: true,
        props: { precision: 8 },
      },
      {
        key: 'quantity_base',
        title: '基础数量',
        width: 120,
        component: 'ProductTable.ReadonlyNumber',
      },
      { key: 'remark', title: '备注', width: 180, component: 'Input' },
    ];
  },
  handleEvent(_evt, data) {
    return data;
  },
};
