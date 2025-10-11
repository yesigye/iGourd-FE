/**
 * @description 数字格式化参数
 * currency: 货币
 *   - CNY：人民币  CN¥1,234.10
 *   - USD：美元   $1,234.12346
 *   - EUR：欧元   €1,234.10
 *   - JPY：日元   ¥1,234.10
 *   - GBP：英镑   £1,234.10
 *   - AUD：澳大利亚元  A$1,234.10
 *   - INR：印度卢比  ₹1,234.10
 *   - RUB：俄罗斯卢布
 */
export type formatOptions = {
  /** @description 语言 */
  locale?: 'en-US' | 'zh-CN' | string;
} & Intl.NumberFormatOptions;

/** @description 金额格式化
 * @returns {string} 格式化后的金额 e.g. $1,000.00
 */
export const formatTool = (
  money: bigint | Intl.StringNumericLiteral | number,
  locale?: string,
  options?: Intl.NumberFormatOptions,
) => {
  const defaultOpts = {
    ...options,
  } as Intl.NumberFormatOptions;
  const numberFormat = new Intl.NumberFormat(locale ?? 'en-US', defaultOpts);
  return numberFormat.format(money);
};

/**
 * @description 金额格式化
 * @param money 金额  默认最小精度0，最大精度4
 * @returns {string} 格式化后的金额 e.g. $1,000.00
 */
export const moneyFormat = (
  money: bigint | Intl.StringNumericLiteral | number,
  options?: formatOptions,
) => {
  const { locale, ...opts } = options || {};
  return formatTool(money, locale, {
    // 目前金钱的格式化只是货 《币符号》+《金额》，不需要这里添加货币单位
    // style: 'currency',
    // currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
    ...opts,
  });
};
/**
 * @description 数字格式化,有精度问题
 * @param count  数值 默认最小精度0，最大精度8
 */
export const numberFormat = (
  count: bigint | Intl.StringNumericLiteral,
  options?: formatOptions,
) => {
  const { locale, ...opts } = options || {};
  return formatTool(count, locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
    ...opts,
  });
};

/**
 * @description 百分比格式化
 * @param value 需要格式化的数值（0.1 表示 10%） 默认精度2
 * @returns {string} 格式化后的百分比 e.g. 10%
 */
export const percentFormat = (
  value: bigint | Intl.StringNumericLiteral | number,
  options?: formatOptions,
) => {
  const { locale, ...opts } = options || {};
  return formatTool(value, locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  });
};
