/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { ModePlugin } from '../types';
import { createSimpleColumns } from '../utils/column-helpers';

export const PhysicalMode: ModePlugin = {
  id: 'physical',
  columns() {
    const columns = createSimpleColumns();
    // 修改数量列的标题
    const quantityIndex = columns.findIndex(col => col.name === 'display_quantity');
    if (quantityIndex !== -1) {
      columns[quantityIndex] = {
        ...columns[quantityIndex],
        title: '盘点数量',
      };
    }
    return columns;
  },
  handleEvent(_evt, data) {
    return data;
  },
};
