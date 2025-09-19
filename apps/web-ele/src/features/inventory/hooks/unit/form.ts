import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

export function useUnitForm() {
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
                title: "{{t('unit.unit-name')}}",
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
                    message: "{{t('unit.please-enter-name')}}",
                  },
                ],
              },
            },
          },
        },
      },
    },
  };
  return useDrawerForm({
    drawerOptions: {
      title: t('product-group.add-product-group'),
      appendToMain: true,
      class: 'w-1/2',
    },
    formOptions: {
      schema,
      scope: {},
    },
  });
}
