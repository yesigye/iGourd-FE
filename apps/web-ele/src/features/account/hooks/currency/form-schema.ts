import type { ISchema } from '@igourd/common-ui';

export default {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': { labelWidth: 180, size: 'default' },
      properties: {
        name: {
          type: 'string',
          title: "{{$t('account.classification_form.name')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [
            { required: true, message: "{{$t('account.name-required')}}" },
            {
              pattern: '^[^`~!@#$^&*()=+\\[\\]{};:\'\\",<>/?\\\\|]+$',
              message: "{{$t('common.noSpecialChars')}}",
            },
          ],
        },
        tab: {
          type: 'string',
          title: "{{$t('account.classification_form.type')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            { label: "{{$t('account.asset')}}", value: 'asset' },
            { label: "{{$t('account.liability')}}", value: 'liability' },
            { label: "{{$t('account.income')}}", value: 'income' },
            { label: "{{$t('account.expense')}}", value: 'expense' },
          ],
          'x-dataSourceKey': 'financeCategoryTabs',
        },
        source_account_ledger_code: {
          type: 'string',
          title: "{{$t('account.classification-form.debit')}}",
          'x-decorator': 'FormItem',
          'x-component': 'FormilySearchSelect',
          'x-component-props': { multiple: true },
          'x-dataSourceKey': 'ledgerCodes',
        },
        target_account_ledger_code: {
          type: 'string',
          title: "{{$t('account.classification-form.credit')}}",
          'x-decorator': 'FormItem',
          'x-component': 'FormilySearchSelect',
          'x-component-props': { multiple: false },
          'x-dataSourceKey': 'ledgerCodes',
        },
        remark: {
          type: 'string',
          title: "{{$t('account.remarks')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': { maxlength: 256 },
        },
      },
    },
  },
} as ISchema;
