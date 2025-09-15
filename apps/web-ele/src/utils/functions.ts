import Decimal from 'decimal.js';
// 对象字段映射到数组对象字段
export function filterAndUpdateDynamicFields(sourceObject: { [x: string]: any; }, dynamicLabelList: any[]) {
  return dynamicLabelList.map((item: { field: string | number; }) => {
    if (Object.prototype.hasOwnProperty.call(sourceObject, item.field)) {
      const value = sourceObject[item.field];
      return {
        ...item,
        value:
          value !== null && value !== undefined && value !== '' ? value : '-',
      };
    }
    return item;
  });
}

export const dynamicStyle = (number: { toString: () => { (): any; new(): any; length: any; }; }) => {
  const length = number.toString().length;
  let fontSize = '14px';
  if (length > 9) fontSize = '14px';
  if (length > 10) fontSize = '14px';
  if (length > 11) fontSize = '14px';
  if (length > 12) fontSize = '14px';
  // if (length > 16) fontSize = '20px';
  // if (length > 18) fontSize = '18px';
  // if (length > 20) fontSize = '16px';
  // if (length > 22) fontSize = '14px';
  // if (length > 24) fontSize = '12px';
  return { fontSize };
};

//转化数字为千分位，并处理金额精度问题
export const formatNumber = (
  num: number | string,
  decimals: number = 2,
  showDecimalsAlways: boolean = false,
) => {
  try {
    if (!num) return num;
    // 使用Decimal处理精度问题
    const decimalNum = new Decimal(num);

    // 如果不需要总是显示小数位且数字是整数，则不显示小数部分
    if (!showDecimalsAlways && decimalNum.isInteger()) {
      return decimalNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 否则格式化为指定小数位数
    return decimalNum.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    console.error(error);
    return num;
  }
};

export const formatTimeByTimezone = (
  timeZoneId: string,
  date?: Date,
): string => {
  try {
    if (!timeZoneId) return '';
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timeZoneId,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const formatter = new Intl.DateTimeFormat('zh-CN', options);
    return formatter.format(date || new Date());
  } catch (error) {
    console.error('格式化时间失败', error);
    return '';
  }
};

export const getTimezoneDate = (timeZoneId: string, date?: Date): Date => {
  try {
    if (!timeZoneId) return new Date();
    const targetDate = date || new Date();
    const utcDate = new Date(
      targetDate.toLocaleString('en-US', { timeZone: 'UTC' }),
    );
    const tzDate = new Date(
      targetDate.toLocaleString('en-US', { timeZone: timeZoneId }),
    );
    const offset = utcDate.getTime() - tzDate.getTime();
    return new Date(targetDate.getTime() + offset);
  } catch (error) {
    console.error('获取时区时间失败', error);
    return new Date();
  }
};
