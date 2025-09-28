import type { ColumnOptionCode, PrintTemplateOption } from '@@/setting/types';

import { sortBy } from '@igourd/utils';

export const getTableTreeId = (
  ids: string[],
  treeDatas: PrintTemplateOption[],
  storeData?: any,
): {
  defaultData: Record<string, any>;
  tableOptionCode: ColumnOptionCode[];
} => {
  const tableOptionCode: ColumnOptionCode[] = [];
  const defaultData = {} as Record<string, any>;
  for (const treeItem of treeDatas) {
    if (ids.includes(treeItem?.id)) {
      if (treeItem.column_option_code) {
        defaultData[treeItem.column_option_code] = treeItem.default_value;
        tableOptionCode.push({
          id: treeItem.id,
          column_option_code: treeItem.column_option_code,
          i18nKey: treeItem.column_key?.toLowerCase(),
          name: treeItem.name,
          suffix: treeItem.suffix,
          prefix: treeItem.prefix,
          storeInfo: storeData,
        });
      }
      if (ids.length === tableOptionCode.length) {
        break;
      }
    }
  }
  return {
    tableOptionCode: sortBy(tableOptionCode, (item) => ids.indexOf(item.id)),
    defaultData,
  };
};
