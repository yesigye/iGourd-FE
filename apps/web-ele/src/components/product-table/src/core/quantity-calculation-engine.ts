import type { Ctx, LineItem } from '../types';

export interface CalculationParams {
  quantity: number;
  costPrice: number;
  vatRate?: number;
  otherTaxRate?: number;
  discountPercentage?: number;
  vatMode?: string;
}

export interface CalculationResult {
  subtotalAmount: number;
  vatAmount: number;
  otherTaxAmount: number;
  discountAmount: number;
  totalAmount: number;
  formattedTotalAmount: string;
}

/**
 * 统一的数量计算引擎
 * 处理所有与数量相关的金额计算逻辑
 */
export const QuantityCalculationEngine = {
  /**
   * 计算总金额
   */
  calculate(params: CalculationParams): CalculationResult {
    const {
      quantity,
      costPrice,
      vatRate = 0,
      otherTaxRate = 0,
      discountPercentage = 0,
      vatMode = 'NOT_APPLICATION',
    } = params;

    // 计算小计金额
    const subtotalAmount = quantity * costPrice;

    // 计算税费
    let vatAmount = 0;
    let otherTaxAmount = 0;

    if (vatMode === 'VAT_EXCLUSIVE') {
      vatAmount = subtotalAmount * vatRate;
      otherTaxAmount = subtotalAmount * otherTaxRate;
    }

    // 计算折扣
    const discountAmount = subtotalAmount * (discountPercentage / 100);

    // 计算总金额
    const totalAmount =
      subtotalAmount + vatAmount + otherTaxAmount - discountAmount;

    return {
      subtotalAmount,
      vatAmount,
      otherTaxAmount,
      discountAmount,
      totalAmount,
      formattedTotalAmount: totalAmount.toFixed(2),
    };
  },

  /**
   * 从行数据计算总金额
   */
  calculateFromRow(
    row: LineItem,
    ctx: Ctx,
    quantityField: string = 'display_quantity',
  ): CalculationResult {
    const quantity = (row as any)[quantityField] || 0;

    return this.calculate({
      quantity,
      costPrice: row.cost_price || 0,
      vatRate: row.vat_rate || 0,
      otherTaxRate: row.other_tax_rate || 0,
      discountPercentage: row.discount_percentage || 0,
      vatMode: ctx.vatMode,
    });
  },

  /**
   * 批量计算多行数据
   */
  calculateBatch(
    rows: LineItem[],
    ctx: Ctx,
    quantityField: string = 'display_quantity',
  ): CalculationResult[] {
    return rows.map((row) => this.calculateFromRow(row, ctx, quantityField));
  },
};
