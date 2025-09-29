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
// 实现动态右侧动态项
export const optionConfig = {};
export const StyleInt = (type) => {
  switch (type) {
    case 'PrintDivider': {
      return {
        border: 'dashed',
        borderCount: 1,
      };
    }
    case 'PrintLabel': {
      return {
        textAlign: 'center',
      };
    }
    case 'PrintTable': {
      return {
        border: 'dashed',
      };
    }
    case 'PrintTitle': {
      return {
        textAlign: 'center',
      };
    }
    default: {
      return {
        textAlign: 'left',
      };
    }
  }
};
/**
 * 处理带有前缀或后缀的值，支持占位符
 * @param {any} optionValue - 主要值
 * @param {string} affixText - 前缀或后缀文本
 * @param {boolean} isSuffix - 是否为后缀
 * @param {object} storeData - 存储数据对象
 * @returns {string} - 处理后的文本
 */
export const processAffixedValue = (
  optionValue,
  affixText,
  isSuffix,
  storeData,
) => {
  if (!affixText) return String(optionValue);
  const extract = extractPlaceholderValue(affixText);
  const stringValue = String(optionValue);
  if (extract.isPlaceholder) {
    const storeValue = storeData[extract.value];
    if (!stringValue) return '-';
    return isSuffix
      ? `${stringValue} ${storeValue}`
      : `${storeValue} ${stringValue}`;
  } else {
    return isSuffix
      ? `${stringValue} ${affixText}`
      : `${affixText} ${stringValue}`;
  }
};
/**
 * @description 判断是否为占位符
 * @param str 字符串
 * @returns { isPlaceholder: boolean, value: string }
 */
//
const extractPlaceholderValue = (str) => {
  // 正则表达式匹配${xxx}格式，并捕获xxx部分
  const regex = /\$\{([^{}]+)\}/;

  // 使用正则测试是否匹配该格式
  const isPlaceholder = regex.test(str);

  if (isPlaceholder) {
    // 如果是占位符格式，提取中间的值
    const matches = str.match(regex);
    return {
      isPlaceholder: true,
      value: matches[1], // 返回捕获组中的值
    };
  } else {
    // 如果不是占位符格式
    return {
      isPlaceholder: false,
      value: str,
    };
  }
};
