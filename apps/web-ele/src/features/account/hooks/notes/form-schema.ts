import type { ISchema } from '@igourd/common-ui';

export default {
  type: 'object',
  properties: {
    __layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': { labelCol: 2, wrapperCol: 22, size: 'small' },
      properties: {
        /* ---------------- 隐藏/系统字段 ---------------- */
        __hidden: {
          type: 'void',
          'x-hidden': true,
          properties: {
            merchant_id: {
              type: 'string',
              default: "{{ $self.userInfo?.merchantId || '' }}",
            },
            account_set_id: {
              type: 'string',
              default:
                "{{ $self.userInfo?.merchantInfo?.account_set_id || '' }}",
            },
            currency_code: {
              type: 'string',
              default:
                "{{ $self.userInfo?.merchantInfo?.basic_currency_code || '' }}",
            },
            channel: { type: 'string', default: 'WEB' },
            device_code: { type: 'string', default: '' },
            device_id: { type: 'string', default: '' },
            exchange_rate: { type: 'number', default: 1 },
            accounting_period: { type: 'string', default: '' },
            accounting_period_id: { type: 'string', default: '' },
            balance_direction: {
              type: 'string',
              default: 'DEBIT',
              'x-reactions': [
                {
                  dependencies: ['change_type'],
                  fulfill: {
                    state: {
                      value:
                        "{{ $deps[0] === 'REVENUE' ? 'DEBIT' : 'CREDIT' }}",
                    },
                  },
                },
              ],
            },
            target_account_id: { type: 'string', default: '' },
            target_account_ledger_id: { type: 'string', default: '' },
            target_node_type: { type: 'string', default: '' },
          },
        },

        change_type: {
          type: 'string',
          title: "{{ t('account.revenueExpenditure') }}",
          default: 'REVENUE',
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            {
              label: "{{ t('account.revenue') }}",
              value: 'REVENUE',
            },
            {
              label: "{{ t('account.expenditure') }}",
              value: 'EXPENDITURE',
            },
          ],
        },

        finance_category_id: {
          type: 'string',
          title: "{{ t('account.finance_category') }}",
          'x-decorator': 'FormItem',
          'x-decorator-props': { required: true },
          'x-component': 'Select',
          'x-component-props': {
            filterable: true,
            remote: true,
            reserveKeyword: true,
            remoteMethod: '{{ $self.handleFinanceCategorySearch }}',
            placeholder: "{{ t('account.pleaseSelect') }}",
            popperClass: 'finance-category-select-dropdown',
          },
          'x-reactions': [
            {
              fulfill: {
                state: {
                  enum: '{{ ($self.financeCategoryOption || []).map(i => ({ label: i.name, value: i.id })) }}',
                },
              },
            },
          ],
        },

        trading_time: {
          type: 'string',
          title: "{{ t('account.transactionDate') }}",
          'x-decorator': 'FormItem',
          'x-decorator-props': { required: true },
          'x-component': 'DatePicker',
          'x-component-props': {
            type: 'date',
            valueFormat: 'YYYY-MM-DD',
            placeholder: "{{ t('account.pleaseSelectDate') }}",
            defaultValue: '{{ $self.defaultTime }}',
            disabledDate: '{{ $self.disabledDate }}',
          },
        },

        payer_name: {
          type: 'string',
          title: "{{ t('account.traderName') }}",
          'x-decorator': 'FormItem',
          'x-decorator-props': { required: true },
          'x-component': 'Input',
          'x-component-props': { placeholder: "{{ t('account.enter') }}" },
        },

        /* ---------------- 我方账户（最多2行） ---------------- */
        item_create_volist: {
          type: 'array',
          title: "{{ t('account.ourAccount') }}",
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTable',
          default: [
            {
              account_id: '',
              payment_method_id: '',
              amount: null,
              node_type: '',
              account_ledger_id: '',
            },
          ],
          'x-reactions': [
            {
              fulfill: {
                state: {
                  selfErrors:
                    "{{ (()=>{ const v=$self.value||[]; if(!v.length) return [t('account.Please_fill_in_our_account_information')]; if(v.length===1 && !v[0].account_id && !v[0].payment_method_id && !v[0].amount) return [t('account.Please_fill_in_our_account_information')]; if(v.some(it=> !(it.account_id && it.payment_method_id && (it.amount!=='' && it.amount!=null)))) return [t('account.Please_fill_in_complete_our_account_information')]; return []; })() }}",
                },
              },
            },
          ],
          'x-component-props': { pagination: false, sticky: true },
          items: {
            type: 'object',
            properties: {
              col_index: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': { title: '#', width: 60, align: 'center' },
                properties: {
                  index: { type: 'void', 'x-component': 'ArrayTable.Index' },
                },
              },
              col_account: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': { title: "{{ t('account.account') }}" },
                properties: {
                  account_id: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': { required: true },
                    'x-component': 'Select',
                    'x-component-props': {
                      filterable: true,
                      placeholder: "{{ t('account.pleaseSelect') }}",
                    },
                    'x-reactions': [
                      {
                        fulfill: {
                          state: {
                            enum: '{{ (receivingAccount || []).map(i => ({ label: i.name, value: i.node_id })) }}',
                          },
                        },
                      },
                    ],
                  },
                },
              },
              col_pay_method: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                  title: "{{ t('account.paymentMethod') }}",
                },
                properties: {
                  payment_method_id: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': { required: true },
                    'x-component': 'Select',
                    'x-component-props': {
                      filterable: true,
                      placeholder: "{{ t('account.pleaseSelect') }}",
                    },
                    'x-reactions': [
                      {
                        dependencies: ['change_type'],
                        fulfill: {
                          state: {
                            enum: "{{ ($deps[0] === 'REVENUE' ? (payRevenueOption||[]) : (payPurchaseOption||[])).map(i => ({ label: i.payment_method_name, value: i.payment_method_id })) }}",
                          },
                        },
                      },
                    ],
                  },
                },
              },
              col_amount: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                  title: "{{ t('account.amount') }}",
                  width: 180,
                },
                properties: {
                  amount: {
                    type: 'number',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': { required: true },
                    'x-component': 'InputNumber',
                    'x-component-props': {
                      min: 0,
                      placeholder: "{{ t('account.enter') }}",
                    },
                  },
                },
              },
              col_actions: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                  title: "{{ t('account.actions') }}",
                  width: 140,
                  fixed: 'right',
                },
                properties: {
                  remove: { type: 'void', 'x-component': 'ArrayTable.Remove' },
                },
              },
              node_type: { type: 'string', 'x-hidden': true, default: '' },
              account_ledger_id: {
                type: 'string',
                'x-hidden': true,
                default: '',
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: "{{ t('account.add') }}",
              'x-component': 'ArrayTable.Addition',
              'x-reactions': [
                {
                  fulfill: {
                    state: {
                      disabled:
                        '{{ ($form.values.item_create_volist||[]).length >= 2 }}',
                    },
                  },
                },
              ],
            },
          },
        },

        externalAccountData: {
          type: 'array',
          title: "{{ t('account.externalAccount') }}",
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTable',
          default: [{ account_id: '', amount: null }],
          'x-reactions': [
            {
              fulfill: {
                state: {
                  selfErrors:
                    "{{ (()=>{ const v=$self.value||[]; if(!v.length) return [t('account.Please_fill_in_the_target_account_information')]; if(v.length>1) return [t('account.only_one_target_account')]; if(!v[0].account_id) return [t('account.Please_fill_in_the_target_account_information')]; return []; })() }}",
                },
              },
            },
          ],
          items: {
            type: 'object',
            properties: {
              col_t_account: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': { title: "{{ t('account.account') }}" },
                properties: {
                  account_id: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': { required: true },
                    'x-component': 'Select',
                    'x-component-props': {
                      filterable: true,
                      placeholder: "{{ t('account.pleaseSelect') }}",
                    },
                    'x-reactions': [
                      {
                        fulfill: {
                          state: {
                            enum: '{{ (receivingTargetAccount || []).map(i => ({ label: i.name, value: i.node_id })) }}',
                          },
                        },
                      },
                    ],
                  },
                },
              },
              col_t_amount: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                  title: "{{ t('account.amount') }}",
                  width: 180,
                },
                properties: {
                  amount: {
                    type: 'number',
                    'x-decorator': 'FormItem',
                    'x-component': 'InputNumber',
                    'x-component-props': { disabled: true },
                    'x-reactions': [
                      {
                        dependencies: ['item_create_volist'],
                        fulfill: {
                          state: {
                            value:
                              '{{ ($deps[0]||[]).reduce((s,row)=> s + ((row?.amount||0)*1), 0) }}',
                          },
                        },
                      },
                    ],
                  },
                },
              },
              col_t_actions: {
                type: 'void',
                'x-component': 'ArrayTable.Column',
                'x-component-props': {
                  title: "{{ t('account.actions') }}",
                  width: 120,
                  fixed: 'right',
                },
                properties: {
                  remove: { type: 'void', 'x-component': 'ArrayTable.Remove' },
                },
              },
            },
          },
        },

        /* ---------------- 其他信息 ---------------- */
        remark: {
          type: 'string',
          title: "{{ t('account.remarks') }}",
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': {
            maxlength: 128,
            showWordLimit: true,
            placeholder: "{{ t('account.pleaseInput') }}",
          },
        },

        /* 附件（与源码一致，使用自定义组件） */
        attachments: {
          type: 'array',
          title: "{{ t('account.attachment') }}",
          'x-decorator': 'FormItem',
          'x-component': 'MultiFileDropzone',
          'x-component-props': { multiple: true },
        },

        /* ---------------- 金额合计（隐藏，自动汇总） ---------------- */
        revenue_amount: {
          type: 'number',
          'x-hidden': true,
          default: 0,
          'x-reactions': [
            {
              dependencies: ['item_create_volist.*.amount'],
              fulfill: {
                state: {
                  value:
                    '{{ ($deps || []).reduce((s,v) => s + (Number(v)||0), 0) }}',
                },
              },
            },
            {
              dependencies: ['revenue_amount'],
              fulfill: {
                state: {
                  selfErrors:
                    "{{ ($deps[0] || 0) > ($self.JournalMoneyMax || 0) ? [t('account.amount_exceeded', { max: $self.JournalMoneyMax })] : [] }}",
                },
              },
            },
          ],
        },
      },
    },
  },
} as ISchema;
