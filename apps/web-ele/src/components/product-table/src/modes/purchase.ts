import type { Ctx, LineItem, ModePlugin, ProductTableEvent } from '../types';

import { ScanCodeEntry } from '#/components';

const safeParseFloat = (value: number | string): number => {
  if (typeof value === 'number') return value;
  return Number.parseFloat(value) || 0;
};

const calculateTax = (baseAmount: number, taxConfig?: any): number => {
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

export const PurchaseMode: ModePlugin = {
  id: 'purchase',

  quantityBridge: {
    legacyKeys: ['enter_quantity'],
    getTotalAmount(value: number, row: LineItem, ctx: Ctx) {
      const { cost_price } = row;
      const subtotalAmount = value * cost_price;
      let otherTaxAmount: number = 0;
      let vatAmount: number = 0;
      if (ctx.vatMode === 'VAT_EXCLUSIVE') {
        vatAmount = calculateTax(subtotalAmount, row?.vat_tax);
        otherTaxAmount = calculateTax(subtotalAmount, row?.other_tax);
      }
      const discountAmount =
        subtotalAmount * (safeParseFloat(row.discount_percentage || 0) / 100);
      const totalAmount =
        subtotalAmount + vatAmount + otherTaxAmount - discountAmount;

      return totalAmount.toFixed(2);
    },
  },

  columns(_ctx) {
    return [
      {
        key: 'product_code',
        type: 'string',
        title: '{{t("common.purchase.product_code")}}',
        width: 160,
        component: 'PreviewText.Input',
      },
      {
        key: 'product_id',
        type: 'string',
        title: 'product_id',
        visibleWhen: (_ctx) => false,
      },
      {
        key: 'major_name',
        type: 'string',
        title: '{{t("common.purchase.major_name")}}',
        width: 260,
        component: 'ProductTable.ProductCell',
        decorator: 'FormItem',
        required: true,
        headerContent: {
          header: ScanCodeEntry,
        },
      },
      {
        key: 'sku_barcode',
        type: 'string',
        title: '{{t("common.purchase.product_barcode")}}',
        width: 160,
        component: 'PreviewText.Input',
      },
      {
        key: 'ware_house',
        title: '{{t("common.warehouse")}}',
        width: 160,
        decorator: 'FormItem',
        component: 'Select',
        reactions: {
          dependencies: ['warehouse_id'],
          fulfill: {
            state: {
              dataSource: '{{ warehouse.value }}',
              value: '{{$deps[0]}}',
            },
          },
        },
      },
      {
        key: 'product_unit_code',
        title: '{{t("common.purchase.sub_product_stock_search_models")}}',
        width: 150,
        component: 'ProductTable.UnitCell',
        decorator: 'FormItem',
      },
      {
        key: 'basic_unit_radio',
        title: '{{t("common.purchase.basic_unit_radio")}}',
        width: 160,
        decorator: 'FormItem',
        component: 'PreviewText.Input',
        reactions: {
          fulfill: {
            state: {
              display: '{{$self.value ? "1:"+ $self.value: "" }}',
            },
          },
        },
      },
      {
        key: 'major_unit_name',
        title: '{{t("common.purchase.major_unit_name")}}',
        width: 100,
        component: 'PreviewText.Input',
      },
      {
        key: 'cost_price',
        type: 'number',
        title: '{{t("common.purchase.cost_price")}}',
        width: 140,
        component: 'PreviewText.Input',
        decorator: 'FormItem',
        required: true,
      },
      {
        key: 'quantity',
        type: 'number',
        title: '{{t("common.purchase.quantity")}}',
        width: 160,
        component: 'ProductTable.QuantityCell',
      },

      {
        key: 'total_amount',
        type: 'number',
        title: '{{t("common.purchase.total_amount")}}',
        width: 200,
        component: 'PreviewText.Input',
        decorator: 'FormItem',
      },
      {
        key: 'product_spec_kvmessage',
        title: '{{t("common.purchase.product_spec_kvmessage")}}',
        width: 200,
        component: 'PreviewText.Input',
        decorator: 'FormItem',
      },
      // // optional

      {
        key: 'purchase_qty',
        title: '{{t("common.purchase.purchase_qty")}}',
        width: 100,
        component: 'PreviewText.Input',
      },
    ];
  },

  mergeColumnsForRowSpan() {
    // 复刻：按 product_barcode 合并某些列（示例用库存预警列）
    return [
      {
        columnKey: 'stock_warning_quantity',
        byField: 'product_barcode' as any,
      },
    ];
  },

  handleEvent(_evt: ProductTableEvent, data: LineItem[], _ctx: Ctx) {
    // most logic handled in QuantityCell via bridge; keep placeholder for extendability
    return data;
  },
};
