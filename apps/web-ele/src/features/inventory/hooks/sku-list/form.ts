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
          common: {
            type: 'void',
            'x-component': 'FormLayout',
            'x-component-props': {
              header: 'Hello Card',
            },
            properties: {
              major_name: {
                type: 'string',
                title: '名称(主)',
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
                title: '图片',
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
                title: '单位',
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
                title: '规格编码',
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
                title: '规格条码',
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
                title: '成本价',
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
                title: '售价',
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
                title: '状态',
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
                title: '备注',
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
