import { h } from 'vue';
import type { ISchema } from '@igourd/common-ui';

import { Space } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import ModalTable from '@igourd/plugins/modal-table';

import { wareHouseProductSearch } from '#/features/inventory';
import { getPurchaseListApi } from '@@/purchase/apis';
import { basicsCurrencyList } from '#/api';

import { useDrawerForm, useWarehouseSelect } from '#/hooks';
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
  return result
};
export function useOrderForm() {
  const { t } = useI18n();
  const warehouse = useWarehouseSelect();
  const vatConfigurationEnums = [
  { label: 'purchase.not_applicable', value: 'NOT_APPLICATION' },
  { label: 'purchase.VAT_inclusive', value: 'VAT_INCLUSIVE' },
  { label: 'purchase.VAT_exclusive', value: 'VAT_EXCLUSIVE' }
];

  // 配置菜单
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
                  warehouse_id: {
                    type: 'string',
                    title: '编号',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-decorator-props': {
                      feedbackLayout: 'terse',
                    },
                    'x-component-props': {},
                    'x-reactions': {
                      fulfill: {
                        state: {
                          dataSource: '{{ warehouse.value }}',
                        },
                      },
                    },
                  },
                  physical_stock_take_date: {
                    type: 'string',
                    title: '日期',
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
                        message: "{{t('product-group.please-select-level')}}",
                      },
                    ],
                  },
                  warehouse_id1: {
                    type: 'string',
                    title: 'VAT',
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-decorator-props': {
                      feedbackLayout: 'terse',
                    },
                    'x-component-props': {},
                    enum:vatConfigurationEnums,

                  },
                  warehouse_id2: {
                    type: 'string',
                    title: '仓库',
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-decorator-props': {
                      feedbackLayout: 'terse',
                    },
                    'x-component-props': {},
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
                    title: '定金', // formItem 的 label
                    'x-component': 'Space',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      asterisk: true, // label 上显示必填的 * 号
                      feedbackLayout: 'none',
                    },
                    properties: {
                      source_merchant_id: {
                        type: 'string',
                        title: '',
                        'x-decorator': 'FormItem',
                        'x-component': 'RemoteSelect',
                        'x-component-props': {
                          getCurrencyList,
                          style: { width: '100px', marginRight: '10px' },
                        },
                        'x-reactions': {
                          fulfill: {
                            state: {
                              dataSource: '',
                            },
                          },
                        }
                      },
                      source_warehouse_id: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-decorator-props': {
                          label: '',
                        },
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
            },
            'x-content': {
              header: () => {
                return h(Space, null, [
                  h('div', null, '商品明细'),
                  h(ModalTable, {
                    text: '快速选择',
                    title: '选择商品列表',
                  }),
                ]);
              },
            },
            properties: {
              purchase_order_item_model_list: {
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
                          label: [item.major_name, item.product_spec_kvmessage]
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
          remark: {
            type: 'string',
            title: "{{t('common.remarks')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              maxlength: 256,
              rows: 5,
              'show-word-limit': true,
            },
          },

          files: {
            type: 'array',
            title: '拖拽上传',
            'x-component': 'Upload',
            'x-decorator': 'FormItem',
            'x-component-props': {
              drag: true,
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
      title: '添加采购订单',
    },
    formOptions: {
      initialValues: {
        purchase_order_item_model_list: [{}],
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
