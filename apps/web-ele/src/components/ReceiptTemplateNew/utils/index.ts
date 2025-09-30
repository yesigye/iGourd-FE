// 导入自定义模板服务API
import { getCustomTemplateListApi } from '@@/sale/apis';

// 导入模板工具函数
import {
  generateTableItemJson, // 生成表格项JSON数据
  getTableTreeId, // 获取表格树ID
} from '#/utils/template';
// 导入模板类型定义

type TemplateType =
  | 'BARCODE_LABEL'
  | 'PRELIMINARY_BILL_RECEIPT'
  | 'PRICE_TAG'
  | 'RECEIPT'
  | 'REFUND_RECEIPT';

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
}: {
  storeInfo: any; // 店铺信息对象
  template: string; // 模板JSON字符串
  templateType: TemplateType; // 模板类型枚举
}) => {
  // 参数校验：如果模板或模板类型为空，直接返回空数组
  if (!template || !templateType) return [];

  // 调用API获取自定义模板选项列表
  const res = await getCustomTemplateListApi({
    template_type: templateType, // 模板类型
    type: 'COLUMN', // 固定类型为列
  });

  // 提取响应数据
  const tempOriginData = res?.data;

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
    // 异常处理：JSON解析失败或其他错误
    return []; // 返回空数组
  }
};
