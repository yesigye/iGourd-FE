<script lang="tsx" setup>
import { ref } from 'vue';
import { useTransferForm } from '@@/inventory/hooks/transfer/form';
import type { ISchema } from '@igourd/common-ui';
import { useEnum } from '#/hooks';
const { Drawer, Form, drawerApi } = useTransferForm();
import { useI18n } from '@igourd/locales';
const { t } = useI18n();
const { transferTypeList } = useEnum();
const schemaObj = ref();

let mode = 'transfer';
const isLoad = ref(false);

const createSchema = (mode: string) => {
  const schema: ISchema = {
    type: 'object',
    properties: {
      form: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
          'hide-required-asterisk': true,
        },
        properties: {
          card0: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              labelCol: 6,
              wrapperCol: 14,
              header: '',
              bodyClass: 'py-0 px-1 my-2 border-0',
            },
            properties: {
              label: {
                type: 'void',
                'x-component': 'Space',
                'x-component-props': {},
                properties: {
                  c: {
                    type: 'void',
                    'x-component': 'div',
                    'x-content': '{{userLabel}}',
                    'x-component-props': {
                      style: { fontSize: '14px' },
                    },
                  },
                  d: {
                    type: 'void',
                    'x-component': 'div',
                    'x-content': '{{userName}}',
                    'x-component-props': {
                      class: 'text-red-600',
                    },
                  },
                },
              },
            },
          },
          card1: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              header: '',
              bodyClass: 'py-0 px-1 my-1 border-0',
            },
            properties: {
              grid: {
                type: 'void',
                'x-component': 'FormGrid',
                'x-component-props': {
                  minColumns: [4],
                },
                properties: {
                  stock_transfer_no: {
                    type: 'string',
                    title: "{{t('count.physical-stock-take-no')}}",
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('count.physical-stock-take-no')}}",
                      clearable: true,
                      disabled: true,
                    },
                    'x-decorator-props': {
                      feedbackLayout: 'terse',
                    },
                  },
                  transfer_type: {
                    type: 'string',
                    title: "{{t('transfer.transfer-type')}}",
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      maxLength: 256,
                      placeholder: "{{t('common.select')}}",
                      clearable: true,
                    },
                    enum: transferTypeList,
                  },
                  row_0: {
                    type: 'void', // 表示空字段
                    title: "{{t('transfer.source-warehouse-name')}}", // formItem 的 label
                    'x-component': 'Space',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      asterisk: true, // label 上显示必填的 * 号
                      feedbackLayout: 'none',
                    },
                    'x-component-props': {
                      class: 'w-full transfer-source-warehouse',
                    },
                    properties: {
                      source_merchant_id: {
                        type: 'string',
                        title: '',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-reactions': {
                          fulfill: {
                            state: {
                              dataSource: '{{ merchantList.value }}',
                            },
                          },
                        },
                        'x-decorator-props': {
                          // class:"w-1/2"
                        },
                        'x-component-props': {
                          style: { marginRight: '10px' },
                          colon: false,
                        },
                      },
                      source_warehouse_id: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-decorator-props': {
                          label: '',
                        },
                        'x-component-props': {
                          colon: false,
                        },
                        'x-reactions': {
                          fulfill: {
                            state: {
                              dataSource: '{{ warehouse.value }}',
                            },
                          },
                        },
                      },
                    },
                  },
                  row_1: {
                    type: 'void', // 表示空字段
                    title: "{{t('transfer.destination-warehouse-name')}}", // formItem 的 label
                    'x-component': 'Space',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      asterisk: true, // label 上显示必填的 * 号
                      feedbackLayout: 'none',
                    },
                    'x-component-props': {
                      class: 'w-full transfer-source-warehouse',
                    },
                    properties: {
                      destination_merchant_id: {
                        type: 'string',
                        title: '',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-reactions': {
                          fulfill: {
                            state: {
                              dataSource: '{{ merchantList.value }}',
                            },
                          },
                        },
                        'x-component-props': {
                          style: { marginRight: '10px' },
                        },
                      },
                      destination_warehouse_id: {
                        type: 'string',
                        title: '',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                          colon: false,
                        },
                        'x-reactions': {
                          fulfill: {
                            state: {
                              dataSource: '{{ warehouse.value }}',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              // 商品card
              product_card: {
                type: 'void',
                'x-component': 'Card',
                'x-component-props': {
                  header: t('common.product'),
                },
                properties: {
                  stock_transfer_item_list: {
                    type: 'array',
                    'x-component': 'ProductTable',
                    'x-component-props': {
                      mode: mode,
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
                          warehouse_id: '',
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
              remark_card: {
                type: 'void',
                'x-component': 'Card',
                'x-component-props': {
                  header: t('common.remarks'),
                },
                properties: {
                  row_2: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-component-props': {
                      // class: 'w-full flex',
                      style: {},
                      minColumns: [3],
                    },
                    properties: {
                      form1: {
                        type: 'void',
                        'x-decorator': 'FormGrid.GridColumn',
                        'x-component': 'FormLayout',
                        'x-decorator-props': {
                          gridSpan: 2,
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
                      row_col_1: {
                        type: 'void',
                        'x-component': 'div',
                        'x-component-props': {
                          class: 'flex items-center justify-center rounded-lg',
                          style: {
                            background: '#edf5ff',
                            'margin-bottom': '8px',
                          },
                        },
                        properties: {
                          center: {
                            type: 'void',
                            'x-component': 'div',
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
                                    'x-content':
                                      "{{t('transfer.total-transfer-quantity')}} ",
                                    'x-component-props': {
                                      style: { fontSize: '14px' },
                                    },
                                  },
                                  total_transfer_quantity: {
                                    type: 'string',
                                    'x-component': 'div',
                                    'x-content':
                                      "{{$self.value?$self.value:'0'}}",
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
                                    'x-content':
                                      "{{t('transfer.total-transfer-product-price')}} ",
                                    'x-component-props': {
                                      style: { fontSize: '14px' },
                                    },
                                  },
                                  total_amount: {
                                    type: 'string',
                                    'x-component': 'div',
                                    'x-content':
                                      "{{$self.value?$self.value:'0'}}",
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
                },
              },
              attachment_card: {
                type: 'void',
                'x-component': 'Card',
                'x-component-props': {
                  header: t('common.attachment'),
                },
                properties: {
                  attachment_url: {
                    type: 'string',
                    title: '',
                    'x-decorator': 'FormItem',
                    'x-component': 'Upload',
                    'x-component-props': {
                      action: 'https://formily-vue.free.beeceptor.com/file',
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
  return schema;
};

const handle = () => {
  debugger;
  const data = drawerApi.getData();
  if (data.value === 'INBOUND') {
    mode = 'transfer-in';
  }
  schemaObj.value = createSchema(mode);
  isLoad.value = true;
};
</script>
<template>
  <Drawer :onOpenChange="handle">
    <!-- <Form v-if="isLoad" :schema="schemaObj" /> -->
    <Form />
  </Drawer>
</template>
