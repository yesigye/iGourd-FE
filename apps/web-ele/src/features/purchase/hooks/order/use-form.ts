import { h } from 'vue';
import type { ISchema } from '@igourd/common-ui';
import { useUserStore } from '@igourd/stores';

import { Space } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import ModalTable from '@igourd/plugins/modal-table';

import { orderNoGenerate } from '#/api/common';
import { wareHouseProductSearch } from '#/features/inventory';
import {
  getPurchaseListApi,
  createPurchaseOrderApi,
  updatePurchaseOrderApi,
  getPurchaseOrderDetailApi,
} from '@@/purchase/apis';
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
  const warehouse = useWarehouseSelect();
  const { currentLoginUserApp } = useUserStore();
  const vatConfigurationEnums = [
    { label: t('order.not-applicable'), value: 'NOT_APPLICATION' },
    { label: t('order.VAT_inclusive'), value: 'VAT_INCLUSIVE' },
    { label: t('order.VAT_exclusive'), value: 'VAT_EXCLUSIVE' },
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
          card_0: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              //header: '{{t("discount.form.basicInfo")}}',
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
      //合计金额
      let total = formData.purchase_order_item_list.reduce(
        (acc: any, item: any) => acc + item.quantity * item.cost_price,
        0,
      );
      formData.purchase_order_item_list.forEach((item) => {
        item.product_name = item.label;
        item.product_id = item.id;
        item.other_tax_amount = 0;
        item.vat_amount = 0;
        item.subtotal_amount = item.quantity * item.cost_price;
        item.total_amount = item.quantity * item.cost_price;
      });
      // 	汇率(选择币种和系统币种的换算比例)
      formData.exchange_rate = 0;
      formData.vat_amount = 0;
      // subtotal_amount  商品总金额
      formData.subtotal_amount = total.toFixed(2);
      // total_amount  最终总金额
      formData.total_amount = total.toFixed(2);
      if (formData.id) {
        response = updatePurchaseOrderApi(formData);
      } else {
        response = await createPurchaseOrderApi(formData);
      }
      return response;
    } catch (error) {
      console.error('采购单 customized form submission error:', error);
      throw error;
    }
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
              purchase_order_id:data.id,
            });
            detail.purchase_order_item_list =
              detail.purchase_order_item_model_list;
            formAPI.setValues(detail);
          } else {
            //增加时，保留1条数据
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
