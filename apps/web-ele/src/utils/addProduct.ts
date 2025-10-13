import { random } from '@igourd/utils';

import Decimal from 'decimal.js';
/**
 * @file 金额相关操作
 */

export function parseTime(
  time: Date | null | number | string,
  cFormat?: string,
  delZero?: boolean,
) {
  if (arguments.length === 0) {
    return '-';
  }
  if (time === null) {
    return '-';
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (time === '') {
    date = new Date();
  } else if (typeof time === 'object') {
    date = time;
  } else if (!isNaN(time as number) && `${time}`.length === 10) {
    time = Number.parseInt(time as string) * 1000;
  } else {
    if (String(time).includes('T')) {
      time = (time as string).replaceAll('T', ' ').replaceAll(/\..*/g, '');
    }
    if (String(time).includes('-') || String(time).includes('.')) {
      time = (time as string).replaceAll(/-|\./g, '/');
    }
    date = new Date(time);
  }
  if (!date) return '';
  const formatObj: Record<string, number> = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const timeStr = format.replaceAll(
    /\{([ymdhisa])+\}/g,
    (result, key): string => {
      const value = formatObj[key] as number;
      let smallValue = '';
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      if (result.length > 0 && value < 10 && !delZero) {
        smallValue = `0${value}`;
      }
      return smallValue || `${value}` || '0';
    },
  );

  return timeStr;
}
// 生成13位随机商品编码
export const randomBarcode = () => {
  const time = parseTime(Date.now(), '{y}{m}{d}');
  const randomNumStr = random(10_000, 99_999, false); // 生成5位随机数
  return `${time}${randomNumStr}`;
};

export const randomProductCode = () => {
  const randomNumStr = random(100_000, 999_999, false); // 生成6位随机数
  return `PC${randomNumStr}`;
};

/**
 * 数量   小数 8    整数 7
 * 金额   小数 4    整数 11
 * 税     小数 2    整数 3
 * 汇率   小数 8    整数 7
 */

/** 金额最大值 */
export const MoneyMax = Decimal('99999999999.99');
/** 记账笔记金额最大值 */
export const JournalMoneyMax = Decimal('999999999.99');

/** 金额最小值 */
export const MoneyMin = Decimal('0.0001');

/** 税最大值 */
export const TaxMax = Decimal('99.99');

/** 税最小值 */
export const TaxMin = Decimal('0.00');

/** 汇率最大值 */
export const RateMax = Decimal('99999999.99999999');

/** 汇率最小值 */
export const RateMin = Decimal('0.00000001');

/** * 数字最大值 */
export const NumberMax = Decimal('9999999.99999999');

/** 判断金额是否超限制 */
export const isMoneyOverLimit = (value: number) => {
  const money = Decimal(value);
  if (money.isNaN()) return 0;
  return money.greaterThan(MoneyMax);
};

/** 限制金额大于0 小于 99999999999.9999*/
export const limitMoney = (
  value: number | string,
  max = MoneyMax,
  min = MoneyMin,
) => {
  let money = Decimal(value);

  if (money.isNaN()) return 0;
  // 小数位数是否超过限制
  if (money.decimalPlaces() > 4) {
    money = Decimal(money.toFixed(4));
  }
  // 超过最大值
  if (money.greaterThan(max)) return max;
  // 小于最小值
  if (money.lessThan(min)) return min;
  return money.toString();
};
