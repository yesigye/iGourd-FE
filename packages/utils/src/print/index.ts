/**
 * @description 获取文本的字符数
 */
export const getTextRealLength = (text: string): number => {
  let realLength = 0;
  for (let i = 0; i < text.length; i++) {
    // eslint-disable-next-line unicorn/prefer-code-point
    realLength += text.charCodeAt(i) > 255 ? 2 : 1;
  }
  return realLength;
};

/**
 * @description 判断是否为占位符
 * @param str 字符串
 * @returns { isPlaceholder: boolean, value: string }
 */
//
const extractPlaceholderValue = (str: string) => {
  // 正则表达式匹配${xxx}格式，并捕获xxx部分
  const regex = /\$\{([^{}]+)\}/;

  // 使用正则测试是否匹配该格式
  const isPlaceholder = regex.test(str);

  if (isPlaceholder) {
    // 如果是占位符格式，提取中间的值
    const matches = str.match(regex);
    return {
      isPlaceholder: true,
      value: matches?.[1], // 返回捕获组中的值
    };
  } else {
    // 如果不是占位符格式
    return {
      isPlaceholder: false,
      value: str,
    };
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
  optionValue: any,
  affixText: string,
  isSuffix: boolean,
  storeData: Record<string, any>,
) => {
  if (!affixText) return String(optionValue);
  const extract = extractPlaceholderValue(affixText);
  const stringValue = String(optionValue);
  if (extract.isPlaceholder) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
