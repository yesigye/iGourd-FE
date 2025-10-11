import { useI18n } from '@igourd/locales';
import type { ISchema } from '@igourd/common-ui';
import { h } from 'vue';
import { Space } from '@igourd/common-ui';
import ModalTable from '@igourd/plugins/modal-table';
import { useUserStore } from '@igourd/stores';
import { wareHouseProductSearch } from '#/features/inventory';
import { useDrawerForm, useWarehouseSelect } from '#/hooks';
import { getPurchaseListApi } from '@@/purchase/apis';
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
export function useReceiptForm() {
  const { t } = useI18n();
  const warehouse = useWarehouseSelect();
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
                    },
                  },
                  right_box: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      class: 'grid grid-cols-3 gap-4',
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
                  goods_receipt_note_item_model_list: {
                    type: 'array',
                    'x-component': 'ProductTable',
                    'x-component-props': {
                      mode: 'receipt',
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

  const { Drawer, drawerApi, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      class: 'w-full',
      appendToMain: true,
      title: 'Hello',
    },
    formOptions: {
      initialValues: {
        goods_receipt_note_item_model_list: [{}],
      },
      scope: {
        warehouse,
      },
      schema: schema,
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
