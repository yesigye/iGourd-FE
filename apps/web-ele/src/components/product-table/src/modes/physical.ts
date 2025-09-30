import type { ModePlugin } from '../types';

import { createBaseColumns } from '../utils/column-helpers';

export const PhysicalMode: ModePlugin = {
  id: 'physical',
  columns() {
    const columns = createBaseColumns();
    // console.log(createBaseColumns());
    // 修改数量列的标题
    const quantityIndex = columns.findIndex(
      (col) => col.name === 'display_quantity',
    );
    if (quantityIndex !== -1) {
      columns[quantityIndex] = {
        ...columns[quantityIndex],
        title: '盘点数量',
        name: 'physical_quantity',
      };
    }

    columns.push({
      name: 'variance_quantity',
      title: '{{t("common.purchase.variance_quantity")}}',
      'x-component-props': {
        width: 200,
      },
      'x-component': 'PreviewText.Input',
      'x-decorator': 'FormItem',
    });
    return columns;
  },
  handleEvent(_evt, data) {
    return data;
  },
};
