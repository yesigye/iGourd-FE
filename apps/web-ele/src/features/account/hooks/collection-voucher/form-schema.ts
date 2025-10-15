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
      b9n9mq008fu: {
        type: 'void',
        'x-component': 'Space',
        'x-component-props': {
          class: '_first-line_f38ti_72',
        },

        properties: {
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
          receipt_direction: {
            type: 'string',
            'x-decorator': 'FormItem',
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
          customer_id: {
            type: 'string',
            'x-component': 'FormilySearchSelect',
            'x-decorator': 'FormItem',
            title: "{{t('account.customer')}}",
            'x-decorator-props': {
              layout: 'vertical',
              labelAlign: 'left',
              style: {},
            },
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
            'x-decorator-props': {
              layout: 'vertical',
              labelAlign: 'left',
              style: {},
            },
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
            'x-decorator-props': {
              layout: 'vertical',
              labelAlign: 'left',
              style: {},
            },
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
            'x-decorator-props': {
              layout: 'vertical',
              labelAlign: 'left',
              style: {},
            },
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
            'x-decorator-props': {
              layout: 'vertical',
              labelAlign: 'left',
              style: {},
            },
            'x-component-props': {
              placeholder: "{{t('common.enter')}}",
              disabled: true,
            },
            'x-validator': [null],
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
                h('div', null, t('account.select_source_order')),
                h(ModalTable, {
                  onBeforeOpen,
                  onConfirm: onSelectOrder,
                  text: t('account.source_order_information'),
                  title: t('account.select_source_order'),
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
          receipt_order_item_list: {
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
        },
      },

      remark: {
        type: 'string',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
        title: "{{t('account.remarks')}}",
        'x-decorator-props': {
          layout: 'vertical',
          labelAlign: 'left',
          style: {},
        },
        'x-component-props': {
          placeholder: "{{t('common.enter')}}",
          maxlength: 500,
          type: 'textarea',
          showWordLimit: true,
        },
        'x-validator': [null],
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
          layout: 'vertical',
          labelAlign: 'left',
          style: {},
        },
      },
    },
  } as ISchema;
}
