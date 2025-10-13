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
            header: `{{ t('account.basic_information')}}`,
          },
          properties: {
            account_ledger_id: {
              type: 'string',
              'x-component': 'Select',
              'x-decorator': 'FormItem',
              title: "{{t('account.account_ledger')}}",
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
              title: "{{t('account.ledger_no')}}",
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
              title: "{{t('account.bank_name')}}",
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
            bank_account_number: {
              type: 'string',
              'x-component': 'Input',
              'x-decorator': 'FormItem',
              title: "{{t('account.bank_account_no')}}",
              'x-component-props': {
                placeholder: "{{t('common.enter')}}",
                type: 'number',
              },
              'x-validator': [null],
            },
            openingBalance: {
              type: 'void',
              'x-decorator': 'FormItem',
              title: "{{t('account.opening_balance')}}",
              properties: {
                initial_balance: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    currency_code: {
                      type: 'string',
                      'x-component': 'Select',
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
              title: "{{t('account.closing_balance')}}",
              properties: {
                current_balance: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-decorator': '',
                  'x-component-props': {
                    placeholder: "{{t('common.enter')}}",
                  },
                  properties: {
                    currency_code: {
                      type: 'string',
                      'x-component': 'Select',
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
          'x-validator': [null],
        },
        'other-info': {
          type: 'void',
          'x-component': 'Card',
          'x-decorator': '',
          'x-component-props': {
            header: `{{ t('account.other_information') }}`,
          },
          properties: {
            branch_name: {
              type: 'string',
              'x-component': 'Input',
              'x-decorator': 'FormItem',
              title: "{{t('account.branchName')}}",
              'x-component-props': {
                placeholder: "{{t('common.enter')}}",
              },
              'x-validator': [null],
            },
            bank_address: {
              type: 'string',
              'x-component': 'Input',
              'x-decorator': 'FormItem',
              title: "{{t('account.bankAddress')}}",
              'x-component-props': {
                placeholder: "{{t('common.enter')}}",
                type: 'textarea',
              },
              'x-validator': [null],
            },
          },
          'x-validator': [null],
        },
      },
      'x-validator': [null],
    },
  },
} as ISchema;
