// 共享的计算逻辑工具函数
import type { Ctx, LineItem } from '../types';

/**
 * 安全的数字解析
 */
export const safeParseFloat = (value: number | string): number => {
  if (typeof value === 'number') return value;
  return Number.parseFloat(value) || 0;
};

/**
 * 税务计算
 */
export const calculateTax = (baseAmount: number, taxConfig?: any): number => {
  if (!taxConfig) return 0;

  try {
    switch (taxConfig.calculation_type) {
      case 'FIXED_PER_UNIT': {
        return safeParseFloat(taxConfig.tax_amount || 0);
      }
      case 'PERCENTAGE': {
        return baseAmount * (safeParseFloat(taxConfig.percentage || 0) / 100);
      }
      default: {
        return 0;
      }
    }
  } catch (error) {
    console.error('Tax calculation error:', error);
    return 0;
  }
};


/**
 * 数字转换工具
 */
export const toNum = (v: any) =>
  v === null || v === '' || Number.isNaN(+v) ? null : +v;
