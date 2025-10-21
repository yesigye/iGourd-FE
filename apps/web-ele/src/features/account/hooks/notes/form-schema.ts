import type { ISchema } from '@igourd/common-ui';

const noteFormSchema: ISchema = {
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
        expenditure_amount: {
          type: 'number',
          'x-hidden': true,
          'x-reactions': {
            dependencies: ['item_create_volist', 'change_type'],
            fulfill: {
              state: {
                value: `{{ $deps[1] ==='EXPENDITURE'? ($deps[0] || []).reduce((s,v) => s + (Number(v.amount)||0), 0): undefined }}`,
              },
            },
          },
        },
        revenue_amount: {
          type: 'number',
          'x-hidden': true,
          'x-reactions': {
            dependencies: ['item_create_volist', 'change_type'],
            fulfill: {
              state: {
                value: `{{
               $deps[1] ==='REVENUE'? ($deps[0] || []).reduce((s,v) => s + (Number(v.amount)||0), 0): undefined
              }}`,
              },
            },
          },
        },
        accounting_period: {
          type: 'string',
          'x-hidden': true,
        },
        account_set_id: {
          type: 'string',
          'x-hidden': true,
          'x-reactions': {
            fulfill: {
              state: {
                value: ' {{ account_set_id }} ',
              },
            },
          },
        },
        exchange_rate: {
          type: 'number',
          'x-hidden': true,
        },
        channel: {
          type: 'number',
          'x-hidden': true,
        },
        balance_direction: {
          type: 'string',
          'x-hidden': true,
          'x-reactions': {
            dependencies: ['change_type'],
            fulfill: {
              state: {
                value: "{{ $deps[0] === 'REVENUE'? 'DEBIT':'CREDIT'}}",
              },
            },
          },
        },
        accounting_note_no: {
          type: 'string',
          'x-hidden': true,
          'x-reactions': {
            fulfill: {
              state: {
                value: '{{ accounting_note_no.value }}',
              },
            },
          },
        },
        accounting_period_id: {
          type: 'string',
          'x-hidden': true,
        },
        card_basic_information: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: "{{ t('note.base-info') }}",
          },
          properties: {
            change_type: {
              type: 'string',
              title: "{{ t('account.revenue-expenditure') }}",
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
            target_account_ledger_code_list: {
              type: 'string',
              'x-hidden': true,
            },
            account_ledger_code_list: {
              type: 'string',
              'x-hidden': true,
            },
            finance_category_id: {
              type: 'string',
              title: "{{ t('account.finance-category') }}",
              'x-decorator': 'FormItem',
              'x-decorator-props': { required: true },
              'x-component': 'RemoteSelect',
              'x-component-props': {
                remoteMethod: '{{ remoteMethod }}',
                onSelect: '{{ handleCateSelect }}',
              },

            },
            payer_name: {
              type: 'string',
              title: "{{ t('account.trader-name') }}",
              'x-decorator': 'FormItem',
              'x-decorator-props': { required: true },
              'x-component': 'Input',
              'x-component-props': { placeholder: "{{ t('account.enter') }}" },
            },
            trading_time: {
              type: 'string',
              title: "{{ t('account.transaction-date') }}",
              'x-decorator': 'FormItem',
              'x-decorator-props': { required: true },
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'date',
                placeholder: "{{ t('account.please-select-date') }}",
                disabledDate: '{{ tradingDisabledFn }}',
              },
            },
          },
        },
        transaction_setting: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: "{{ t('note.transaction-setting') }}",
          },
          properties: {
            item_create_volist: {
              type: 'array',
              title: "{{ t('account.our-account') }}",
              'x-decorator': 'FormItem',
              'x-component': 'ArrayTable',
              'x-decorator-props': {
                wrapperWidth: '100%',
              },
              'x-component-props': {
                pagination: false,
              },
              items: {
                type: 'object',
                properties: {
                  col_index: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: '#',
                      width: 60,
                      align: 'center',
                    },
                    properties: {
                      index: {
                        type: 'void',
                        'x-component': 'ArrayTable.Index',
                      },
                      id: {
                        type: 'string',
                        'x-hidden': true,
                      },
                      account_ledger_id: {
                        type: 'string',
                        'x-hidden': true,
                      },
                      exchange_rate: {
                        type: 'number',
                        'x-hidden': true,
                        'x-reactions': {
                          fulfill: {
                            state: {
                              value: 1,
                            },
                          },
                        },
                      },
                      currency_code: {
                        type: 'string',
                        'x-hidden': true,
                        'x-reactions': {
                          fulfill: {
                            state: {
                              value: '{{ basic_currency_code }}',
                            },
                          },
                        },
                      },
                      node_type: {
                        type: 'string',
                        'x-hidden': true,
                      },
                      account_set_id: {
                        type: 'string',
                        'x-hidden': true,
                        'x-reactions': {
                          fulfill: {
                            state: {
                              value: '{{ account_set_id }}',
                            },
                          },
                        },
                      },
                      accounting_note_no: {
                        type: 'string',
                        'x-hidden': true,
                        'x-reactions': {
                          fulfill: {
                            state: {
                              value: '{{ accounting_note_no.value }}',
                            },
                          },
                        },
                      },
                      merchant_id: {
                        type: 'string',
                        'x-hidden': true,
                        'x-reactions': {
                          fulfill: {
                            state: {
                              value: '{{ merchant_id }}',
                            },
                          },
                        },
                      },
                      payment_method_mark: {
                        type: 'string',
                        'x-hidden': true,
                      },
                      payment_method_type: {
                        type: 'string',
                        'x-hidden': true,
                      },
                    },
                  },
                  col_account: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: "{{ t('account.account') }}",
                    },
                    properties: {
                      account_id: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': { required: true },
                        'x-component': 'Select',
                        'x-component-props': {
                          filterable: true,
                          placeholder: "{{ t('account.please-select') }}",
                        },
                        enum: '{{ accountOptions.value }}',
                        // 'x-reactions': {
                        //   fulfill: {
                        //     state: {
                        //       dataSource: '{{ accountOptions.value }}',
                        //     },
                        //   },
                        // },
                      },
                    },
                  },
                  col_pay_method: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: "{{ t('account.payment-method') }}",
                    },
                    properties: {
                      payment_method_id: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': { required: true },
                        'x-component': 'Select',
                        'x-component-props': {
                          filterable: true,
                          placeholder: "{{ t('account.please-select') }}",
                        },
                        enum: '{{ paymentMethodsOptions.value }}',
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
                        'x-component': 'NumberInput',
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
                      title: "{{ t('account.operation') }}",
                      width: 100,
                      fixed: 'right',
                    },
                    properties: {
                      addition: {
                        type: 'void',
                        title: "{{ t('account.add') }}",
                        'x-component': 'ArrayTable.Addition',
                        'x-reactions': {
                          dependencies: ['item_create_volist'],
                          fulfill: {
                            state: {
                              componentProps: {
                                disabled: '{{ $deps[0]?.length >=2 }}',
                              },
                            },
                          },
                        },
                      },
                      remove: {
                        type: 'void',
                        'x-component': 'ArrayTable.Remove',
                        title: "{{ t('common.delete') }}",
                      },
                    },
                  },
                },
              },
            },
            external_account_data: {
              type: 'array',
              title: "{{ t('account.external-account') }}",
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                wrapperWidth: '100%',
              },
              'x-component': 'ArrayTable',
              items: {
                type: 'object',
                properties: {
                  col_index: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: '#',
                      width: 60,
                      align: 'center',
                    },
                    properties: {
                      index: {
                        type: 'void',
                        'x-component': 'ArrayTable.Index',
                      },
                      target_account_id: {
                        type: 'string',
                        'x-hidden': true,
                      },
                      target_node_type: {
                        type: 'string',
                        'x-hidden': true,
                      },
                    },
                  },
                  col_t_account: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: "{{ t('account.account') }}",
                    },
                    properties: {
                      target_account_ledger_id: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': { required: true },
                        'x-component': 'Select',
                        'x-component-props': {
                          filterable: true,
                          placeholder: "{{ t('account.please-select') }}",
                        },
                        enum: '{{ targetOptions.value }}',
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
                },
              },
            },
          },
        },
        other_information: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: ' {{ t("note.other-info") }}',
          },
          properties: {
            /* ---------------- 其他信息 ---------------- */
            remark: {
              type: 'string',
              title: "{{ t('account.remarks') }}",
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {
                maxlength: 128,
                showWordLimit: true,
                placeholder: "{{ t('account.please-input') }}",
              },
            },
            attachments: {
              type: 'array',
              title: "{{ t('account.attachment') }}",
              'x-decorator': 'FormItem',
              'x-component': 'Upload',
              'x-component-props': { multiple: true, drag: true },
            },
          },
        },
      },
    },
  },
};

export default noteFormSchema;
