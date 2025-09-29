/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  ColumnOptionCode,
  PrintTemplateApiType,
  PrintTemplateOption,
  TableJsonTemplate,
  TemplateType,
} from './types';

import { sortBy } from '@igourd/utils';

import { PrintTable } from '../print-item';

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
  tableValue: any,
  item: any = {},
): PrintTemplateApiType => {
  if (Array.isArray(columnOptionCode)) {
    return {
      ...tableItemJsonTemplate,
      // @ts-ignore
      option: {
        value: tableValue,
      },
      column_option_code: columnOptionCode,
      style: item.style,
    };
  }
  return {
    ...tableItemJsonTemplate,
    // @ts-ignore
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
/**
 * 转换模板数据函数
 * 将模板字符串转换为可用的模板数据结构
 *
 * @param template - 模板JSON字符串
 * @param templateType - 模板类型
 * @param storeInfo - 店铺信息
 * @returns 转换后的模板数据数组
 */
export const transformTemplate = async ({
  template,
  templateType,
  storeInfo,
  getCustomTemplateOptionList,
}: {
  getCustomTemplateOptionList: (params?: any) => Promise<any[]>;
  storeInfo: any; // 店铺信息对象
  template: string; // 模板JSON字符串
  templateType: TemplateType; // 模板类型枚举
}) => {
  // 参数校验：如果模板或模板类型为空，直接返回空数组
  if (!template || !templateType) return [];

  // 调用API获取自定义模板选项列表
  const tempOriginData = await getCustomTemplateOptionList({
    template_type: templateType, // 模板类型
    type: 'COLUMN', // 固定类型为列
  });

  // 数据校验：如果没有获取到原始数据，返回空数组
  if (!tempOriginData) return [];

  try {
    // 解析模板JSON字符串为对象
    const tempData = JSON.parse(template);

    // 遍历模板数据，转换每个模板项
    return tempData.map((item: any) => {
      // 判断是否为表格类型的模板项（通过column_option_code是否为数组来判断）
      if (Array.isArray(item?.column_option_code)) {
        // 处理表格类型模板项
        // 从表格树中获取对应的选项代码
        const { tableOptionCode } = getTableTreeId(
          item.column_option_code, // 列选项代码数组
          tempOriginData, // 原始模板数据
          storeInfo, // 店铺信息
        );
        // 生成表格项JSON数据并返回
        return generateTableItemJson(tableOptionCode, storeInfo, item);
      }

      // 处理普通模板项
      // 从原始数据中查找对应的模板项配置
      let tempItem = tempOriginData.find(
        (tempItem: any) => tempItem.id === item.id,
      );
      if (!tempItem) {
        tempItem = { ...item };
      }

      // 合并模板项数据：原始项 + 配置项 + 样式
      return {
        ...item, // 原始模板项数据
        ...tempItem, // 从API获取的配置数据
        style: item.style || {}, // 样式配置，如果没有则使用空对象
      };
    });
  } catch {
    return []; // 返回空数组
  }
};
