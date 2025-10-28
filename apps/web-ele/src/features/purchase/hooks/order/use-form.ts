import type { ISchema } from '@igourd/common-ui';

import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';

import { h, inject, ref } from 'vue';

import { onFieldValueChange, Space } from '@igourd/common-ui';
import { createIconifyIcon } from '@igourd/icons';
import { useI18n } from '@igourd/locales';
import ModalTable from '@igourd/plugins/modal-table';
import { useUserStore } from '@igourd/stores';

import {
  createPurchaseOrderApi,
  getPurchaseListApi,
  getPurchaseOrderDetailApi,
  getPurchaseReceiptPageListApi,
  updatePurchaseOrderApi,
} from '@@/purchase/apis';

import { basicsCurrencyList } from '#/api';
import { orderNoGenerate } from '#/api/common';
import { getAccountManagementOptionList } from '#/features/account';
import { wareHouseProductSearch } from '#/features/inventory';
import { paymentMethodListUsingPOST } from '#/features/setting';
import { useDrawerForm, useWarehouseSelect } from '#/hooks';
import { floorDecimal } from '#/utils/eleValidate';
// 供应商数据
const purchaseList = ref([]);
// 货币数据
const currencyList = ref([]);
function remoteMethod(keywords: string) {
  return getPurchaseListApi({
    page_num: 1,
    page_size: 15,
    keywords,
  }).then((res) => {
    purchaseList.value = res.list;
    return res.list.map((item: any) => {
      return {
        ...item,
        label: item.name,
        value: item.id,
      };
    });
  });
}
// 获取货币列表
const getCurrencyList = async () => {
  const result = await basicsCurrencyList({});
  currencyList.value = result;
  return result.map((item: any) => {
    return {
      ...item,
      label: item.name,
      value: item.id,
    };
  });
};
// 支付方式
const getPaymentMethodListOption = async (data: any) => {
  const params = {
    ...data,
    payment_scene_type: 'PURCHASE',
  };
  return paymentMethodListUsingPOST(params).then((res) => {
    return {
      list: res?.map((i) => {
        return {
          ...i,
          value: i.payment_method_type.value,
          label: i.payment_method_type.label,
        };
      }),
    };
  });
};
export function useOrderForm() {
  const { t } = useI18n();
  const { gridApi } = inject<{
    gridApi: ExtendedVxeGridApi;
  }>(Symbol.for('PageGrid'), { gridApi: null });
  const warehouse = useWarehouseSelect();
  const { currentLoginUserApp } = useUserStore();
  const vatConfigurationEnums = [
    { label: t('order.not-applicable'), value: 'NOT_APPLICATION' },
    { label: t('order.vat-inclusive'), value: 'VAT_INCLUSIVE' },
    { label: t('order.vat-exclusive'), value: 'VAT_EXCLUSIVE' },
  ];

  // 配置form
  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
          colon: false,
        },

        properties: {
          card_0: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              // header: '{{t("discount.form.basicInfo")}}',
            },
            properties: {
              row_0: {
                type: 'void', // 表示空字段
                title: "{{t('transfer.source-warehouse-name')}}", // formItem 的 label
                'x-component': 'div',
                'x-component-props': {
                  class: 'flex gap-4 mt-4',
                },
                properties: {
                  left_box: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      class: 'rounded-lg px-4 pb-4',
                      style: {
                        border: '1px dashed #dddfe7',
                        width: '40%',
                      },
                    },
                    properties: {
                      vendor_id: {
                        type: 'string',
                        title: "{{t('purchase.vender-name')}}",
                        'x-decorator': 'FormItem',
                        'x-component': 'RemoteSelect',
                        'x-component-props': {
                          remoteMethod,
                        },
                        'x-validator': [
                          {
                            required: true,
                            message: "{{t('order.please-select-supplier')}}",
                          },
                        ],
                      },
                      info: {
                        type: 'void',
                        'x-component': 'div',
                        'x-content': '',
                        'x-visible': false,
                        'x-component-props': {
                          class: 'flex border-b border-gray-300 pb-4',
                          style: {
                            fontSize: '12px',
                          },
                        },
                        properties: {
                          label_0: {
                            type: 'void',
                            'x-component': 'div',
                            'x-content': "{{t('purchase.vendor')+' : '}}",
                            'x-component-props': {
                              class: 'text-slate-300',
                            },
                          },
                          vendor_name: {
                            type: 'string',
                            'x-component': 'div',
                            'x-content': "{{$self.value?$self.value:''}}",
                            'x-component-props': {
                              class: 'text-slate-700',
                            },
                          },
                        },
                      },
                      info_1: {
                        type: 'void',
                        'x-component': 'div',
                        'x-content': '',
                        'x-visible': false,
                        'x-component-props': {
                          class: 'flex',
                          style: {
                            fontSize: '12px',
                          },
                        },
                        properties: {
                          label_0: {
                            type: 'void',
                            'x-component': 'div',
                            'x-content': "{{t('purchase.contact-name')+' : '}}",
                            'x-component-props': {
                              class: 'text-slate-300 mt-4',
                            },
                          },
                          contact_name: {
                            type: 'string',
                            'x-component': 'div',
                            'x-content': "{{$self.value?$self.value:''}}",
                            'x-component-props': {
                              class: 'text-slate-700 mt-4 mr-4',
                            },
                          },
                          label_1: {
                            type: 'void',
                            'x-component': 'div',
                            'x-content': "{{t('purchase.phone-number')+' : '}}",
                            'x-component-props': {
                              class: 'text-slate-300 mt-4',
                            },
                          },
                          phone_number: {
                            type: 'string',
                            'x-component': 'div',
                            'x-content': "{{$self.value?$self.value:''}}",
                            'x-component-props': {
                              class: 'text-slate-700 mt-4',
                            },
                          },
                        },
                      },
                    },
                  },
                  right_box: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      class: 'grid grid-cols-3 gap-x-4 gap-y-0',
                      style: {
                        width: '100%',
                      },
                    },
                    properties: {
                      purchase_order_no: {
                        type: 'string',
                        title: "{{t('purchase.number')}}",
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-decorator-props': {
                          feedbackLayout: 'terse',
                        },
                        'x-component-props': {
                          disabled: true,
                        },
                      },
                      purchase_date: {
                        type: 'string',
                        title: "{{t('order.order-date')}}",
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'DatePicker',
                        'x-decorator-props': {
                          feedbackLayout: 'terse',
                        },
                        'x-component-props': {
                          maxLength: 32,
                          placeholder: "{{t('common.select')}}",
                          clearable: true,
                        },
                        'x-validator': [
                          {
                            required: true,
                            message: "{{t('order.please-select-order-date')}}",
                          },
                        ],
                      },
                      vat_configuration: {
                        type: 'string',
                        title: "{{t('order.vat')}}",
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-decorator-props': {
                          feedbackLayout: 'terse',
                        },
                        'x-component-props': {},
                        'x-validator': [
                          {
                            required: true,
                            message: "{{t('order.please-select-vat')}}",
                          },
                        ],
                        enum: vatConfigurationEnums,
                      },
                      warehouse_id: {
                        type: 'string',
                        title: "{{t('order.warehouse')}}",
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-decorator-props': {
                          feedbackLayout: 'terse',
                        },
                        'x-component-props': {},
                        'x-validator': [
                          {
                            required: true,
                            message: "{{t('order.please-warehouse')}}",
                          },
                        ],
                        'x-reactions': {
                          fulfill: {
                            state: {
                              dataSource: '{{ warehouse.value }}',
                            },
                          },
                        },
                      },
                      row_0: {
                        type: 'void', // 表示空字段
                        title: "{{t('purchase.currency')}}", // formItem 的 label
                        'x-component': 'Space',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          asterisk: true, // label 上显示必填的 * 号
                          feedbackLayout: 'none',
                        },

                        properties: {
                          currency_code: {
                            type: 'string',
                            title: '',
                            'x-decorator': 'FormItem',
                            'x-component': 'RemoteSelect',
                            'x-component-props': {
                              remoteMethod: getCurrencyList,
                              style: { width: '100px', marginRight: '10px' },
                            },
                            'x-validator': [
                              {
                                required: true,
                                message:
                                  "{{t('order.please-enter-exchange-rate')}}",
                              },
                            ],
                          },
                          exchange_rate: {
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-decorator-props': {
                              label: '',
                            },
                            'x-validator': [],
                            'x-component-props': {
                              style: 'width: 140px;',
                              colon: false,
                              disabled: true,
                            },
                            'x-reactions': {
                              fulfill: {
                                state: {
                                  dataSource: '',
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
              card: {
                type: 'void',
                'x-component': 'Card',
                'x-component-props': {
                  shadow: 'never',
                  extra: 'ass',
                  bordered: false,
                  class: 'mt-4',
                  style: {
                    border: '0px',
                  },
                },
                'x-content': {
                  header: () => {
                    return h(Space, null, [
                      h('div', null, t('order.product-details')),
                      h(ModalTable, {
                        text: t('order.quick-select'),
                        title: t('order.product-selection-list'),
                      }),
                    ]);
                  },
                },
                properties: {
                  purchase_order_item_list: {
                    type: 'array',
                    'x-decorator': 'FormItem',
                    'x-component': 'ProductTable',
                    'x-component-props': {
                      mode: 'purchase',
                      capabilities: [
                        'barcode',
                        'unit',
                        'vat',
                        'discount',
                        'stock',
                        'image',
                        'remark',
                      ],
                      vatMode: 'VAT_EXCLUSIVE',
                      // 业务标记（用于单位禁用逻辑兼容旧条件）
                      isReceiptMode: false,
                      purchaseOrderSelected: false,
                      // 可选：展示/校验库存
                      searchProducts: (keywords: string) => {
                        return wareHouseProductSearch({
                          keywords,
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          warehouse_id: formAPI.values.warehouse_id,
                          // business_type: 'purchase',
                          page_num: 1,
                          page_size: 20,
                        }).then(({ list }) => {
                          return list.map((item: any) => {
                            return {
                              ...item,
                              value: item.id,
                              label: [
                                item.major_name,
                                item.product_spec_kvmessage,
                              ]
                                .filter(Boolean)
                                .join('-'),
                            };
                          });
                        });
                      },
                    },
                  },
                },
              },
              row_1: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  class: 'w-full flex my-10',
                  style: {
                    'padding-left': 'var(--el-card-padding)',
                    'padding-right': 'var(--el-card-padding)',
                  },
                },
                properties: {
                  row_col_0: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      class: 'w-2/3',
                      style: {},
                    },
                    properties: {
                      space_0: {
                        type: 'void',
                        'x-component': 'Space',
                        title: "{{t('purchase.order-pay.select-account')}}",
                        properties: {
                          // 支付优惠
                          discount_amount: {
                            type: 'string',
                            title: "{{t('purchase.order-pay.discount')}}",
                            'x-decorator': 'FormItem',
                            'x-component': 'InputNumber',
                            'x-component-props': {
                              '@blur': `{{(value,op)=> discountAmountChange(value,op,$self,$index) }}`,
                            },
                          },
                          discount_percentage: {
                            type: 'string',
                            title: "{{t('purchase.order-pay.discount-rate')}}",
                            'x-decorator': 'FormItem',
                            'x-component': 'InputNumber',
                            'x-decorator-props': {
                              size: 'small',
                              feedbackLayout: 'terse',
                            },
                            'x-component-props': {
                              '@blur': `{{(value,op)=> discountPercentageChange(value,op,$self,$index) }}`,
                            },
                          },
                          total_amount: {
                            type: 'string',
                            title: "{{t('purchase.order-pay.total')}}",
                            'x-decorator': 'FormItem',
                            'x-component': 'InputNumber',
                            'x-decorator-props': {
                              size: 'small',
                              feedbackLayout: 'terse',
                            },
                          },
                        },
                      },
                      purchase_order_deposit_list: {
                        type: 'array',
                        'x-component': 'ArrayItems',
                        'x-decorator': '',
                        title: '',
                        items: {
                          type: 'object',
                          'x-decorator': 'ArrayItems.Item',
                          properties: {
                            space: {
                              type: 'void',
                              'x-component': 'Space',
                              'x-component-props': {
                                style: {
                                  'align-items': 'end',
                                },
                              },
                              properties: {
                                // 支付账号
                                account_id: {
                                  type: 'string',
                                  title:
                                    "{{t('purchase.order-pay.select-account')}}",
                                  'x-decorator': 'FormItem',
                                  'x-component': 'FormilySearchSelect',
                                  'x-decorator-props': {
                                    size: 'small',
                                    feedbackLayout: 'terse',
                                  },
                                  'x-component-props': {
                                    multiple: false,
                                    class: 'ig-bottom-line',
                                    onSearch:
                                      ' {{ getAccountManagementOptionList }}',
                                    '@change': `{{(value,op)=> accountChange(value,op,$self,$index) }}`,
                                  },
                                },
                                // 支付方式
                                payment_method_type: {
                                  type: 'string',
                                  title:
                                    "{{t('purchase.order-pay.payment-method')}}",
                                  'x-decorator': 'FormItem',
                                  'x-component': 'FormilySearchSelect',
                                  'x-component-props': {
                                    class: 'ig-bottom-line',
                                    multiple: false,
                                    onChange:
                                      '{{ (value,op)=> payment_method_change(value,op,$self,$index) }}',
                                    onSearch:
                                      '{{ getPaymentMethodListOption }}',
                                  },
                                },
                                // 定金比例
                                amount_rate: {
                                  type: 'number',
                                  title:
                                    "{{t('purchase.order-pay.deposit-rate')}}",
                                  'x-decorator': 'FormItem',
                                  'x-component': 'InputNumber',
                                  'x-decorator-props': {
                                    size: 'small',
                                    feedbackLayout: 'terse',
                                  },
                                  'x-component-props': {
                                    class: 'ig-bottom-line',
                                    '@blur': `{{(value,op)=> amountRateChange(value,op,$self,$index) }}`,
                                  },
                                },
                                // 定金
                                amount: {
                                  type: 'number',
                                  title: "{{t('purchase.order-pay.deposit')}}",
                                  'x-decorator': 'FormItem',
                                  'x-component': 'InputNumber',
                                  'x-decorator-props': {
                                    size: 'small',
                                    feedbackLayout: 'terse',
                                  },
                                  'x-component-props': {
                                    class: 'ig-bottom-line',
                                    '@blur': `{{(value,op)=> amountChange(value,op,$self,$index) }}`,
                                  },
                                },
                                is_auto_generate_advance_payment: {
                                  type: 'number',
                                  title: '',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Checkbox',
                                  'x-content':
                                    "{{t('purchase.order-pay.auto-create-prepaid-order')}}",
                                },

                                addonBefore: {
                                  type: 'void',
                                  'x-component': 'Tooltip',
                                  'x-component-props': {
                                    effect: 'light',
                                    content:
                                      "{{t('purchase.order-pay.auto-create-prepaid-order-msg')}}",
                                  },
                                  properties: {
                                    content: {
                                      type: 'void',
                                      'x-component': 'Button',
                                      'x-component-props': {
                                        style: {
                                          padding: '0',
                                          'margin-bottom': '10px',
                                        },
                                        type: '',
                                        text: 'plain',
                                        icon: "{{icon('material-symbols:help-outline-rounded')}}",
                                      },
                                    },
                                  },
                                },

                                account_ledger_id: {
                                  type: 'string',
                                  'x-hidden': true,
                                },
                                currency_code: {
                                  type: 'string',
                                  'x-hidden': true,
                                },
                                payment_method_id: {
                                  type: 'string',
                                  'x-hidden': true,
                                },
                                business_type: {
                                  type: 'string',
                                  'x-hidden': true,
                                  // default: 'PURCHASE_ORDER_REFUND',
                                },
                                payment_method_mark: {
                                  type: 'string',
                                  'x-hidden': true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  row_col_1: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      class: 'w-1/3 flex items-center justify-center mt-6 mb-6',
                      style: {
                        background: '#edf5ff',
                      },
                    },
                    properties: {
                      center: {
                        type: 'void',
                        'x-component': 'div',
                        'x-component-props': {
                          class: 'p-4',
                        },
                        properties: {
                          label_1: {
                            type: 'void',
                            'x-component': 'div',
                            'x-component-props': {
                              class: 'flex',
                            },
                            properties: {
                              c: {
                                type: 'void',
                                'x-component': 'div',
                                'x-content': "{{t('purchase.subtotal')+' : '}}",
                                'x-component-props': {
                                  class: 'w-20 text-right',
                                  style: { fontSize: '14px' },
                                },
                              },
                              subtotal_amount: {
                                type: 'string',
                                'x-component': 'div',
                                'x-content': "{{$self.value?$self.value:'0'}}",
                                'x-component-props': {
                                  style: {},
                                },
                              },
                            },
                          },
                          label_2: {
                            type: 'void',
                            'x-component': 'div',
                            'x-component-props': {
                              class: 'flex',
                            },
                            properties: {
                              c: {
                                type: 'void',
                                'x-component': 'div',
                                'x-content': "{{t('purchase.vat')+' : '}}",
                                'x-component-props': {
                                  class: 'w-20 text-right',
                                  style: { fontSize: '14px' },
                                },
                              },
                              vat_amount: {
                                type: 'string',
                                'x-component': 'div',
                                'x-content': "{{$self.value?$self.value:'0'}}",
                                'x-component-props': {
                                  style: {},
                                },
                              },
                            },
                          },
                          label_3: {
                            type: 'void',
                            'x-component': 'div',
                            'x-component-props': {
                              class: 'flex',
                            },
                            properties: {
                              c: {
                                type: 'void',
                                'x-component': 'div',
                                'x-content':
                                  "{{t('purchase.other-tax')+' : '}}",
                                'x-component-props': {
                                  class: 'w-20 text-right',
                                  style: { fontSize: '14px' },
                                },
                              },
                              other_tax_amount: {
                                type: 'string',
                                'x-component': 'div',
                                'x-content': "{{$self.value?$self.value:'0'}}",
                                'x-component-props': {
                                  style: {},
                                },
                              },
                            },
                          },
                          label_4: {
                            type: 'void',
                            'x-component': 'div',
                            'x-component-props': {
                              class: 'flex',
                            },
                            properties: {
                              c: {
                                type: 'void',
                                'x-component': 'div',
                                'x-content':
                                  "{{t('purchase.order-pay.discount')+' : '}}",
                                'x-component-props': {
                                  class: 'w-20 text-right',
                                  style: { fontSize: '14px' },
                                },
                              },
                              discount_amount: {
                                type: 'string',
                                'x-component': 'div',
                                'x-content': "{{$self.value?$self.value:'0'}}",
                                'x-component-props': {
                                  style: {},
                                },
                              },
                            },
                          },
                          label_5: {
                            type: 'void',
                            'x-component': 'div',
                            'x-component-props': {
                              class: 'flex',
                            },
                            properties: {
                              c: {
                                type: 'void',
                                'x-component': 'div',
                                'x-content': "{{t('purchase.total')+' : '}}",
                                'x-component-props': {
                                  class: 'w-20 text-right',
                                  style: { fontSize: '14px' },
                                },
                              },
                              total_amount: {
                                type: 'string',
                                'x-component': 'div',
                                'x-content': "{{$self.value?$self.value:'0'}}",
                                'x-component-props': {
                                  style: {},
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
              card_1: {
                type: 'void',
                'x-component': 'Card',
                'x-component-props': {
                  header: '{{t("common.remarks")}}',
                  style: {
                    border: '0px',
                  },
                },
                properties: {
                  remark: {
                    type: 'string',
                    title: '',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input.TextArea',
                    'x-component-props': {
                      maxlength: 256,
                      rows: 5,
                      'show-word-limit': true,
                    },
                  },
                },
              },
              card_2: {
                type: 'void',
                'x-component': 'Card',
                'x-component-props': {
                  header: '{{t("common.attachment")}}',
                  style: {
                    border: '0px',
                  },
                },
                properties: {
                  files: {
                    type: 'array',
                    title: '',
                    'x-component': 'Upload',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      drag: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  // 表单提交处理
  const handleSubmit = async (formData: any) => {
    try {
      let response = null;
      // 其他税额
      formData.other_tax_amount = 0;
      formData.merchant_id = currentLoginUserApp.owner_id;
      formData.deposit_amount = 0;

      // 合计金额
      const total = formData.purchase_order_item_list.reduce(
        (acc: any, item: any) => acc + item.quantity * item.cost_price,
        0,
      );

      formData.purchase_order_item_list.forEach((item) => {
        item.product_name = item.label;
        item.other_tax_amount = 0;
        item.vat_amount = 0;
        item.subtotal_amount = item.quantity * item.cost_price;
        item.total_amount = item.quantity * item.cost_price;
        if (item.is_auto_generate_advance_payment) {
          formData.is_auto_generate_advance_payment = true;
        }
      });

      formData.purchase_order_deposit_list.forEach((item) => {
        item.merchant_id = currentLoginUserApp.owner_id;
        // 设置外层定金
        if (item.amount) {
          formData.deposit_amount = item.amount;
        }
      });

      // 	汇率(选择币种和系统币种的换算比例)
      formData.exchange_rate = 0;
      formData.vat_amount = 0;
      // subtotal_amount  商品总金额
      formData.subtotal_amount = total.toFixed(2);
      // total_amount  最终总金额
      formData.total_amount = total.toFixed(2);
      const params = JSON.parse(JSON.stringify(formData));
      // 没有支付账号 把参数参数
      if (
        params.purchase_order_deposit_list.length > 0 &&
        !params.purchase_order_deposit_list[0].account_id
      ) {
        delete params.purchase_order_deposit_list;
      }
      response = formData.id
        ? updatePurchaseOrderApi(params)
        : await createPurchaseOrderApi(params);
      gridApi.reload();
      return response;
    } catch (error) {
      console.error('采购单 customized form submission error:', error);
      throw error;
    }
  };

  const onBeforeOpen = () => {
    return formAPI.validate('customer_id');
  };
  const onSelectOrder = (records: any) => {
    if (!records) {
      return;
    }

    formAPI.setValues({
      order_info: records,
      receipt_order_item_list: [{}],
    });
  };
  const orderListApi = (data: any) => {
    const customer_id = formAPI.getValuesIn('customer_id');
    return getPurchaseReceiptPageListApi({
      ...data,
      customer_id,
      payment_type: '',
      status_list: [],
    });
  };
  const accountChange = (_, op, record, index) => {
    if (!op) {
      return;
    }
    formAPI.setValuesIn(
      `purchase_order_deposit_list.${index}.account_ledger_id`,
      op.account_ledger_id,
    );
    formAPI.setValuesIn(
      `purchase_order_deposit_list.${index}.currency_code`,
      op.currency_code,
    );
  };
  const payment_method_change = (_, op, record, index) => {
    if (!op) {
      return;
    }

    formAPI.setValuesIn(
      `purchase_order_deposit_list.${index}.payment_method_id`,
      op.id,
    );
    formAPI.setValuesIn(
      `purchase_order_deposit_list.${index}.payment_method_mark`,
      op.mark,
    );
  };

  const summary = (list) => {
    const total = list.reduce(
      (acc: any, item: any) =>
        acc + (item.quantity ? item.quantity : 0) * item.cost_price,
      0,
    );
    return {
      subtotalAmount: total.toFixed(2),
      totalAmount: total.toFixed(2),
    };
  };
  const generateNo = async () => {
    const result = await orderNoGenerate({
      category_type: 'PURCHASE_ORDER',
    });
    return result.order_no;
  };
  // 设置支付账号 支付方式 是否必填
  const setRequired = (form: any, required: boolean) => {
    form.setFieldState('purchase_order_deposit_list.*.account_id', (f) => {
      f.required = required;
    });
    form.setFieldState(
      'purchase_order_deposit_list.*.payment_method_type',
      (f) => {
        f.required = required;
      },
    );
  };
  // 根据订金金额计算优惠比例
  const amountChange = (_, op, record, index) => {
    const total_amount = formAPI.values.total_amount || 0;
    let rate =
      Number.parseFloat(record.value) / Number.parseFloat(total_amount);
    if (
      rate !== Infinity &&
      Number.parseFloat(record.value) < Number.parseFloat(total_amount)
    ) {
      rate = floorDecimal(rate * 100, 2);
      formAPI.setValuesIn('purchase_order_deposit_list.0.amount_rate', rate);
    }
  };
  // 根据订金比例计算优惠金额
  const amountRateChange = (_, op, record, index) => {
    const total_amount = formAPI.values.total_amount || 0;
    const abs =
      Number.parseFloat(total_amount) * Number.parseFloat(record.value / 100);
    formAPI.setValuesIn('purchase_order_deposit_list.0.amount', abs);
  };

  // 根据优惠金额计算优惠比例
  const discountAmountChange = (_, op, record, index) => {
    const total_amount = formAPI.values.total_amount || 0;
    let rate =
      Number.parseFloat(record.value) / Number.parseFloat(total_amount);
    if (
      rate !== Infinity &&
      Number.parseFloat(record.value) < Number.parseFloat(total_amount)
    ) {
      rate = floorDecimal(rate * 100, 2);
      formAPI.setValuesIn('discount_percentage', rate);
    }
  };
  // 根据优惠比例计算优惠金额
  const discountPercentageChange = (_, op, record, index) => {
    const total_amount = formAPI.values.total_amount || 0;
    const abs =
      Number.parseFloat(total_amount) * Number.parseFloat(record.value / 100);
    formAPI.setValuesIn('discount_amount', abs);
  };

  const { Drawer, drawerApi, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      class: 'w-full',
      appendToMain: true,
      title: '添加采购订单',
      contentClass: 'bg-muted  px-0',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          // 编辑
          if (data.id) {
            const detail = await getPurchaseOrderDetailApi({
              purchase_order_id: data.id,
            });
            detail.purchase_order_item_list =
              detail.purchase_order_item_model_list;
            detail.purchase_order_deposit_list =
              detail.purchase_order_deposit_detail_models;
            formAPI.setValues(detail);
          } else {
            // 增加时，保留1条数据
            const purchase_order_no = await generateNo();
            formAPI.setValues({
              purchase_order_no,
              purchase_order_item_list: [{}],
            });
          }
        } else {
          // 关闭抽屉时，重置表单
          formAPI.values = {};
        }
      },
      onClosed() {
        formAPI.reset();
      },
      async onConfirm() {
        await formAPI.validate();
        drawerApi.lock();
        await handleSubmit(formAPI.values)
          .then(() => {
            drawerApi.close();
          })
          .finally(() => {
            drawerApi.unlock();
          });
      },
    },
    formOptions: {
      initialValues: {
        purchase_order_item_list: [{}],
        purchase_order_deposit_list: [{}],
      },
      scope: {
        warehouse,
        getAccountManagementOptionList,
        accountChange,
        payment_method_change,
        getPaymentMethodListOption,
        discountAmountChange,
        discountPercentageChange,
        amountRateChange,
        amountChange,
        icon: (name: string) => {
          const IconComponent = createIconifyIcon(name);
          return IconComponent ? h(IconComponent) : null;
        },
      },
      effects() {
        // 选中供应商
        onFieldValueChange('vendor_id', (field, form) => {
          console.log(`target值变化：${field.value}`);
          const currObj = purchaseList.value.find(
            (item) => item.id === field.value,
          );

          form.setValuesIn('vendor_name', currObj?.name);
          form.setValuesIn('contact_name', currObj?.contact_name);
          form.setValuesIn('phone_number', currObj?.contact_telephone);
          form.setFieldState('info', (f) => {
            f.visible = true;
          });
          form.setFieldState('info_1', (f) => {
            f.visible = true;
          });
        });
        // 选中 货币
        onFieldValueChange('currency_code', (field, form) => {
          const currObj = currencyList.value.find(
            (item) => (item.id = field.value),
          );
          form.setValuesIn('exchange_rate', currObj?.exchange_rate);
        });
        // 商品数据变化 计算合计
        onFieldValueChange('purchase_order_item_list.*', (field, form) => {
          const { subtotalAmount, totalAmount } = summary(field.records);
          form.setValuesIn('subtotal_amount', subtotalAmount);
          form.setValuesIn('total_amount', totalAmount);
        });
        // 录入定金 设置支付账号 支付方式
        onFieldValueChange(
          'purchase_order_deposit_list.*.amount',
          (field, form) => {
            if (field.value > 0) {
              setRequired(form, true);
            } else {
              setRequired(form, false);
            }
          },
        );
      },
      schema,
    },
  });
  return {
    t,
    Drawer,
    Form,
    formAPI,
    drawerApi,
  };
}
