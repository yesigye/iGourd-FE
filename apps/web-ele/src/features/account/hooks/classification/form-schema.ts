import type { ISchema } from '@igourd/common-ui';

import { accountLedgerPageQueryPageVO } from '../../apis';

export default (account_set_id: string) =>
  ({
    type: 'object',
    properties: {
      layout: {
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
              header: `{{ t('account.basic-information') }}`,
            },
            properties: {
              type: {
                type: 'boolean',
                'x-component': 'Radio.Group',
                'x-decorator': 'FormItem',
                title: "{{t('account.revenue-expenditure')}}",
                enum: [
                  {
                    label: '{{t("account.revenue")}}',
                    value: 'REVENUE',
                  },
                  {
                    label: '{{t("account.expenditure")}}',
                    value: 'EXPENDITURE',
                  },
                ],
                default: 'REVENUE',
                'x-component-props': {
                  placeholder: "{{t('common.enter')}}",
                },
                'x-validator': [null],
              },
              name: {
                type: 'string',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                title: "{{t('account.name')}}",
                'x-validator': [
                  null,
                  {
                    required: true,
                    message: '{{t("account.name_required")}}',
                  },
                ],
                'x-component-props': {
                  placeholder: "{{t('common.enter')}}",
                },
              },
            },
            'x-validator': [null],
          },
          account_binding: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              header: `{{t('account.accounting-binding')}}`,
            },
            properties: {
              account_ledger_codes: {
                type: 'string',
                'x-component': 'FormilySearchSelect',
                'x-decorator': 'FormItem',
                title: "{{t('account.classification-form.debit')}}",
                'x-component-props': {
                  placeholder: "{{t('common.select')}}",
                  'multiple-limit': 3,
                  onSearch: (args: any) => {
                    return accountLedgerPageQueryPageVO({
                      ...args,
                      account_set_id,
                    });
                  },
                },
                'x-validator': [
                  null,
                  {
                    required: true,
                    message: '{{t("common.form.select-required")}}',
                  },
                ],
              },
              target_account_ledger_code: {
                type: 'string',
                'x-component': 'FormilySearchSelect',
                'x-decorator': 'FormItem',
                title: "{{t('account.classification-form.credit')}}",
                'x-component-props': {
                  placeholder: "{{t('common.select')}}",
                  multiple: false,

                  onSearch: (args: any) => {
                    return accountLedgerPageQueryPageVO({
                      ...args,
                      account_set_id,
                    });
                  },
                },
                'x-validator': [
                  null,
                  {
                    required: true,
                    message: '{{t("common.form.select-required")}}',
                  },
                ],
              },
            },
            'x-validator': [null],
          },
          other_information: {
            type: 'void',
            'x-component': 'Card',
            'x-decorator': '',
            'x-component-props': {
              header: `{{t('account.other-information')}}`,
            },
            properties: {
              remark: {
                type: 'string',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                title: "{{t('account.remarks')}}",
                'x-component-props': {
                  placeholder: "{{t('common.enter')}}",
                  maxlength: 256,
                  type: 'textarea',
                  showWordLimit: true,
                },
                'x-validator': [null],
              },
            },
            'x-validator': [null],
          },
        },
      },
    },
  }) as ISchema;
