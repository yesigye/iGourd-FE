import type { Ctx, LineItem } from '../types';

import { onFieldValueChange } from '@igourd/common-ui';

import { calcLineAmounts } from '../core/calc-engine';
import { handleQuantityChangeLocal } from '../core/quantity-engine';
import { toNum } from '../utils/shared-calculations';

/**
 * 创建 TransferMode 专用的 Legacy 字段同步 Effect
 * 处理 display_quantity 和 transfer_quantity 之间的同步
 */
export function createTransferLegacyEffect(basePath: string, ctx: Ctx) {
  return () => {
    // 监听 display_quantity 变化，同步到 transfer_quantity
    onFieldValueChange(`${basePath}.*.display_quantity`, (field) => {
      const rowIndex = field.index;
      if (rowIndex >= 0) {
        const form = field.value.form;
        const rowData = form?.values?.[basePath]?.[rowIndex] as LineItem;

        if (rowData) {
          const next = handleQuantityChangeLocal({
            ...rowData,
            display_quantity: field.value ?? 0,
          });

          const unit = next.unit_code ?? 'minor';
          const ratio = Math.max(+next.basic_unit_radio! || 1, 1);
          const legacyVal =
            unit === 'major'
              ? +next.display_quantity! * ratio
              : +next.display_quantity!;

          // 更新 transfer_quantity
          form?.setValuesIn(
            `${basePath}.${rowIndex}.transfer_quantity`,
            Number.isFinite(legacyVal) ? legacyVal : 0,
          );

          // 更新 quantity_base
          form?.setValuesIn(
            `${basePath}.${rowIndex}.quantity_base`,
            next.quantity_base || 0,
          );

          // 计算并更新总金额
          const updatedRow = calcLineAmounts(next, ctx.vatMode);
          form?.setValuesIn(
            `${basePath}.${rowIndex}.total_amount`,
            updatedRow.total_amount,
          );
        }
      }
    });

    // 监听 transfer_quantity 变化，同步到 display_quantity
    onFieldValueChange(`${basePath}.*.transfer_quantity`, (field) => {
      const rowIndex = field.index;
      if (rowIndex >= 0) {
        const form = field.value.form;
        const rowData = form?.values?.[basePath]?.[rowIndex] as LineItem;

        if (rowData) {
          const lv = toNum(field.value);
          if (lv !== null) {
            const unit = rowData.unit_code ?? 'minor';
            const ratio = Math.max(+rowData.basic_unit_radio! || 1, 1);
            const displayVal = unit === 'major' ? lv / ratio : lv;

            // 更新 display_quantity
            form?.setValuesIn(
              `${basePath}.${rowIndex}.display_quantity`,
              displayVal,
            );
          }
        }
      }
    });
  };
}
