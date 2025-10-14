import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

export function useSkuListForm() {
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
          major_name: {
            type: 'string',
            title: "{{t('sku-list.major_name')}}",
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
                message: "{{t('product-group.please-select-level')}}",
              },
            ],
          },
          profile_photo: {
            type: 'string',
            title: "{{t('sku-list.profile_photo')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Upload',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.select')}}",
              clearable: true,
            },
          },
          product_unit_name: {
            type: 'string',
            title: "{{t('sku-list.product_unit_name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-disabled': true,
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('product-group.please-select-level')}}",
              },
            ],
          },
          spec_code: {
            type: 'string',
            title: "{{t('sku-list.spec_code')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-disabled': true,
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
          },
          sku_barcode: {
            type: 'string',
            title: "{{t('sku-list.sku_barcode')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
          },
          cost_price: {
            type: 'string',
            title: "{{t('sku-list.cost_price')}}",
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
                message: "{{t('product-group.please-select-level')}}",
              },
            ],
          },
          selling_price: {
            type: 'string',
            title: "{{t('sku-list.selling_price')}}",
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
                message: "{{t('product-group.please-select-level')}}",
              },
            ],
          },
          status: {
            type: 'string',
            title: "{{t('sku-list.status')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
          },
          remark: {
            type: 'string',
            title: "{{t('common.remarks')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
          },
        },
      },
    },
  };
   const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('sku-list.edit-sku-title'),
      appendToMain: true,
      class: 'w-1/2',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          formAPI.setFormState({ readPretty: data?.mode === 'detail' });
          formAPI.setValues(data);
        } else {
          formAPI.values = {};
        }
      },
    },
    formOptions: {
      schema,
      scope: {},
    },
  });

  return { Drawer, Form, drawerApi, formAPI }
}
