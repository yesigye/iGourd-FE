import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

export function usePaymentOrderForm() {
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
            title: "{{t('purchase.feature-name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('purchase.please-enter-feature-name')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.please-enter-feature-name')}}",
              },
              { max: 64, message: "{{t('common.maxChars', { n: 64 })}}" },
            ],
          },

          type: {
            type: 'string',
            title: "{{t('purchase.feature-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{featureTypes}}',
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.please-select-feature-type')}}",
              },
            ],
          },

          is_fixed_option: {
            type: 'boolean',
            title: "{{t('purchase.selection-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{selectTypes}}',
            'x-visible': "{{$values.type === 'SELECT'}}",
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectIsFixedValue')}}",
              },
            ],
          },

          selectionOptions: {
            type: 'array',
            title: "{{t('purchase.selection-options')}}",
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
                    title: "{{t('purchase.option-name')}}",
                  },
                  properties: {
                    name: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: "{{t('purchase.please-enter-option-name')}}",
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
                title: "{{t('common.add-option')}}",
              },
            },
          },

          is_compulsory: {
            type: 'boolean',
            title: "{{t('purchase.compulsory-selection')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{compulsoryTypes}}',
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.please-select-is-compulsory')}}",
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
  return useDrawerForm({
    drawerOptions: {
      title: t('customized.add-customized'),
      appendToMain: true,
      class: 'w-full',
    },
    formOptions: {
      schema,
      scope: {
        featureTypes: [
          { label: t('purchase.input-box'), value: 'INPUT' },
          { label: t('purchase.select-box'), value: 'SELECT' },
        ],

        // 选择类型（用户创建 / 固定值）
        // 注意：你原文件里 true=用户创建, false=固定值；保留相同语义
        selectTypes: [
          { label: t('purchase.user-created'), value: true },
          { label: t('purchase.fixed-value'), value: false },
        ],

        // 是否必填
        compulsoryTypes: [
          { label: t('purchase.yes'), value: true },
          { label: t('purchase.no'), value: false },
        ],
      },
    },
  });
}
