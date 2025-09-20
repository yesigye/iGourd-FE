import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

export function useCountForm() {
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
          label: {
            type: 'string',
            title: "{{t('creator')}}",
            'x-decorator': 'FormItem',
            default: '',
          },
          warehouse: {
            type: 'string',
            title: "{{t('warehouse-name')}}",
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
          reason: {
            type: 'string',
            title: 'Reason',
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
        },
      },
    },
  };
  return useDrawerForm({
    drawerOptions: {
      title: t('count.addInventoryCountSave'),
      appendToMain: true,
      class: 'w-1/2',
    },
    formOptions: {
      schema,
      scope: {},
    },
  });
}
