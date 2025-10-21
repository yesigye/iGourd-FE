import type { ISchema } from '@igourd/common-ui';

export default {
  type: 'object',
  properties: {
    'form-container': {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelWidth: 100,
        wrapperWidth: 300,
      },
      properties: {
        'basic-info': {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: `{{ t('account.basic-information')}}`,
          },
          properties: {
            id: {
              type: 'string',
              'x-hidden': true,
            },
            belong_type: {
              type: 'string',
              'x-hidden': true,
            },
            account_ledger_id: {
              type: 'string',
              'x-component': 'Select',
              'x-decorator': 'FormItem',
              title: "{{t('account.account-ledger')}}",
              enum: '{{ leafLedgers.value }}',
              'x-validator': [
                null,
                {
                  required: true,
                  message: '{{t("common.validate.required")}}',
                },
              ],
              'x-component-props': {
                placeholder: "{{t('common.select')}}",
                filterable: true,
              },
            },
            code: {
              type: 'string',
              'x-component': 'Input',
              'x-decorator': 'FormItem',
              title: "{{t('account.ledger-no')}}",
              'x-validator': [
                null,
                {
                  required: true,
                  message: '{{t("common.validate.required")}}',
                },
              ],
              'x-component-props': {
                placeholder: "{{t('common.enter')}}",
              },
            },
            name: {
              type: 'string',
              'x-component': 'Input',
              'x-decorator': 'FormItem',
              title: "{{t('account.ledger-name')}}",
              'x-validator': [
                null,
                {
                  required: true,
                  message: '{{t("common.validate.required")}}',
                },
              ],
              'x-component-props': {
                placeholder: "{{t('common.enter')}}",
              },
            },
            openingBalance: {
              type: 'void',
              'x-decorator': 'FormItem',
              title: "{{t('account.opening-balance')}}",
              properties: {
                initial_balance: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-decorator': '',
                  properties: {
                    currency_code: {
                      type: 'string',
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      'x-component-props': {
                        placeholder: "{{t('common.select')}}",
                        filterable: true,
                        disabled: true,
                      },
                      'x-reactions': {
                        fulfill: {
                          state: {
                            value: '{{ currencySymbol }}',
                          },
                        },
                      },
                      'x-validator': [null],
                    },
                    initial_balance: {
                      type: 'string',
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      'x-component-props': {
                        placeholder: "{{t('common.enter')}}",
                        type: 'number',
                      },
                      'x-validator': [
                        null,
                        {
                          required: true,
                          message: '{{t("common.validate.required")}}',
                        },
                      ],
                    },
                    balance_direction_sort: {
                      type: 'string',
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      'x-disabled': true,
                      'x-component-props': {
                        placeholder: '',
                      },
                      'x-validator': [null],
                    },
                  },
                  'x-validator': [null],
                },
              },
              'x-component-props': {
                placeholder: "{{t('common.enter')}}",
              },
              'x-validator': [null],
            },
            closing_balance: {
              type: 'void',
              'x-decorator': 'FormItem',
              title: "{{t('account.closing-balance')}}",
              properties: {
                current_balance_row: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    currency_code: {
                      type: 'string',
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      'x-component-props': {
                        placeholder: "{{t('common.select')}}",
                        filterable: true,
                        disabled: true,
                      },
                      'x-reactions': {
                        fulfill: {
                          state: {
                            value: '{{ currencySymbol }}',
                          },
                        },
                      },
                      'x-validator': [null],
                    },
                    current_balance: {
                      type: 'string',
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      'x-component-props': {
                        placeholder: "{{t('common.enter')}}",
                        type: 'number',
                        disabled: true,
                      },
                      'x-validator': [null],
                    },
                    balance_direction_sort: {
                      type: 'string',
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      'x-disabled': true,
                      'x-component-props': {
                        placeholder: '',
                      },
                      'x-validator': [null],
                    },
                  },
                  'x-validator': [null],
                },
              },
              'x-component-props': {
                placeholder: "{{t('common.enter')}}",
              },
              'x-validator': [null],
            },
          },
        },
      },
      'x-validator': [null],
    },
  },
} as ISchema;
