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
        card_basic_information: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: 'Basic Information',
          },
          properties: {
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
            target_account_ledger_code: {
              type: 'string',
              'x-hidden': true,
            },
            account_ledger_codes: {
              type: 'string',
              'x-hidden': true,
            },
            finance_category_id: {
              type: 'string',
              title: "{{ t('account.finance_category') }}",
              'x-decorator': 'FormItem',
              'x-decorator-props': { required: true },
              'x-component': 'RemoteSelect',
              'x-component-props': {
                remoteMethod: '{{ remoteMethod }}',
                onSelect: '{{ handleCateSelect }}',
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
            payer_name: {
              type: 'string',
              title: "{{ t('account.traderName') }}",
              'x-decorator': 'FormItem',
              'x-decorator-props': { required: true },
              'x-component': 'Input',
              'x-component-props': { placeholder: "{{ t('account.enter') }}" },
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
          },
        },
        transaction_setting: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: 'Transaction Setting',
          },
          properties: {
            item_create_volist: {
              type: 'array',
              title: "{{ t('account.ourAccount') }}",
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
                          placeholder: "{{ t('account.pleaseSelect') }}",
                        },
                        'x-reactions': {
                          fulfill: {
                            state: {
                              dataSource: '{{ targetOptions.value }}',
                            },
                          },
                        },
                      },
                    },
                  },
                  col_pay_method: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: "{{ t('account.payment_method') }}",
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
              title: "{{ t('account.externalAccount') }}",
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
                    },
                  },
                  col_t_account: {
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
                          placeholder: "{{ t('account.pleaseSelect') }}",
                        },
                      },
                    },
                  },
                  col_pay_method: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: "{{ t('account.payment_method') }}",
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
            header: 'Other Information',
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
                placeholder: "{{ t('account.pleaseInput') }}",
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
