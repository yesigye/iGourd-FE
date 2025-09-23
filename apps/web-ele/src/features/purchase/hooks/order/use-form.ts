import { useI18n } from '@igourd/locales';

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
          purchase_order_item_model_list: {
            type: 'void',
            'x-component': 'ProductTable',
            'x-component-props': {
              warehouse: '{{warehouse.value}}',
            },
            'x-reactions': {
              dependencies: ['warehouse_id'],
              fulfill: {
                schema: {
                  'x-component-props': {
                    warehouse_id: '{{$deps[0]}}',
                  },
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
