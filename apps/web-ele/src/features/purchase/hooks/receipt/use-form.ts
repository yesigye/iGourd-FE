import { useI18n } from '@igourd/locales';

import { wareHouseProductSearch } from '#/features/inventory';
import { useDrawerForm, useWarehouseSelect } from '#/hooks';

export function useReceiptForm() {
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
        purchase_order_item_model_list: [],
      },
      scope: {
        warehouse,
      },
      schema: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 10,
          layout: 'vertical',
        },
        properties: {
          purchase_order_no: {
            type: 'string',
            'x-component': 'Input',
          },
          warehouse_id: {
            type: 'string',
            'x-component': 'Select',
            'x-reactions': {
              fulfill: {
                state: {
                  dataSource: '{{ warehouse.value }}',
                },
              },
            },
          },
          goods_receipt_note_item_model_list: {
            type: 'void',
            title: '商品明细',
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
