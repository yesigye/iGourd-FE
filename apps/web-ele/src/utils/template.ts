import type { ColumnOptionCode, PrintTemplateOption } from '@@/setting/types';
import type { TreeNode } from 'element-plus';

import type { DefineComponent, Ref } from 'vue';

import type {
  IdString,
  PRINT_TEMPLATE_OTHER_OPTION,
  PRINT_TEMPLATE_OTHER_OPTION_CHILD,
  PRINT_TEMPLATE_OTHER_OPTION_CHILD_RICH_TEXT,
  PrintTemplateApiType,
  TableJsonTemplate,
} from './type';

import { PrintTable } from '@igourd/common-ui';
import { useUserStore } from '@igourd/stores';
import { sortBy } from '@igourd/utils';

const { merchantInfo } = useUserStore();
const tableItemJsonTemplate: TableJsonTemplate = {
  id: '',
  label: '',
  component_type: 'PrintTable',
  com: PrintTable,
  option: {},
  column_option_code: [], // [node.column_option_code],
  style: {
    textAlign: '',
  },
};

export const generateTableItemJson = (
  columnOptionCode: ColumnOptionCode | ColumnOptionCode[],
  tableValue,
  item: any = {},
): PrintTemplateApiType => {
  if (Array.isArray(columnOptionCode)) {
    return {
      ...tableItemJsonTemplate,
      option: {
        value: tableValue,
      },
      column_option_code: columnOptionCode,
      style: item.style,
    };
  }
  return {
    ...tableItemJsonTemplate,
    option: {
      value: tableValue,
    },
    column_option_code: [columnOptionCode],
    style: item.style,
  };
};

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

/** 获取分割线json template */
export const getDividerJsonTemplate = (com: DefineComponent) => {
  return {
    ...PRINT_TEMPLATE_OTHER_OPTION_CHILD,
    com,
    id: Date.now(),
    name: '分割线',
  };
};
/** 获取富文本 */
export const getRichTextJsonTemplate = (com: DefineComponent) => {
  return {
    ...PRINT_TEMPLATE_OTHER_OPTION_CHILD_RICH_TEXT,
    com,
    id: Date.now(),
    name: '富文本编辑',
  };
};

export const getTemplateOtherOptions = ({
  divideComp,
}: {
  divideComp: DefineComponent;
}) => {
  return {
    ...PRINT_TEMPLATE_OTHER_OPTION,
    children: [getDividerJsonTemplate(divideComp)],
  };
};

/** 暂时用不到 */
export const fontSizeOption = {
  default: [
    {
      value: '12px',
      label: '12px',
    },
    {
      value: '14px',
      label: '14px',
    },
    {
      value: '16px',
      label: '16px',
    },
  ],
  title: [
    {
      value: '20px',
      label: '20px',
    },
    {
      value: '22px',
      label: '22px',
    },
    {
      value: '24px',
      label: '24px',
    },
  ],
  label: [
    {
      value: '16px',
      label: '16px',
    },
    {
      value: '18px',
      label: '18px',
    },
    {
      value: '20px',
      label: '20px',
    },
  ],
};

type DataType = Record<string, any>;

export const treeSelectChange = (
  printData: Ref<DataType[]>,
  node: TreeNode,
  tableValue,
) => {
  if (node.component_type == 'PrintTable') {
    const tableIndex = printData.value.findIndex(
      (item) => item.component_type === 'PrintTable',
    );
    /** 表格数据未展示, 第一次添加 */
    if (tableIndex == -1) {
      printData.value.push(
        generateTableItemJson(
          {
            column_option_code: node.column_option_code,
            id: node.id,
            i18nKey: node.column_key?.toLowerCase(),
            name: node.name,
            option: {
              value: tableValue,
            },
            prefix: node.prefix,
            suffix: node.suffix,
            storeInfo: merchantInfo,
          },
          tableValue,
        ),
      );
    } else {
      // 判断printData表格数据中column_option_code是否存在选中的column_option_code值
      const tableItem = printData.value[tableIndex];
      // 当前字段是否已经添加
      const isContainCode = tableItem.column_option_code.findIndex(
        (item) => item.column_option_code === node.column_option_code,
      );
      if (isContainCode === -1) {
        // 不存在
        tableItem.column_option_code.push({
          column_option_code: node.column_option_code,
          id: node.id,
          i18nKey: node.column_key?.toLowerCase(),
          name: node.name,
          option: {
            value: tableValue,
          },
          prefix: node.prefix,
          suffix: node.suffix,
          storeInfo: merchantInfo,
        });
      } else {
        // 存在
        tableItem.column_option_code.splice(isContainCode, 1);
      }
    }
  } else {
    // 判断是否存在,存在的话删除
    const index = printData.value.findIndex((item) => item.id === node.id);
    if (index === -1) {
      console.log('添加', node);
      printData.value.push(node);
    } else {
      printData.value.splice(index, 1);
    }
  }
};

export const transformCode2Id = (allData: any, codes: string[]) => {
  const result: IdString[] = [];
  for (const item of allData) {
    if (codes.includes(item.column_option_code)) {
      result.push(item.id);
    }
  }
  return result;
};
