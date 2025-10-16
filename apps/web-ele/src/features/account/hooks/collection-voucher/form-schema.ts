import { getCustomerPageListApi } from '#/features/customer';
import { Space, type ISchema } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import ModalTable from '@igourd/plugins/modal-table';
import type { VxeTableGridOptions } from '@igourd/plugins/vxe-table';
import { h } from 'vue';
export function useCollectionVoucherSchema({
  onSelectOrder,
  orderListApi,
  onBeforeOpen,
}: any) {
  const { t } = useI18n();
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
              receipt_direction: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                'x-component-props': {
                  optionType: 'button',
                },
                'x-decorator-props': {
                  layout: 'horizontal',
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
                  receivable_balance: {
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
                return h(Space, null, {
                  default: () => [
                    h('div', null, t('account.source_order_information')),
                    h(ModalTable, {
                      onBeforeOpen,
                      onConfirm: onSelectOrder,
                      text: t('account.select_source_order'),
                      title: t('account.source_order_information'),
                      grid: {
                        height: 350,
                        rowConfig: {
                          keyField: 'id',
                        },
                        proxyConfig: {
                          ajax: {
                            query: ({ page }, form) => {
                              return orderListApi({
                                ...page,
                                ...form,
                              });
                            },
                          },
                        },
                        columns: [
                          {
                            title: '',
                            type: 'radio',
                            fixed: 'left',
                          },
                          {
                            field: 'order_create_time',
                            minWidth: 200,
                            title: t('account.orderDate'),
                          },
                          {
                            field: 'order_no',
                            minWidth: 200,
                            title: t('printTemp.order_no'),
                          },
                          {
                            field: 'subtotal_amount',
                            minWidth: 200,
                            title: t('account.totalAmount'),
                          },
                          {
                            field: 'round_down_amount',
                            minWidth: 200,
                            title: t('printTemp.wipe'),
                          },
                          {
                            field: 'total_amount',
                            minWidth: 200,
                            title: t('account.transaction_amount'),
                          },
                          {
                            field: 'customer_name',
                            minWidth: 200,
                            title: t('account.customer'),
                          },
                          {
                            field: 'currency_code',
                            minWidth: 200,
                            title: t('account.currency'),
                          },
                          {
                            field: 'exchange_rate',
                            minWidth: 200,
                            title: t('account.exchangeRate'),
                          },
                          {
                            field: 'creator_name',
                            title: t('account.creator'),
                            minWidth: 200,
                          },
                          {
                            field: 'create_time',
                            minWidth: 200,
                            title: t('account.createTime'),
                          },
                        ],
                      } as VxeTableGridOptions,
                      class: 'w-[78%] m-w-[1920px]',
                    }),
                  ],
                });
              },
            },
            properties: {
              order_info: {
                type: 'array',
                'x-component': 'ArrayTable',
                'x-component-props': {},
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
                        id: {
                          type: 'string',
                          'x-hidden': true,
                        },
                        merchant_id: {
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
                        order_create_time: {
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
                        title: '{{ t("account.receivedAmount") }}',
                        minWidth: 150,
                      },
                      properties: {
                        order_total_amount: {
                          type: 'string',
                          'x-component': 'PreviewText.Input',
                        },
                      },
                    },
                    repaid_amount_col: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '{{ t("account.collect_amount") }}',
                        minWidth: 150,
                      },
                      properties: {
                        repaid_amount: {
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
              'count-row': {
                type: 'void',
                'x-component': 'Space',
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
                'x-component': 'ArrayItems',

                items: {
                  type: 'object',
                  'x-decorator': 'ArrayItems.Item',
                  properties: {
                    space: {
                      account_ledger_id: {
                        type: 'string',
                        'x-hidden': true,
                      },
                      business_id: {
                        type: 'string',
                        'x-hidden': true,
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
                      type: 'void',
                      'x-component': 'Space',
                      'x-component-props': {
                        align: 'end',
                      },
                      properties: {
                        account_id: {
                          type: 'string',
                          title: `{{t("account.pay_account")}}`,
                          'x-component': 'Select',
                          'x-decorator': 'FormItem',
                          'x-decorator-props': {
                            labelAlign: 'left',
                            layout: 'vertical',
                            wrapperWidth: 146,
                          },
                        },
                        payment_method_type: {
                          title: `{{t("account.pay_method")}}`,
                          'x-decorator': 'FormItem',
                          'x-decorator-props': {
                            labelAlign: 'left',
                            layout: 'vertical',
                            wrapperWidth: 146,
                          },
                          type: 'string',
                          'x-component': 'Select',
                        },
                        amount: {
                          type: 'InputNumber',
                          title: `{{t("account.pay_amount")}}`,
                          'x-decorator': 'FormItem',
                          'x-component': 'InputNumber',
                          'x-decorator-props': {
                            labelAlign: 'left',
                            layout: 'vertical',
                            wrapperWidth: 146,
                          },
                          'x-component-props': {
                            type: 'daterange',
                          },
                        },
                        add: {
                          type: 'void',
                          'x-component': 'ArrayItems.Addition',
                          'x-decorator': 'FormItem',
                          'x-decorator-props': {
                            wrapperWidth: 32,
                          },
                          'x-component-props': {
                            title: 'Add',
                          },
                          'x-reactions': {
                            dependencies: ['receipt_order_item_list'],
                            fulfill: {
                              state: {
                                componentProps: {
                                  disabled:
                                    '{{ $index == 0  && $deps[0].length > 1}}',
                                },
                              },
                            },
                          },
                        },
                        remove: {
                          type: 'void',
                          'x-component': 'ArrayItems.Remove',
                          'x-decorator': 'FormItem',
                          'x-component-props': {
                            title: 'Remove',
                          },
                          'x-reactions': {
                            dependencies: ['receipt_order_item_list'],
                            fulfill: {
                              state: {
                                componentProps: {
                                  disabled:
                                    '{{ $index === 0 &&  $deps[0].length <= 1 }}',
                                },
                              },
                            },
                          },
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
                title: "{{t('common.Attachment')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Upload',
                'x-component-props': {
                  limit: 4,
                  drag: true,
                },
                'x-decorator-props': {
                  wrapperWidth: '100%',
                },
              },
            },
          },
        },
      },
    },
  } as ISchema;
}
