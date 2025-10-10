import { calc } from 'a-calc';

export * from './helpers';
export * from './helpers/decimal';
export * from './helpers/service';
export * from './print';
export * from '@igourd-core/shared/cache';
export * from '@igourd-core/shared/color';

export function formatRangeTime() {}

export * from '@igourd-core/shared/utils';

const calcOptions: any = { _fmt: '=8 ~5', _error: 0, _mode: 'space-all' };
/**
 * @param expression 计算表达式
 * @param format 格式化参数
 * @returns 计算结果 number
 */
export const getCalc = (expression: string, format = calcOptions): number => {
  return +calc(expression, { ...calcOptions, ...format });
};
