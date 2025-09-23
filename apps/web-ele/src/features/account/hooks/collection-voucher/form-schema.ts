import type { ISchema } from '@igourd/common-ui';

export default {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': { labelWidth: 180, size: 'default' },
      properties: {
        receipt_order_no: {
          type: 'string',
          title: "{{$t('printTemp.order_no')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': { disabled: true },
        },
        customer_id: {
          type: 'string',
          title: "{{$t('account.customer')}}",
          'x-decorator': 'FormItem',
          'x-component': 'FormilySearchSelect',
          'x-component-props': { multiple: false },
          'x-dataSourceKey': 'customers',
          'x-validator': [
            { required: true, message: "{$t('common.pleaseSelect')}" },
          ],
        },
        receipt_date: {
          type: 'string',
          title: "{{$t('account.receipt_date')}}",
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': { type: 'datetime', format: 'YYYY-MM-DD HH:mm' },
          'x-validator': [
            { required: true, message: "{$t('common.pleaseSelect')}" },
          ],
        },
        receivable_balance: {
          type: 'string',
          title: "{{$t('account.receivable_balance')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': { disabled: true },
        },
        last_debt: {
          type: 'string',
          title: "{{$t('account.last_debt')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': { disabled: true },
        },
        attachment: {
          type: 'array',
          title: "{{$t('common.Attachment')}}",
          'x-decorator': 'FormItem',
          'x-component': 'FormilyUpload',
          'x-component-props': { limit: 4 },
        },
      },
    },
  },
} as ISchema;
