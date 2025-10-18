import type { ISchema } from '@igourd/common-ui';
import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';
import { onFieldValueChange } from '@igourd/common-ui';
import { h, inject, ref } from 'vue';

import { Space } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import ModalTable from '@igourd/plugins/modal-table';
import { useUserStore } from '@igourd/stores';

import {
  createPurchaseOrderApi,
  getPurchaseListApi,
  getPurchaseOrderDetailApi,
  updatePurchaseOrderApi,
  getPurchaseReceiptPageListApi,
} from '@@/purchase/apis';
import { getAccountManagementOptionList } from '#/features/account';
import { merchantPaymentMethodOption } from '#/features/setting';

import { basicsCurrencyList } from '#/api';
import { orderNoGenerate } from '#/api/common';
import { wareHouseProductSearch } from '#/features/inventory';
import { useDrawerForm, useWarehouseSelect } from '#/hooks';
// 供应商数据
const purchaseList = ref([]);
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
  return result.map((item: any) => {
    return {
      ...item,
      label: item.name,
      value: item.id,
    };
  });
};
export function useOrderForm() {
  const { t } = useI18n();
  const { gridApi } = inject<{
    gridApi: ExtendedVxeGridApi;
  }>(Symbol.for('PageGrid'));
  const warehouse = useWarehouseSelect();
  const { currentLoginUserApp } = useUserStore();
  const vatConfigurationEnums = [
    { label: t('order.not-applicable'), value: 'NOT_APPLICATION' },
    { label: t('order.VAT_inclusive'), value: 'VAT_INCLUSIVE' },
    { label: t('order.VAT_exclusive'), value: 'VAT_EXCLUSIVE' },
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
                        title: '供应商',
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
                            'x-content': "{{t('purchase.contactName')+' : '}}",
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
                            'x-content': "{{t('purchase.phoneNumber')+' : '}}",
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
                      no: {
                        type: 'string',
                        title: '编号',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-decorator-props': {
                          feedbackLayout: 'terse',
                        },
                        'x-component-props': {},
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
                            message: "{{t('order.please-selectVat')}}",
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
                        title: "{{t('order.deposit')}}", // formItem 的 label
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
                          deposit_amount: {
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-decorator-props': {
                              label: '',
                            },
                            'x-validator': [
                              {
                                required: true,
                                message: "{{t('order.input-deposit')}}",
                              },
                            ],
                            'x-component-props': {
                              style: 'width: 240px;',
                              colon: false,
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
                  style:{
                    "padding-left":"var(--el-card-padding)",
                    "padding-right":"var(--el-card-padding)"
                  }
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
                          amount_0: {
                            type: 'string',
                            title: "{{t('purchase.order-pay.discount')}}",
                            'x-decorator': 'FormItem',
                            'x-decorator-props': {
                              size: 'small',
                              feedbackLayout: 'terse',
                            },
                            'x-component': 'Input',
                          },
                          amount_1: {
                            type: 'string',
                            title: "{{t('purchase.order-pay.discount-rate')}}",
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-decorator-props': {
                              size: 'small',
                              feedbackLayout: 'terse',
                            },
                          },
                          amount_2: {
                            type: 'string',
                            title: "{{t('purchase.order-pay.total')}}",
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
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
                                  style:{
                                    "align-items": "end"
                                  }
                               },
                              properties: {
                                account_id: {
                                  type: 'string',
                                  title: "{{t('purchase.order-pay.select-account')}}",
                                  'x-decorator': 'FormItem',
                                  'x-component': 'FormilySearchSelect',
                                  'x-decorator-props': {
                                    size: 'small',
                                    feedbackLayout: 'terse',
                                  },
                                  'x-component-props': {
                                    multiple: false,

                                    onSearch:
                                      ' {{ getAccountManagementOptionList }}',
                                    '@change': `{{(value,op)=> accountChange(value,op,$self,$index) }}`,
                                  },
                                },
                                payment_method_type: {
                                  type: 'string',
                                  title: "{{t('purchase.order-pay.payment-method')}}",
                                  'x-decorator': 'FormItem',
                                  'x-component': 'FormilySearchSelect',
                                  'x-decorator-props': {
                                    size: 'small',
                                    feedbackLayout: 'terse',
                                  },
                                  'x-component-props': {
                                    multiple: false,
                                    onChange:
                                      '{{ (value,op)=> payment_method_change(value,op,$self,$index) }}',
                                    onSearch:
                                      '{{ merchantPaymentMethodOption }}',
                                  },
                                },
                                amount: {
                                  type: 'string',
                                  title: "{{t('purchase.order-pay.amount')}}",
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                  'x-decorator-props': {
                                    size: 'small',
                                    feedbackLayout: 'terse',
                                  },
                                },

                                col_actions: {
                                  type: 'void',
                                  'x-component': 'ArrayItems.Item',
                                  'x-component-props': {
                                    title: "{{t('common.operation')}}",
                                    width: 100,
                                    fixed: 'right',
                                    style:{
                                      "margin-bottom":"8px"
                                    }
                                  },
                                  properties: {
                                    addition: {
                                      type: 'void',
                                      title: "{{t('common.addBtn')}}",
                                      'x-component': 'ArrayItems.Addition',
                                      'x-reactions': {
                                        dependencies: [
                                          'purchase_order_deposit_list',
                                        ],
                                        fulfill: {
                                          state: {
                                            componentProps: {
                                              disabled:
                                                '{{  $deps[0]?.length >= 2 }}',
                                            },
                                          },
                                        },
                                      },
                                    },
                                    remove: {
                                      type: 'void',
                                      'x-component': 'ArrayItems.Remove',
                                      title: "{{ t('common.delete') }}",
                                      'x-reactions': {
                                        dependencies: [
                                          'purchase_order_deposit_list',
                                        ],
                                        fulfill: {
                                          state: {
                                            componentProps: {
                                              disabled: '{{  $deps[0]?.length === 1 }}',
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                                account_ledger_id: {
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
                                  //default: 'PURCHASE_ORDER_REFUND',
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
                              diffNum: {
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
                              diffCost: {
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
                                  "{{t('purchase.other_tax')+' : '}}",
                                'x-component-props': {
                                  class: 'w-20 text-right',
                                  style: { fontSize: '14px' },
                                },
                              },
                              diffSale: {
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
                                'x-content': "{{t('purchase.total')+' : '}}",
                                'x-component-props': {
                                  class: 'w-20 text-right',
                                  style: { fontSize: '14px' },
                                },
                              },
                              diffSale: {
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
                  header: '{{t("common.Attachment")}}',
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
      if (!formData.id) {
        const result = await orderNoGenerate({
          category_type: 'PURCHASE_ORDER',
        });
        formData.purchase_order_no = result.order_no;
      }
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
      });
      formData.purchase_order_deposit_list.forEach((item) => {
        item.merchant_id = currentLoginUserApp.owner_id;
      })

      // 	汇率(选择币种和系统币种的换算比例)
      formData.exchange_rate = 0;
      formData.vat_amount = 0;
      // subtotal_amount  商品总金额
      formData.subtotal_amount = total.toFixed(2);
      // total_amount  最终总金额
      formData.total_amount = total.toFixed(2);
      response = formData.id
        ? updatePurchaseOrderApi(formData)
        : await createPurchaseOrderApi(formData);
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
      `purchase_payment_plan_list.${index}.account_ledger_id`,
      op.account_ledger_id,
    );
    // record.account_ledger_id = op.account_ledger_id;
  };
  const payment_method_change = (_, op, record, index) => {
    if (!op) {
      return;
    }

    formAPI.setValuesIn(
      `purchase_payment_plan_list.${index}.payment_method_id`,
      op.id,
    );
    formAPI.setValuesIn(
      `purchase_payment_plan_list.${index}.payment_method_mark`,
      op.mark,
    );
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

            formAPI.setValues(detail);
          } else {
            // 增加时，保留1条数据
            formAPI.setValues({ purchase_order_item_list: [{}] });
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
        merchantPaymentMethodOption,
      },
      effects() {
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
