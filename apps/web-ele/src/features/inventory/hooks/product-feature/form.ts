import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

export function useFeatureForm() {
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
            title: "{{t('product-feature.feature')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('product-feature.please-enter-feature-name')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('product-feature.please-enter-feature-name')}}",
              },
              { max: 64, message: "{{t('common.maxChars', { n: 64 })}}" },
            ],
          },

          type: {
            type: 'string',
            title: "{{t('product-feature.feature-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{featureTypes}}',
            'x-validator': [
              {
                required: true,
                message: "{{t('product-feature.please-select-feature-type')}}",
              },
            ],
          },

          is_fixed_option: {
            type: 'boolean',
            title: "{{t('product-feature.selection-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{selectTypes}}',
            'x-visible': "{{$values.type === 'SELECT'}}",
            'x-validator': [
              {
                required: true,
                message:
                  "{{t('product-feature.please-select-is-fixed-value')}}",
              },
            ],
          },

          selectionOptions: {
            type: 'array',
            title: "{{t('product-feature.selection-options')}}",
            'x-decorator': 'FormItem',
            'x-visible': "{{$values.type === 'SELECT'}}",
            'x-component': 'ArrayTable',
            'x-component-props': {
              border: true,
              stripe: true,
              size: 'small',
            },
            items: {
              type: 'object',
              properties: {
                column1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    width: 80,
                    title: '#',
                    align: 'center',
                  },
                  properties: {
                    index: {
                      type: 'void',
                      'x-component': 'ArrayTable.Index',
                    },
                  },
                },
                colName: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: "{{t('product-feature.option-name')}}",
                  },
                  properties: {
                    name: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder:
                          "{{t('product-feature.please-enter-option-name')}}",
                        clearable: true,
                      },
                    },
                  },
                },
                colOps: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: "{{t('common.operations')}}",
                    width: 180,
                    fixed: 'right',
                  },
                  properties: {
                    ops: {
                      type: 'void',
                      'x-component': 'FormItem',
                      properties: {
                        remove: {
                          type: 'void',
                          'x-component': 'ArrayTable.Remove',
                        },
                      },
                    },
                  },
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                'x-component': 'ArrayTable.Addition',
                title: "{{t('common.addOption')}}",
              },
            },
          },

          is_compulsory: {
            type: 'boolean',
            title: "{{t('product-feature.compulsory-selection')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{compulsoryTypes}}',
            'x-validator': [
              {
                required: true,
                message: "{{t('product-feature.please-select-is-compulsory')}}",
              },
            ],
          },

          entity: {
            type: 'string',
            default: 'VENDOR',
            'x-hidden': true,
          },
          options: {
            type: 'string',
            'x-hidden': true,
            'x-reactions': [
              {
                dependencies: ['selectionOptions'],
                fulfill: {
                  'state.value':
                    "{{$deps[0] ? JSON.stringify(($deps[0] || []).map(x=>({name: x?.name})).filter(x=>x.name && x.name.trim())) : ''}}",
                },
              },
            ],
          },
        },
      },
    },
  };
  const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('product-feature.addCustomized'),
      appendToMain: true,
      class: 'w-full',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          if (!data.selectionOptions) {
            data.selectionOptions = [];
          }
          formAPI.setFormState({ readPretty: data?.mode === 'detail' });
          formAPI.setValues(data);
        } else {
          formAPI.values = {
            selectionOptions: [],
          };
        }
      },
    },
    formOptions: {
      schema,
      initialValues: {
        selectionOptions: [],
      },
      scope: {
        featureTypes: [
          { label: t('product-feature.input-box'), value: 'INPUT' },
          { label: t('product-feature.select-box'), value: 'SELECT' },
        ],

        // 选择类型（用户创建 / 固定值）
        // 注意：你原文件里 true=用户创建, false=固定值；保留相同语义
        selectTypes: [
          { label: t('product-feature.user-created'), value: true },
          { label: t('product-feature.fixed-value'), value: false },
        ],
        // 是否必填
        compulsoryTypes: [
          { label: t('product-feature.yes'), value: true },
          { label: t('product-feature.no'), value: false },
        ],
      },
    },
  });
  return { Drawer, Form, drawerApi, formAPI };
}
