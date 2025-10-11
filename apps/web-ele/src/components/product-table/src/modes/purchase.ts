import type { Ctx, LineItem, ModePlugin, ProductTableEvent } from '../types';

import { ScanCodeEntry } from '#/components';
export const PurchaseMode: ModePlugin = {
  id: 'purchase',

  columns(_ctx) {
    return [
      {
        name: 'product_code',
        title: '{{t("common.purchase.product_code")}}',
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          width: 160,
        },
      },
      {
        name: 'product_id',
        title: 'product_id',
        'x-component': 'PreviewText.Input',
        'x-hidden': true,
        'x-reactions': {
          fulfill: {
            state: {
              'x-hidden': true,
            },
          },
        },
      },
      {
        name: 'major_name',
        title: '{{t("common.purchase.major_name")}}',
        'x-component': 'ProductTable.ProductCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 260,
        },
        'x-decorator-props': {
          required: true,
        },
        'x-content': {
          header: ScanCodeEntry,
        },
      },
      {
        name: 'product_barcode',
        title: '{{t("common.purchase.product_barcode")}}',
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          width: 160,
        },
      },
      {
        name: 'quantity',
        type: 'number',
        title: '{{t("common.purchase.quantity")}}',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 160,
        },
      },
      {
        name: 'ware_house',
        title: '{{t("common.warehouse")}}',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 160,
        },
        'x-reactions': {
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
        name: 'product_unit_code',
        title: '{{t("common.purchase.sub_product_stock_search_models")}}',
        'x-component': 'ProductTable.UnitCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 150,
        },
      },
      {
        name: 'basic_unit_radio',
        type: 'number',
        'x-hidden': true,
      },
      {
        name: 'basic_unit_radio_display',
        type: 'void',
        title: '{{t("common.purchase.basic_unit_radio")}}',
        'x-component': 'PreviewText.Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 160,
        },
        'x-reactions': {
          dependencies: ['.basic_unit_radio'],
          fulfill: {
            state: {
              value: '{{ $deps[0] ? "1:"+ $deps[0]: "" }}',
            },
          },
        },
      },
      {
        name: 'major_unit_name',
        title: '{{t("common.purchase.major_unit_name")}}',
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          width: 100,
        },
      },
      {
        name: 'cost_price',
        type: 'number',
        title: '{{t("common.purchase.cost_price")}}',
        'x-component': 'PreviewText.Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 140,
        },
        'x-decorator-props': {
          required: true,
        },
      },

      {
        name: 'total_amount',
        type: 'number',
        title: '{{t("common.purchase.total_amount")}}',
        'x-component': 'PreviewText.Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 200,
        },
      },
      {
        name: 'product_spec_kvmessage',
        title: '{{t("common.purchase.product_spec_kvmessage")}}',
        'x-component': 'PreviewText.Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 200,
        },
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
