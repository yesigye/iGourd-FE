import { getCustomerPageListApi } from '#/features/customer';
import { type ISchema } from '@igourd/common-ui';
import { CollectionTableModal } from '@@/account/components';
import { h } from 'vue';
export function useCollectionVoucherSchema() {
  return {
    type: 'object',
    properties: {
      _layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
          labelAlign: 'left',
          wrapperWidth: 146,
        },
        properties: {
          card_basic: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              header: '{{ t("common.basic-info") }}',
            },
            properties: {
              receipt_order_no: {
                type: 'string',
                'x-hidden': true,
              },
              ledger_type: {
                type: 'string',
                default: 'RECEIVABLE',
                'x-hidden': true,
              },
              type: {
                type: 'string',
                default: 'SALES_ORDER',
                'x-hidden': true,
              },
              receipt_direction: {
                type: 'string',
                'x-component': 'Radio.Group',
                'x-component-props': {
                  optionType: 'button',
                  class: 'w-full',
                },
                enum: [
                  {
                    label: `{{t('collection-voucher.receipt_direction.positive_order')}}`,
                    value: 'POSITIVE_ORDER',
                  },
                  {
                    label: `{{t('collection-voucher.receipt_direction.negative_order')}}`,
                    value: 'NEGATIVE_ORDER',
                  },
                ],
              },
              received_amount: {
                type: 'number',
                'x-hidden': true,
                'x-reactions': {
                  dependencies: ['receipt_order_item_list.*.amount'],
                  fulfill: {
                    state: {
                      value: `{{ sum($deps[0]??[]) }}`,
                    },
                  },
                },
              },
              b9n9mq008fu: {
                type: 'void',
                'x-component': 'Space',
                properties: {
                  customer_id: {
                    type: 'string',
                    'x-component': 'FormilySearchSelect',
                    'x-decorator': 'FormItem',
                    title: "{{t('account.customer')}}",
                    'x-component-props': {
                      placeholder: "{{t('common.select')}}",
                      multiple: false,
                      disabled: false,
                      remoteShowSuffix: true,
                      onSearch: (params: any) =>
                        getCustomerPageListApi(params).then((res) => {
                          return {
                            ...res,
                            list: res.list.map((item: any) => {
                              return {
                                ...item,
                                label: item.name,
                                value: item.id,
                              };
                            }),
                          };
                        }),
                    },
                    'x-validator': [
                      null,
                      {
                        required: true,
                        message: '{{t("common.validate.required")}}',
                      },
                    ],
                  },
                  payer_name: {
                    type: 'string',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    title: "{{t('account.traderName')}}",
                    'x-validator': [
                      null,
                      {
                        required: true,
                        message: '{{t("common.validate.required")}}',
                      },
                      {},
                    ],
                    'x-component-props': {
                      placeholder: "{{t('common.enter')}}",
                      clearable: true,
                      disabled: false,
                    },
                  },
                  receipt_time: {
                    type: 'string',
                    'x-component': 'DatePicker',
                    'x-decorator': 'FormItem',
                    title: "{{t('account.date')}}",
                    'x-validator': [
                      null,
                      {
                        required: true,
                        message: '{{t("common.validate.required")}}',
                      },
                    ],
                    'x-component-props': {
                      placeholder: "{{t('common.enter')}}",
                      'date-format': 'MMM DD, YYYY',
                      'time-format': 'HH:mm',
                      format: 'YYYY-MM-DD HH:mm',
                      type: 'datetime',
                      disabled: false,
                    },
                  },
                  total_amount: {
                    type: 'string',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    title: "{{t('account.receivable_balance')}}",
                    'x-component-props': {
                      placeholder: "{{t('common.enter')}}",
                      disabled: true,
                    },
                    'x-validator': [null],
                  },
                  last_debt: {
                    type: 'string',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    title: "{{t('account.last_debt')}}",
                    'x-component-props': {
                      placeholder: "{{t('common.enter')}}",
                      disabled: true,
                    },
                    'x-validator': [null],
                  },
                },
              },
            },
          },
          channel: {
            type: 'string',
            default: 'WEB',
            'x-hidden': true,
          },
          currency_code: {
            type: 'string',
            'x-hidden': true,
            'x-reactions': {
              fulfill: {
                state: {
                  value: '{{ currencySymbol }}',
                },
              },
            },
          },

          business_type: {
            type: 'string',
            'x-hidden': true,
            'x-reactions': {
              fulfill: {
                state: {
                  value: '{{ business_type }}',
                },
              },
            },
          },
          'order-card': {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {},
            'x-content': {
              header: () => {
                return h(CollectionTableModal);
              },
            },
            properties: {
              business_order: {
                type: 'array',
                'x-component': 'ArrayTable',
                'x-component-props': {},
                items: {
                  type: 'object',
                  properties: {
                    col_index: {
                      type: 'void',
                      'x-component': 'ArrayTable.Index',
                      properties: {
                        business_id: {
                          type: 'string',
                          'x-hidden': true,
                        },
                      },
                    },
                    create_time_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("account.createTime") }}',
                        minWidth: 150,
                      },
                      properties: {
                        create_time: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                    order_create_time_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("account.order_settlement_date") }}',
                        minWidth: 150,
                      },
                      properties: {
                        business_create_time: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                    business_type_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("account.source_order_type") }}',
                        minWidth: 150,
                      },
                      properties: {
                        business_type: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                    order_no_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("printTemp.order_no") }}',
                        minWidth: 150,
                      },
                      properties: {
                        order_no: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                    order_total_amount_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("account.order-amount") }}',
                        minWidth: 150,
                      },
                      properties: {
                        total_amount: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                    repaid_amount_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("account.receivedAmount") }}',
                        minWidth: 150,
                      },
                      properties: {
                        repaid_amount: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                    remaining_amount_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("account.pendingReceivableAmount") }}',
                        minWidth: 150,
                      },
                      properties: {
                        remaining_amount: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                    remark_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("account.remarks") }}',
                        minWidth: 150,
                      },
                      properties: {
                        remark: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          'pay-card': {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              header: '支付信息',
            },
            properties: {
              'count-row': {
                type: 'void',
                'x-component': 'Space',
                'x-reactions': {
                  dependencies: ['.order_info'],
                  fulfill: {
                    state: {
                      hidden: '{{ $deps[0]?.length <= 0 }}',
                    },
                  },
                },
                properties: {
                  discount: {
                    title: `{{t('account.discount')}}`,
                    'x-decorator': 'FormItem',
                    'x-component': 'InputNumber',
                    type: 'number',
                  },
                  'discount-rate': {
                    title: `{{t('account.total_discount_rate')}}`,
                    'x-decorator': 'FormItem',
                    'x-component': 'InputNumber',
                    type: 'number',
                  },
                  total: {
                    title: '{{t("account.total_discount")}}',
                    'x-decorator': 'FormItem',
                    'x-component': 'InputNumber',
                    type: 'number',
                  },
                  service_fee_amount: {
                    type: 'number',
                    'x-hidden': true,
                  },
                },
              },
              receipt_order_item_list: {
                type: 'array',
                'x-component': 'ArrayTable',
                items: {
                  type: 'object',
                  'x-decorator': 'ArrayTable.Item',
                  properties: {
                    col_index: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '#',
                        width: 40,
                      },
                      properties: {
                        index: {
                          type: 'void',
                          'x-component': 'ArrayTable.Index',
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
                        business_type: {
                          type: 'string',
                          'x-hidden': true,
                          'x-reactions': {
                            fulfill: {
                              state: {
                                value: '{{ business_type }}',
                              },
                            },
                          },
                        },
                      },
                    },

                    col_account_ledger_id: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      properties: {
                        account_ledger_id: {
                          type: 'string',
                        },
                      },
                      'x-hidden': true,
                    },
                    col_business_id: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      properties: {
                        business_id: {
                          type: 'string',
                        },
                      },
                      'x-hidden': true,
                    },
                    col_payment_method_mark: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      properties: {
                        payment_method_mark: {
                          type: 'string',
                        },
                      },
                      'x-hidden': true,
                    },
                    col_order_id: {
                      type: 'void',
                      'x-component-props': {
                        title: `{{t("account.order")}}`,
                      },
                      'x-component': 'ArrayTable.Column',
                      properties: {
                        business_id: {
                          type: 'string',
                          'x-component': 'Select',
                          'x-reactions': {
                            dependencies: ['business_order'],
                            fulfill: {
                              state: {
                                dataSource:
                                  '{{ $deps[0]?.map(i=> ({value:i.id,label:i.order_no})) }}',
                              },
                            },
                          },
                        },
                      },
                    },
                    col_account_id: {
                      type: 'void',
                      'x-component-props': {
                        title: `{{t("account.payAccount")}}`,
                      },
                      'x-component': 'ArrayTable.Column',
                      properties: {
                        account_id: {
                          type: 'string',
                          'x-component': 'FormilySearchSelect',
                          'x-component-props': {
                            multiple: false,
                            onSearch: ' {{ getAccountManagementOptionList }}',
                            '@change': `{{(value,op)=> accountChange(value,op,$self,$index) }}`,
                          },
                        },
                      },
                    },
                    col_payment_method_type: {
                      type: 'void',
                      'x-component-props': {
                        title: `{{t("account.pay_method")}}`,
                      },
                      'x-component': 'ArrayTable.Column',
                      properties: {
                        payment_method_type: {
                          type: 'string',
                          'x-component': 'FormilySearchSelect',
                          'x-component-props': {
                            multiple: false,
                            onChange:
                              '{{ (value,op)=> payment_method_change(value,op,$self,$index) }}',
                            onSearch: '{{ merchantPaymentMethodOption }}',
                          },
                        },
                      },
                    },
                    col_amount: {
                      type: 'void',
                      'x-component-props': {
                        title: `{{t("account.pay_amount")}}`,
                      },
                      'x-component': 'ArrayTable.Column',
                      properties: {
                        amount: {
                          type: 'string',
                          'x-component': 'InputNumber',
                        },
                      },
                    },
                    op: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: "{{ t('account.operation') }}",
                        width: 100,
                        fixed: 'right',
                      },
                      properties: {
                        add: {
                          type: 'void',
                          title: "{{ t('account.add') }}",
                          'x-component': 'ArrayTable.Addition',
                        },
                        remove: {
                          type: 'void',
                          title: "{{ t('common.delete') }}",
                          'x-component': 'ArrayTable.Remove',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          other_card: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              header: '{{ t("common.other-info") }}',
            },
            properties: {
              remark: {
                type: 'string',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                title: "{{t('account.remarks')}}",
                'x-component-props': {
                  placeholder: "{{t('common.enter')}}",
                  maxlength: 500,
                  type: 'textarea',
                  showWordLimit: true,
                },
                'x-decorator-props': {
                  wrapperWidth: '100%',
                },
              },
              attachment_url: {
                type: 'string',
                title: "{{t('common.attachment')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Upload',
                'x-component-props': {
                  limit: 4,
                  drag: true,
                },
                'x-decorator-props': {
                  wrapperWidth: '300',
                },
              },
            },
          },
        },
      },
    },
  } as ISchema;
}
