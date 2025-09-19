import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

export function useWarehouseForm() {
  const { t } = useI18n();

  const schema: ISchema = {
    type: 'object',
    properties: {
      form: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
        },
        properties: {
          common: {
            type: 'void',
            'x-component': 'FormLayout',
            'x-component-props': {
              header: 'Hello Card',
            },
            properties: {
              name: {
                type: 'string',
                title: "{{t('warehouse.warehouse-name')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 32,
                  placeholder: "{{t('common.enter')}}",
                  clearable: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('warehouse.please-warehouse-name')}}",
                  },
                ],
              },
              country_id: {
                type: 'string',
                title: "{{t('warehouse.country')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  maxLength: 32,
                  placeholder: "{{t('common.select')}}",
                  clearable: true,
                },
              },
              address: {
                type: 'string',
                title: "{{t('warehouse.address')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  maxLength: 32,
                  placeholder: "{{t('common.enter')}}",
                  clearable: true,
                },
              },
              contact_name: {
                type: 'string',
                title: "{{t('warehouse.contact-name')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 32,
                  placeholder: "{{t('common.enter')}}",
                  clearable: true,
                },
              },
              contact_telephone: {
                type: 'string',
                title: "{{t('warehouse.contact-telephone')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 32,
                  placeholder: "{{t('common.enter')}}",
                  clearable: true,
                },
              },
              email: {
                type: 'string',
                title: "{{t('warehouse.email')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 32,
                  placeholder: "{{t('common.enter')}}",
                  clearable: true,
                },
              },
              remark: {
                type: 'string',
                title: "{{t('warehouse.remarks')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 32,
                  placeholder: "{{t('common.enter')}}",
                  clearable: true,
                },
              },
            },
          },
        },
      },
    },
  };
  return useDrawerForm({
    drawerOptions: {
      title: t('warehouse.add-warehouse'),
      appendToMain: true,
      class: 'w-1/2',
    },
    formOptions: {
      schema,
      scope: {},
    },
  });
}
