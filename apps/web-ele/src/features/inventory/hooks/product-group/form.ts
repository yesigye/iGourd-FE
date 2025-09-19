import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

export function useGroupForm() {
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
              level: {
                type: 'string',
                title: "{{t('product-group.level')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
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
              previous_category: {
                type: 'string',
                title: "{{t('product-group.previous-category')}}",
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  maxLength: 32,
                  placeholder: "{{t('common.select')}}",
                  clearable: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message:
                      "{{t('product-group.please-select-previous-category')}}",
                  },
                ],
              },
              category_name: {
                type: 'string',
                title: "{{t('product-group.category-name')}}",
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
                    message:
                      "{{t('product-group.please-enter-category-name')}}",
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
