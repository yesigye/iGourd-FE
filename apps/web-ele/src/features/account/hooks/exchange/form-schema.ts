import type { ISchema } from '@igourd/common-ui';

const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      properties: {
        date_row: {
          type: 'void',
          title: `{{ t('account.date')}}`,
          'x-decorator': 'FormItem',
          'x-decorator-props': { required: true },
          'x-component': 'Space',
          'x-component-props': { wrap: true },
          properties: {
            exchange_date: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': { required: true },
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'date',
                placeholder: `{{ t('account.pick-a-date') }}`,
              },
              'x-validator': [
                {
                  required: true,
                  message: `{{ t('account.please-enter-date') }}`,
                },
              ],
            },
          },
        },
        sell_row: {
          type: 'void',
          title: `{{ t('account.selling-amount') }}`,
          'x-decorator': 'FormItem',
          'x-decorator-props': { required: true },
          'x-component': 'Space',
          'x-component-props': { wrap: true },
          properties: {
            sell_amount: {
              type: 'number',
              'x-component': 'InputNumber',
              'x-component-props': { style: { width: '500px' } },
              'x-validator': [
                {
                  required: true,
                  message: "{{ t('account.please-enter-sell-amount')}}",
                },
              ],
            },
            sell_currency_code: {
              type: 'string',
              'x-component': 'Select',
              enum: `{{ currencyOptions.value }}`,
              'x-component-props': {
                filterable: true,
                placeholder: `{{ t('account.please-select') }}`,
                style: { width: '180px' },
              },
            },
          },
        },
        exchange_rate: {
          type: 'number',
          title: `{{ t('account.exchange-rate') }}`,
          'x-decorator': 'FormItem',
          'x-decorator-props': { required: true },
          'x-component': 'InputNumber',
          'x-component-props': {
            style: { width: '500px' },
            // disabled: true, // 如需只读，请打开
          },
          'x-validator': [
            {
              required: true,
              message: `{{ t('account.please-enter-exchange-rate')}}`,
            },
          ],
          'x-reactions': [
            {
              dependencies: ['sell_row.sell_amount', 'buy_row.buy_amount'],
              fulfill: {
                state: {
                  value:
                    '{{ $deps[0] && $deps[1] ? Number((Number($deps[1]) / Number($deps[0])).toFixed(4)) : null }}',
                },
              },
            },
          ],
        },
        buy_row: {
          type: 'void',
          title: `{{ t('account.buy-amount')}}`,
          'x-decorator': 'FormItem',
          'x-decorator-props': { required: true },
          'x-component': 'Space',
          'x-component-props': { wrap: true },
          properties: {
            buy_amount: {
              type: 'number',
              'x-component': 'InputNumber',
              'x-component-props': { style: { width: '500px' } },
              'x-validator': [
                {
                  required: true,
                  message: `{{ t('account.please-enter-buy-amount')}}`,
                },
              ],
            },
            buy_currency_code: {
              type: 'string',
              'x-component': 'Select',
              enum: `{{ currencyOptions.value }}`,
              'x-component-props': {
                filterable: true,
                placeholder: `{{ t('account.please-select')}}`,
                style: { width: '180px' },
              },
            },
          },
        },
        remark: {
          type: 'string',
          title: `{{ t('account.remark') }}`,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            type: 'textarea',
            maxlength: 256,
            showWordLimit: true,
            style: { width: '690px' },
          },
        },
      },
    },
  },
};
export default schema;
