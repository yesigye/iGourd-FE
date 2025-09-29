import Decimal from 'decimal.js';

//  * @param expression 计算表达式
//  * @param format 格式化参数
//  * @returns 计算结果 number
//  */

// 加法
export const addDecimal = (num1: number, num2: number) => {
  return new Decimal(num1).plus(num2).toNumber();
};

// 减法
export const subtractDecimal = (num1: number, num2: number) => {
  return new Decimal(num1).minus(num2).toNumber();
};

// 乘法
export const timesDecimal = (num1: number, num2: number) => {
  return new Decimal(num1).times(num2).toNumber();
};

// 除法
export const divideDecimal = (num1: number, num2: number) => {
  return new Decimal(num1).div(num2).toNumber();
};
