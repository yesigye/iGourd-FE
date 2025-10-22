import { useI18n } from '@igourd/locales';
import type { ISchema } from '@igourd/common-ui';
import { h, inject,ref} from 'vue';
import { Space } from '@igourd/common-ui';
import ModalTable from '@igourd/plugins/modal-table';
import { useUserStore } from '@igourd/stores';
import { wareHouseProductSearch } from '#/features/inventory';
import { useDrawerForm, useWarehouseSelect } from '#/hooks';
import { orderNoGenerate } from '#/api/common';
import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';
import { getAccountManagementOptionList } from '#/features/account';
import { merchantPaymentMethodOption } from '#/features/setting';
import { onFieldValueChange } from '@igourd/common-ui';
import {
  getPurchaseListApi,
  createPurchaseReturnedApi,
  updatePurchaseReturnedApi,
  getPurchaseReturnedDetailApi,
  getPurchaseReceiptPageListApi,
  getPurchaseReceiptDetailApi
} from '@@/purchase/apis';
import { basicsCurrencyList } from '#/api';
function remoteMethod(keywords: string) {
  return getPurchaseListApi({
    page_num: 1,
    page_size: 15,
    keywords,
  }).then((res) => {
    return res.list.map((item: any) => {
      return {
        ...item,
        label: item.name,
        value: item.id,
      };
    });
  });
}
// 货币数据
const currencyList = ref([]);
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
export function useReturnForm() {
  const { t } = useI18n();
  const { gridApi } = inject<{
    gridApi: ExtendedVxeGridApi;
  }>(Symbol.for('PageGrid'));
  const warehouse = useWarehouseSelect();
  const { currentLoginUserApp } = useUserStore();
  const vatConfigurationEnums = [
    { label: t('order.not-applicable'), value: 'NOT_APPLICATION' },
    { label: t('order.vat-inclusive'), value: 'VAT_INCLUSIVE' },
    { label: t('order.vat-exclusive'), value: 'VAT_EXCLUSIVE' },
  ];
  const returnReasonList = [
    { label: t('purchase.product-damage'), value: 'Product Damage' },
    { label: t('purchase.quality-issue'), value: 'Quality Issue' },
    {
      label: t('purchase.incorrect-product-sent'),
      value: 'Incorrect Product Sent',
    },
    { label: t('purchase.others'), value: 'Others' },
  ];

  const onBeforeOpen = () => {
    return formAPI.validate('customer_id');
  };
  const onSelectOrder = async(records: any) => {
    debugger
    if (!records) {
      return;
    }
    // 根据订单查询订单详情
    // const detail = await getPurchaseReceiptDetailApi({
    //               goods_receipt_note_id: data.id,
    //               purchase_order_id: data.purchase_order_id,
    //             });

    const row = records[0]

    formAPI.setValues({
      order_info: row,
      purchase_returned_item_list: [records]
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
     formAPI.setValuesIn(
      `purchase_payment_plan_list.${index}.currency_code`,
      op.currency_code,
    );
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
              class: 'border-0',
            },
            properties: {
              type: {
                type: 'string',
                'x-hidden': true,
                //采购退单类型(ORIGINAL_ORDER:原单,NO_ORIGINAL_ORDER:非原单)
              },
              row_0: {
                type: 'void', // 表示空字段
                title: "{{t('transfer.source-warehouse-name')}}", // formItem 的 label
                'x-component': 'div',
                'x-component-props': {
                  class: 'flex gap-4 mt-4',
                },
                properties: {
                  right_box: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      class: 'grid grid-cols-5 gap-4',
                      style: {
                        width: '100%',
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
                            'x-validator': [
                              {
                                required: false,
                                message: "{{t('order.input-deposit')}}",
                              },
                            ],
                            'x-component-props': {
                              style: 'width: 100px;',
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
                      returned_date: {
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
                      returned_reason: {
                        type: 'string',
                        title: "{{t('purchase.returned-reason')}}",
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
                        enum: returnReasonList,
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
                    return h(Space, null, {
                      default: () => [
                        h('div', null, t('returned.source-order-information')),
                        h(ModalTable, {
                          onBeforeOpen,
                          onConfirm: onSelectOrder,
                          text: t('returned.select-source-order'),
                          title: t('returned.source-order-information'),
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
                                field: 'receipt_date',
                                minWidth: 200,
                                title: t('returned.order-date'),
                              },
                              {
                                field: 'goods_receipt_note_no',
                                minWidth: 200,
                                title: t('returned.receipt-order-no'),
                              },
                              {
                                field: 'subtotal_amount',
                                minWidth: 200,
                                title: t('returned.total-amount'),
                              },

                              {
                                field: 'creator_name',
                                title: t('returned.creator'),
                                minWidth: 200,
                              },
                              {
                                field: 'create_time',
                                minWidth: 200,
                                title: t('returned.create-time'),
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
                  purchase_returned_item_list: {
                    type: 'array',
                    'x-component': 'ProductTable',
                    'x-component-props': {
                      mode: 'return',
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
                  class: 'w-full flex mt-10 mb-10',
                  style: {},
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
                            },
                          },
                          amount_2: {
                            type: 'string',
                            title: "{{t('purchase.order-pay.total')}}",
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-decorator-props': {
                              size: 'small',
                            },
                          },
                        },
                      },
                      purchase_payment_plan_list: {
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
                              properties: {

                                account_id: {
                                  type: 'string',
                                  title: "{{t('purchase.order-pay.select-account')}}",
                                  'x-decorator': 'FormItem',
                                  'x-component': 'FormilySearchSelect',
                                  'x-decorator-props': {
                                    size: 'small',
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
                                  "{{t('purchase.other-tax')+' : '}}",
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
      if (!formData.id) {
        const result = await orderNoGenerate({
          category_type: 'PURCHASE_ORDER_REFUND',
        });
        formData.purchase_returned_no = result.order_no;
      }
      // 合计金额
      const total = formData.purchase_returned_item_list.reduce(
        (acc: any, item: any) => acc + item.returned_quantity * item.cost_price,
        0,
      );
      formData.purchase_returned_item_list.forEach((item) => {
        item.product_name = item.label;

        item.other_tax_amount = 0;
        item.vat_amount = 0;
        item.subtotal_amount = item.returned_quantity * item.cost_price;
        item.total_amount = item.returned_quantity * item.cost_price;
        // 商品原价
        item.product_cost_price = item.cost_price;
      });
      formData.purchase_payment_plan_list.forEach((item) => {
        item.merchant_id = currentLoginUserApp.owner_id;
        item.business_type = "PURCHASE_ORDER_REFUND"
      })

      // 	汇率(选择币种和系统币种的换算比例)
      formData.exchange_rate = 0;
      formData.vat_amount = 0;
      // subtotal_amount  商品总金额
      formData.subtotal_amount = total.toFixed(2);
      // total_amount  最终总金额
      formData.total_amount = total.toFixed(2);
      response = formData.id
        ? updatePurchaseReturnedApi(formData)
        : await createPurchaseReturnedApi(formData);
      gridApi.reload();
      return response;
    } catch (error) {
      console.error('收货单 customized form submission error:', error);
      throw error;
    }
  };

  const { Drawer, drawerApi, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      class: 'w-full',
      appendToMain: true,
      title: t('returned.add-purchase-returned'),
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          // 编辑
          if (data.id) {
            const detail = await getPurchaseReturnedDetailApi({
              purchase_returned_id: data.id,
              purchase_order_id: data.purchase_order_id,
            });
            detail.purchase_returned_item_list =
              detail.purchase_returned_item_model_list;
               detail.purchase_payment_plan_list =
              detail.purchase_payment_plan_detail_model_list;

            formAPI.setValues(detail);
          } else {
            // 增加时，保留1条数据
            formAPI.setValues({ purchase_returned_item_list: [{}] });
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
        purchase_returned_item_list: [{}],
        // 采购退单类型(ORIGINAL_ORDER:原单,NO_ORIGINAL_ORDER:非原单)
        type: 'NO_ORIGINAL_ORDER',
        purchase_payment_plan_list: [{}],
      },
      scope: {
        warehouse,
        getAccountManagementOptionList,
        accountChange,
        payment_method_change,
        merchantPaymentMethodOption,
      },
      schema: schema,
      effects() {
        // // 账户
        // onFieldValueChange('account_id', (field, form) => {
        //   console.log(`target值变化：${field.value}`);


        //   // form.setValuesIn('vendor_name', currObj?.name);
        // });

        // // 支付方式
        // onFieldValueChange('payment_method_type', (field, form) => {
        //   console.log(`target值变化：${field.value}`);


        //   // form.setValuesIn('vendor_name', currObj?.name);
        // });
         //选中 货币
        onFieldValueChange('currency_code', (field, form) => {
          const currObj = currencyList.value.find(
            (item) => (item.id = field.value),
          );
          form.setValuesIn('exchange_rate', currObj?.exchange_rate);
        });


      },
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
