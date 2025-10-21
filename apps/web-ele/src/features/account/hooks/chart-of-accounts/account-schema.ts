import type { ISchema } from '@igourd/common-ui';

// 表单 Schema - 基于原有的自定义字段表单结构
const formSchema: ISchema = {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 14,
      },
      properties: {
        id: {
          type: 'string',
          'x-hidden': true,
        },
        account_ledger_id: {
          type: 'string',
          title: "{{t('chart-of-accounts.account-ledger')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: "{{t('chart-of-accounts.account-ledger')}}",
            clearable: true,
          },
          enum: '{{ leafLedgers.value }}',
        },
        code: {
          type: 'string',
          title: "{{t('chart-of-accounts.add-account-form.code')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: "{{t('chart-of-accounts.add-account-form.code')}}",
            clearable: true,
          },
          'x-reactions': {
            dependencies: ['source'],
            fulfill: {
              state: {
                value: '{{ $deps?.code }}',
              },
            },
          },
        },
        name: {
          type: 'string',
          title: "{{t('chart-of-accounts.add-account-form.name')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: "{{t('chart-of-accounts.add-account-form.name')}}",
            clearable: true,
          },
        },
        // initial_balance: {
        //   type: 'string',
        //   title: "{{t('chart-of-accounts.add-account-form.initial-balance')}}",
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Input',
        //   'x-component-props': {
        //     placeholder:
        //       "{{t('chart-of-accounts.add-account-form.initial-balance')}}",
        //     clearable: true,
        //   },
        // },
        // closing_balance: {
        //   type: 'string',
        //   title: "{{t('chart-of-accounts.add-account-form.closing-balance')}}",
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Input',
        //   'x-component-props': {
        //     placeholder:
        //       "{{t('chart-of-accounts.add-account-form.closing-balance')}}",
        //     clearable: true,
        //   },
        // },
        openingBalance_row: {
          type: 'void',
          'x-decorator': 'FormItem',
          title: "{{t('account.opening-balance')}}",
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
        },
        closing_balance_row: {
          type: 'void',
          'x-decorator': 'FormItem',
          title: "{{t('account.closing-balance')}}",
          properties: {
            current_balance_row: {
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
                },
                balance_direction_sort: {
                  type: 'string',
                  'x-component': 'Input',
                  'x-decorator': 'FormItem',
                  'x-disabled': true,
                  'x-component-props': {
                    placeholder: '',
                  },
                },
              },
            },
          },
          'x-component-props': {
            placeholder: "{{t('common.enter')}}",
          },
        },
      },
    },
  },
};
export default formSchema;
