import type { ModePlugin } from '../types';

import { createSimpleColumns } from '../utils/column-helpers';

export const SpoilageMode: ModePlugin = {
  id: 'spoilage',
  columns(_ctx) {
    const columns = createSimpleColumns();
    // 修改数量列的标题
    const quantityIndex = columns.findIndex(
      (col) => col.name === 'display_quantity',
    );
    if (quantityIndex !== -1) {
      columns[quantityIndex] = {
        ...columns[quantityIndex],
        title: '报损数量',
        name: 'consumption_quantity',
      };
    }
    return columns;
  },
  handleEvent(_evt, data, _ctx) {
    return data;
  },
};
