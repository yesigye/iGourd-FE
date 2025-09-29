import { h } from 'vue';

import { Space } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import ModalTable from '@igourd/plugins/modal-table';

import { wareHouseProductSearch } from '#/features/inventory';
import { useDrawerForm, useWarehouseSelect } from '#/hooks';

export function useOrderForm() {
  const { t } = useI18n();
  const warehouse = useWarehouseSelect();

  const { Drawer, drawerApi, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      class: 'w-full',
      appendToMain: true,
      title: 'Hello',
    },
    formOptions: {
      initialValues: {
        purchase_order_item_model_list: [{}],
      },
      scope: {
        warehouse,
      },
      schema: {
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
              warehouse_id: {
                type: 'string',
                title: '仓库',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-reactions': {
                  fulfill: {
                    state: {
                      dataSource: '{{ warehouse.value }}',
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
