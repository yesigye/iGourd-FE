import type { Ctx, LineItem, ModePlugin, ProductTableEvent } from '../types';

import { ScanCodeEntry } from '#/components';

export const ReceiptMode: ModePlugin = {
  id: 'receipt',

  columns(_ctx) {
    return [
      {
        name: 'product_code',
        title: '{{t("common.purchase.product-code")}}',
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          width: 150,
        },
      },
      {
        name: 'major_name',
        title: 'major_name',
        'x-component': 'PreviewText.Input',
        'x-hidden': true,
      },
      {
        name: 'product_id',
        title: '{{t("common.purchase.major-name")}}',
        'x-component': 'ProductTable.ProductCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 260,
        },
        'x-validator': [
          {
            required: true,
            message: "{{t('common.validate.required')}}",
          },
        ],
        'x-decorator-props': {
          required: true,
        },
        'x-content': {
          header: ScanCodeEntry,
        },
      },
      {
        name: 'sku_barcode',
        title: '{{t("common.purchase.product-barcode")}}',
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          width: 160,
        },
      },
      {
        name: 'received_quantity',
        type: 'number',
        title: '{{t("common.purchase.quantity")}}',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 160,
          min: 0,
        },
        'x-validator': [
          {
            required: true,
            message: "{{t('common.validate.required')}}",
          },
        ],
        'x-reactions': {
          fulfill: {
            state: {
              'x-component-props.max':
                '{{$values?.purchase_order_no ? $record?.purchase_quantity : Number.MAX_SAFE_INTEGER}}',
            },
          },
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
        title: '{{t("common.purchase.sub-product-stock-search-models")}}',
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
        title: '{{t("common.purchase.basic-unit-radio")}}',
        type: 'void',
        'x-component': 'PreviewText.Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 160,
        },
        'x-reactions': {
          fulfill: {
            state: {
              value: '{{$self.value ? "1:"+ $self.value: "" }}',
            },
          },
        },
      },
      {
        name: 'major_unit_name',
        title: '{{t("common.purchase.major-unit-name")}}',
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          width: 100,
        },
      },
      {
        name: 'cost_price',
        type: 'number',
        title: '{{t("common.purchase.cost-price")}}',
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
        title: '{{t("common.purchase.total-amount")}}',
        'x-component': 'PreviewText.Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 200,
        },
      },
      {
        name: 'product_spec_kvmessage',
        title: '{{t("common.purchase.product-spec-kvmessage")}}',
        'x-component': 'PreviewText.Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          width: 200,
        },
      },
    ];
  },

  mergeColumnsForRowSpan() {
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
