import type { ISchema } from '@igourd/common-ui';

export default {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': { labelWidth: 180, size: 'default' },
      properties: {
        type: {
          type: 'string',
          title: "{{$t('account.accountType')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [],
          'x-validator': [
            { required: true, message: "{{$t('common.pleaseSelect')}}" },
          ],
          'x-dataSourceKey': 'accountTypes',
        },
        change_type: {
          type: 'string',
          title: "{{$t('account.revenueExpenditure')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [],
          'x-validator': [
            { required: true, message: "{{$t('common.pleaseSelect')}}" },
          ],
          'x-dataSourceKey': 'incomeExpenses',
        },
        finance_category_id: {
          type: 'string',
          title: "{{$t('account.financialClassification')}}",
          'x-decorator': 'FormItem',
          'x-component': 'FormilySearchSelect',
          'x-component-props': { clearable: true, filterable: true },
          'x-validator': [
            { required: true, message: "{{$t('common.pleaseSelect')}}" },
          ],
          'x-dataSourceKey': 'financeCategories',
        },
        receivable_amount: {
          type: 'number',
          title: "{{$t('account.receivableAmount')}}",
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': { min: 0, precision: 2 },
          'x-validator': [
            { required: true, message: "{{$t('common.pleaseEnter')}}" },
            { minimum: 0, message: "{$t('common.mustBeGreaterEqualZero')}" },
          ],
        },
        received_amount: {
          type: 'number',
          title: "{{$t('account.receivedAmount')}}",
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': { min: 0, precision: 2 },
          'x-validator': [
            { required: true, message: "{{$t('common.pleaseEnter')}}" },
            { minimum: 0, message: "{$t('common.mustBeGreaterEqualZero')}" },
          ],
          'x-reactions': [
            {
              dependencies: ['receivable_amount'],
              fulfill: {
                state: {
                  selfErrors:
                    "{{$self.value!=null && $deps[0]!=null && Number($self.value) > Number($deps[0]) ? [$t('account.validate.receivedAmount.lteReceivable')] : []}}",
                },
              },
            },
          ],
        },
        currency_code: {
          type: 'string',
          title: "{{$t('account.courrencySymbols')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [],
          'x-dataSourceKey': 'currencies',
          'x-reactions': [
            {
              dependencies: ['receivable_amount', 'received_amount'],
              fulfill: {
                state: {
                  required: '{{$deps.some(v=>v!=null && Number(v)>0)}}',
                },
              },
            },
          ],
        },
        account_name: {
          type: 'string',
          title: "{{$t('account.tradingAccount')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            readonly: true,
            placeholder: "{{$t('account.selectAccount')}}",
          },
        },
        account_id: { type: 'number', 'x-visible': false },
        partner: {
          type: 'string',
          title: "{{$t('account.selectTradingPartner')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [],
          'x-dataSourceKey': 'tradingPartners',
        },
        customer_id: {
          type: 'string',
          title: "{{$t('account.customer')}}",
          'x-decorator': 'FormItem',
          'x-component': 'FormilySearchSelect',
          'x-component-props': { clearable: true, filterable: true },
          'x-reactions': [
            {
              dependencies: ['partner'],
              fulfill: {
                state: {
                  display: "{{$deps[0]==='Customer' ? 'visible' : 'none'}}",
                },
              },
            },
            {
              dependencies: ['partner'],
              fulfill: {
                state: {
                  display: "{$deps[0]==='Customer' ? 'visible' : 'none'}",
                  required: "{$deps[0]==='Customer'}",
                },
              },
            },
          ],
          'x-dataSourceKey': 'customers',
        },
        vendor_id: {
          type: 'string',
          title: "{{$t('account.vendor')}}",
          'x-decorator': 'FormItem',
          'x-component': 'FormilySearchSelect',
          'x-component-props': { clearable: true, filterable: true },
          'x-reactions': [
            {
              dependencies: ['partner'],
              fulfill: {
                state: {
                  display: "{{$deps[0]==='Vendor' ? 'visible' : 'none'}}",
                },
              },
            },
            {
              dependencies: ['partner'],
              fulfill: {
                state: {
                  display: "{$deps[0]==='Vendor' ? 'visible' : 'none'}",
                  required: "{$deps[0]==='Vendor'}",
                },
              },
            },
          ],
          'x-dataSourceKey': 'vendors',
        },
        checking_bank: {
          type: 'string',
          title: "{{$t('account.chequeBank')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-reactions': [
            {
              dependencies: [
                'checking_bank',
                'checking_account',
                'cheque_number',
                'cheque_issue_date',
              ],
              fulfill: {
                state: {
                  selfErrors:
                    "{{$deps[0]||$deps[1]||$deps[2]||$deps[3] ? ($self.value ? [] : [$t('account.validate.cheque.groupRequired')]) : []}}",
                },
              },
            },
          ],
        },
        checking_account: {
          type: 'string',
          title: "{{$t('account.chequeAccount')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-reactions': [
            {
              dependencies: [
                'checking_bank',
                'checking_account',
                'cheque_number',
                'cheque_issue_date',
              ],
              fulfill: {
                state: {
                  selfErrors:
                    "{{$deps[0]||$deps[1]||$deps[2]||$deps[3] ? ($self.value ? [] : [$t('account.validate.cheque.groupRequired')]) : []}}",
                },
              },
            },
          ],
        },
        cheque_number: {
          type: 'string',
          title: "{{$t('account.chequeNumber')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-reactions': [
            {
              dependencies: [
                'checking_bank',
                'checking_account',
                'cheque_number',
                'cheque_issue_date',
              ],
              fulfill: {
                state: {
                  selfErrors:
                    "{{$deps[0]||$deps[1]||$deps[2]||$deps[3] ? ($self.value ? [] : [$t('account.validate.cheque.groupRequired')]) : []}}",
                },
              },
            },
          ],
        },
        cheque_issue_date: {
          type: 'string',
          title: "{{$t('account.chequeIssueDate')}}",
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': { type: 'date', valueFormat: 'YYYY-MM-DD' },
          'x-reactions': [
            {
              dependencies: [
                'checking_bank',
                'checking_account',
                'cheque_number',
                'cheque_issue_date',
              ],
              fulfill: {
                state: {
                  selfErrors:
                    "{{$deps[0]||$deps[1]||$deps[2]||$deps[3] ? ($self.value ? [] : [$t('account.validate.cheque.groupRequired')]) : []}}",
                },
              },
            },
          ],
        },
        account_period_date: {
          type: 'string',
          title: "{{$t('account.accountPeriodDate')}}",
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': { type: 'date', valueFormat: 'YYYY-MM-DD' },
        },
        trading_date: {
          type: 'string',
          title: "{{$t('account.tradingDate')}}",
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': { type: 'date', valueFormat: 'YYYY-MM-DD' },
        },
        remark: {
          type: 'string',
          title: "{{$t('common.remark')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': { rows: 3 },
        },
      },
    },
  },
} as ISchema;
