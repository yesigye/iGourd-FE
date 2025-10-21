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
  };
  const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('unit.add-unit'),
      appendToMain: true,
      class: 'w-1/2',
    },
    formOptions: {
      schema,
      scope: {},
    },
  });
  drawerApi.onOpened = () => {
    if (Reflect.has(drawerApi.getData() ?? {}, 'id')) {
      drawerApi.setState({
        title: t('unit.edit-unit'),
      });
    }else{
      drawerApi.setState({
        title: t('unit.add-unit'),
      });
    }
  };
  return { Drawer, Form, drawerApi, formAPI };
}
