export function isDef(val: any) {
  return (
    val !== undefined && val !== null && val !== 'null' && val !== 'undefined'
  );
}
// 千分位分隔符
export function thousandSeparator(value: number | string) {
  if (!isDef(value)) {
    return value;
  }
  return value.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
}
/**
// 合并两个数组，相同 id 的对象合并
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 合并后的数组
*/
export const mergeByIdArray = (arr1: any[], arr2: any[]) => {
  const result: any[] = [];
  for (const cur of arr1) {
    const findItem = arr2.find((item) => cur.id === item.product_id);
    cur.calcInfo = findItem || {};
    cur.custom_price = findItem?.custom_price || 0;
    result.push(cur);
  }
  return result;
};

/**
 * @description: 初始化并获取当前商户的货币符号
 * @returns {Promise<string>} 返回当前商户的货币符号
 */
export async function initializeCurrencySymbol() {
  try {
    const useStore = useUserStore();
    const { currencySymbol } = useStore;

    return currencySymbol;
  } catch (error) {
    console.error('获取货币符号失败:', error);
    return '';
  }
}
/**
  自增数字并补零*/
export function incrementAndPad(number: number, padLength: number) {
  return String(number++).padStart(padLength, '0');
}

/**
 * @description: 解析时间
 * @param time 时间
 * @param cFormat 格式
 * @param delZero 是否删除前导零
 * @returns 解析后的时间字符串
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
/**
 *
 * @param num 需要保留小数位数的数字
 * @param dec 小数位数
 * @returns
 */
export const retainDecimal8 = (num, dec) => {
  if (!num) return 0;
  num = num.toString();
  const index = num.indexOf('.');
  num = index === -1 ? [...num] : num.slice(0, Math.max(0, dec + index + 1));
  const str = Number.parseFloat(num).toFixed(dec);
  if (dec == 8) {
    return str.replace(/\.?0{1,8}$/, '') * 1;
  }
  return str.replace(/\.?0{1,2}$/, '') * 1;
};
