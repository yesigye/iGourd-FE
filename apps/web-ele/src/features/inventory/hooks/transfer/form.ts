import type { ISchema } from '@igourd/common-ui';

import { onFieldValueChange } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { wareHouseProductSearch } from '@@/inventory/apis';

import { useWarehouseSelect } from '#/hooks';
import { useDrawerForm } from '#/hooks/use-drawer-form';

import { useMerchantSelect } from './use-merchant-select';

export function useTransferForm() {
  const { t } = useI18n();
  const warehouse = useWarehouseSelect();
  const userName = useUserStore().userInfo?.user_model.name;
  const userLabel = `${t('count.creator')}:`;
  // 调拨类型
  const transferTypeList = [
    {
      label: t('inventory.sameStoreTransfer'),
      value: 'TRANSFER_SAME_STORE',
    },
    {
      label: t('inventory.differentStoreTransfer'),
      value: 'TRANSFER_DIFFERENT_STORE',
    },
    {
      label: t('inventory.transferOut'),
      value: 'TRANSFER_IN_ONLY',
    },
    {
      label: t('inventory.transferIn'),
      value: 'TRANSFER_OUT_ONLY',
    },
  ];
  const { currentLoginUserApp } = useUserStore();
  const merchantList = useMerchantSelect({ id: currentLoginUserApp.owner_id });
  const schema: ISchema = {
    type: 'object',
    properties: {
      form: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          layout: 'vertical',
        },
        properties: {
          label: {
            type: 'void',
            'x-component': 'Space',
            'x-component-props': {
              style: { marginBottom: '10px' },
            },
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
                  style: { color: 'red' },
                },
              },
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
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              class: 'w-full flex',
              style: {},
            },
            properties: {
              source_warehouse_id: {
                type: 'string',
                title: '源仓库',
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
                  style: 'width: 300px;',
                },
              },
              select_1: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-decorator-props': {
                  label: ' ',
                },
                'x-component-props': {
                  style: 'width: 240px;',
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
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              class: 'w-full flex',
              style: {},
            },
            properties: {
              destination_merchant_id: {
                type: 'string',
                title: '目标仓库',
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
                  style: 'width: 300px;',
                },
              },
              select_1: {
                type: 'string',
                title: ' ',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  style: 'width: 240px;',
                },
              },
            },
          },

          stock_transfer_item_model_list: {
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
                      label: [item.major_name, item.product_spec_kvmessage]
                        .filter(Boolean)
                        .join('-'),
                    };
                  });
                });
              },
            },
          },
          row_2: {
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
                              "{{t('transfer.total-transfer-quantity')}}",
                            'x-component-props': {
                              style: { fontSize: '14px' },
                            },
                          },
                          d: {
                            type: 'void',
                            'x-component': 'div',
                            'x-content': '',
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
                              "{{t('transfer.total-transfer-product-price')}}",
                            'x-component-props': {
                              style: { fontSize: '14px' },
                            },
                          },
                          d: {
                            type: 'void',
                            'x-component': 'div',
                            'x-content': '0',
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
          attachment_url: {
            type: 'string',
            title: "{{t('common.Attachment')}}",
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
  };
  return useDrawerForm({
    drawerOptions: {
      title: t('transfer.add-transfer'),
      appendToMain: true,
      class: 'w-2/3',
    },
    formOptions: {
      initialValues: {
        stock_transfer_item_model_list: [{}],
      },
      schema,
      scope: {
        warehouse,
        userName,
        userLabel,
        merchantList,
      },
      effects() {
        onFieldValueChange('transfer_type', (field, form: Form) => {
          console.log(`target值变化：${field.value}`);
          form.setFieldState('source_warehouse_id', (f) => {
            f.disabled = true;
          });
          const destinationSource = form.query('destination_merchant_id');
        });
        onFieldValueChange('physical_stock_take_item_list.*', (field) => {
          console.log(`physical_stock_take_item_models值变化：${field.value}`);
        });
      },
    },
  });
}
