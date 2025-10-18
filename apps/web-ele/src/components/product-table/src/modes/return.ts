import type { Ctx, LineItem, ModePlugin, ProductTableEvent } from '../types';

import {
  createBaseColumns,
  createQuantityColumn,
} from '../utils/column-helpers';

export const ReturnMode: ModePlugin = {
  id: 'return',

  columns(_ctx) {
    const baseColumns = createBaseColumns();
    const quantityColumn = createQuantityColumn(
      'returned_quantity',
      '{{t("common.purchase.quantity")}}',
      'InputNumber',
      'received_quantity',
    );

     const quantityIndex = baseColumns.findIndex(
      (col) => col.name === 'display_quantity',
    );
    if (quantityIndex !== -1) {
      baseColumns[quantityIndex] = {
        ...baseColumns[quantityIndex],
        title: '退货数量',
        name: 'returned_quantity',
      };
    }

    // 在cost_price列后插入数量列
    const costPriceIndex = baseColumns.findIndex(
      (col) => col.name === 'sku_barcode',
    );
    const columns = [...baseColumns];
    // columns.splice(costPriceIndex + 1, 0, quantityColumn);

    return columns;
  },

  mergeColumnsForRowSpan() {
    return [
      {
        columnKey: 'stock_warning_quantity',
        byField: 'product_barcode' as any,
      },
    ];
  },

  handleEvent(_evt: ProductTableEvent, data: LineItem[], _ctx: Ctx) {
    // most logic handled in QuantityCell via bridge; keep placeholder for extendability
    return data;
  },
};
