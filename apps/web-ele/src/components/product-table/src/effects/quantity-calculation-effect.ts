import type { Ctx, LineItem, ModePlugin } from '../types';

import { onFieldValueChange } from '@igourd/common-ui';

import { QuantityCalculationEngine } from '../core/quantity-calculation-engine';

/**
 * 创建数量计算 Effect
 * 自动监听相关字段变化并计算总金额
 */
export function createQuantityCalculationEffect(
  basePath: string,
  ctx: Ctx,
  mode: ModePlugin,
) {
  const quantityField = getQuantityField(mode);

  // 监听数量变化，自动计算总金额
  onFieldValueChange(`${basePath}.*.${quantityField}`, (field) => {
    const rowIndex = field.index;
    if (rowIndex >= 0) {
      const form = field.form;
      const rowData = form?.values?.[basePath]?.[rowIndex] as LineItem;

      if (rowData) {
        const result = QuantityCalculationEngine.calculateFromRow(
          rowData,
          ctx,
          quantityField,
        );

        // 更新总金额字段
        form?.setValuesIn(
          `${basePath}.${rowIndex}.total_amount`,
          result.formattedTotalAmount,
        );
      }
    }
  });

  // 监听成本价变化，重新计算总金额
  onFieldValueChange(`${basePath}.*.cost_price`, (field) => {
    const rowIndex = field.index;
    if (rowIndex >= 0) {
      const form = field.form;
      const rowData = form?.values?.[basePath]?.[rowIndex] as LineItem;

      if (rowData) {
        const result = QuantityCalculationEngine.calculateFromRow(
          rowData,
          ctx,
          quantityField,
        );

        form?.setValuesIn(
          `${basePath}.${rowIndex}.total_amount`,
          result.formattedTotalAmount,
        );
      }
    }
  });

  // 监听税率变化
  onFieldValueChange(`${basePath}.*.vat_rate`, (field) => {
    const rowIndex = field.index;
    if (rowIndex >= 0) {
      const form = field.form;
      const rowData = form?.values?.[basePath]?.[rowIndex] as LineItem;

      if (rowData) {
        const result = QuantityCalculationEngine.calculateFromRow(
          rowData,
          ctx,
          quantityField,
        );

        form?.setValuesIn(
          `${basePath}.${rowIndex}.total_amount`,
          result.formattedTotalAmount,
        );
      }
    }
  });

  // 监听其他税率变化
  onFieldValueChange(`${basePath}.*.other_tax_rate`, (field) => {
    const rowIndex = field.index;
    if (rowIndex >= 0) {
      const form = field.form;
      const rowData = form?.values?.[basePath]?.[rowIndex] as LineItem;

      if (rowData) {
        const result = QuantityCalculationEngine.calculateFromRow(
          rowData,
          ctx,
          quantityField,
        );

        form?.setValuesIn(
          `${basePath}.${rowIndex}.total_amount`,
          result.formattedTotalAmount,
        );
      }
    }
  });

  // 监听折扣百分比变化
  onFieldValueChange(`${basePath}.*.discount_percentage`, (field) => {
    const rowIndex = field.index;
    if (rowIndex >= 0) {
      const form = field.form;
      const rowData = form?.values?.[basePath]?.[rowIndex] as LineItem;

      if (rowData) {
        const result = QuantityCalculationEngine.calculateFromRow(
          rowData,
          ctx,
          quantityField,
        );

        form?.setValuesIn(
          `${basePath}.${rowIndex}.total_amount`,
          result.formattedTotalAmount,
        );
      }
    }
  });
}

/**
 * 获取模式对应的数量字段名
 */
function getQuantityField(mode: ModePlugin): string {
  // 根据模式 ID 返回对应的数量字段
  switch (mode.id) {
    case 'physical': {
      return 'physical_quantity';
    }
    case 'purchase': {
      return 'quantity';
    }
    case 'receipt': {
      return 'received_quantity';
    }
    case 'return': {
      return 'returned_quantity';
    }
    case 'spoilage': {
      return 'returned_quantity';
    }
    case 'transfer': {
      return 'display_quantity';
    } // transfer 使用 display_quantity
    default: {
      return 'display_quantity';
    }
  }
}
