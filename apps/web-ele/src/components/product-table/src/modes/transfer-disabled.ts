import type { ModePlugin } from '../types';

export const TransferDisabledMode: ModePlugin = {
  id: 'transfer-disabled',
  columns(_ctx) {
    return [
      {
        name: 'major_name',
        type: 'string',
        title: 'product_id',
        'x-hidden': true,
      },
      {
        name: 'product_id',
        title: "{{t('common.purchase.major-name')}}",
        'x-component': 'ProductTable.ProductCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 360 },
        },
        'x-decorator-props': {
          required: true,
        },
        'x-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              disabled: "{{ ['OUTBOUND','INBOUND','APPROVED'].indexOf($deps[0])>=0}}",
            },
          },
        },
      },
      {
        name: 'unit_select',
        title: "{{t('common.purchase.sub-product-stock-search-models')}}",
        'x-component': 'ProductTable.UnitCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 160 },
        },
        'x-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              disabled: "{{ ['OUTBOUND','INBOUND','APPROVED'].indexOf($deps[0])>=0}}",
            },
          },
        },
      },
      {
        name: 'sku_barcode',
        title: "{{t('common.purchase.sku-barcode')}}",
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          style: { width: 200 },
          disabled: true,
        },
      },
      {
        name: 'difference_qty',
        title: '',
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          style: { width: 40 },
        },
        'x-col-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              hidden:
                "{{ ['OUTBOUND','INBOUND','ADD','EDIT'].indexOf($deps[0])>=0}}",
            },
          },
        },
      },
      {
        name: 'last_review_confirm',
        title: "{{t('common.purchase.difference-qty-new')}}",
        'x-component': 'Radio.Group',
        'x-decorator': 'FormItem',
        enum: [
          {
            label: "{{t('common.purchase.transfer-by-quantity')}}",
            value: 'IN',
          },
          {
            label: "{{t('common.purchase.transfer-by-out-quantity')}}",
            value: 'OUT',
          },
        ],
        'x-col-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              hidden:
                "{{ ['OUTBOUND','INBOUND','ADD','EDIT'].indexOf($deps[0])>=0}}",
            },
          },
        },
        'x-component-props': {
          style: { width: 300 },
        },
      },
      {
        name: 'transfer_in_quantity',
        type: 'number',
        title: "{{t('common.purchase.transfer-in-quantity')}}",
        'x-component': 'ProductTable.QuantityCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 140 },
        },
        'x-col-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              hidden:
                "{{ ['OUTBOUND','ADD','EDIT','APPROVED'].indexOf($deps[0])>=0}}",
            },
          },
        },
        'x-decorator-props': {
          // required: true,
        },
      },
      {
        name: 'transfer_out_quantity',
        type: 'number',
        title: "{{t('common.purchase.transfer-out-quantity')}}",
        'x-component': 'ProductTable.QuantityCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 140 },
        },
        'x-decorator-props': {
          // required: true,
        },
        'x-col-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              hidden:
                "{{ ['INBOUND','ADD','EDIT','APPROVED'].indexOf($deps[0])>=0}}",
            },
          },
        },
      },

      {
        name: 'transfer_quantity',
        type: 'number',
        title: "{{t('common.purchase.transfer-quantity')}}",
        'x-component': 'ProductTable.QuantityCell',
        'x-decorator': 'FormItem',
        'x-component-props': {
          style: { width: 140 },
        },
        'x-decorator-props': {
          required: true,
        },
        'x-reactions': {
          dependencies: ['form_type'],
          fulfill: {
            state: {
              disabled: "{{ ['INBOUND','APPROVED'].indexOf($deps[0])>=0}}",
            },
          },
        },
      },
      {
        name: 'quantity_base',
        type: 'number',
        title: "{{t('common.purchase.base-quantity')}}",
        'x-component': 'PreviewText.Input',
        'x-component-props': {
          style: { width: 120 },
        },
      },

      {
        name: 'remark',
        title: "{{t('common.remarks')}}",
        'x-component': 'Input',
        'x-component-props': {
          style: { width: 180 },
        },
      },
    ];
  },
  handleEvent(_evt, data, _ctx) {
    return data;
  },
};
