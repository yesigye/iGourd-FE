import type { ISchema } from '@igourd/common-ui';
import {computed} from 'vue';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';
import { useEnum } from '#/hooks';



export function useAddCustomizedForm() {
  const { t } = useI18n();
  const {featureTypes,selectTypes,compulsoryTypes} = useEnum();
  const title = computed(()=>{
     const data = drawerApi.getData();
     if(data?.mode === 'detail'){
       return t('add-customized.view-customized');
     }else {
      return  data.id?t('add-customized.edit-customized'):t('add-customized.add-customized')
     }
  });

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
          id: {
            type: 'string',
            'x-hidden': true,
          },
          name: {
            type: 'string',
            title: "{{t('add-customized.feature-name')}}",
            // required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('add-customized.enter-feature-name')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: t('add-customized.enter-feature-name'),
              },
              { maxLength: 128 },
            ],
          },

          type: {
            type: 'string',
            title: "{{t('add-customized.feature-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{featureTypes}}',
            'x-validator': [
              {
                required: true,
                message: "{{t('add-customized.select-feature-type')}}",
              },
            ],
            'x-reactions': [
              {
                dependencies: ['id'],
                fulfill: {
                  state: {
                    componentProps: {
                      disabled: '{{ $deps[0]}}',
                    },
                  },
                },
              },
            ],
          },

          is_fixed_option: {
            type: 'boolean',
            title: "{{t('add-customized.selection-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{selectTypes}}',
            'x-visible': "{{$values.type === 'SELECT'}}",
            'x-validator': [
              {
                required: true,
                message: "{{t('add-customized.select-is-fixed-value')}}",
              },
            ],
          },

          selectionOptions: {
            type: 'array',
            title: "{{t('add-customized.selection-options')}}",
            'x-decorator': 'FormItem',
            'x-visible': "{{$values.type === 'SELECT'}}",
            'x-component': 'ArrayTable',
            'x-component-props': {
              border: false,
              stripe: true,
              size: 'small',
              pagination: { pageSize: 5 },
              headerCellClassName:"abc",
              className:"array-table-customized",
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
                    title: "{{t('add-customized.option-name')}}",
                  },
                  properties: {
                    name: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder:
                          "{{t('add-customized.enter-option-name')}}",
                        clearable: true,
                      },
                    },
                  },
                },
                col_actions: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: "{{t('common.operation')}}",
                    width: 100,
                    fixed: 'right',
                    style: {
                      'margin-bottom': '8px',
                    },
                  },
                  properties: {
                    addition: {
                      type: 'void',
                      title: "{{t('common.add-btn')}}",
                      'x-component': 'ArrayTable.Addition',
                    },
                    remove: {
                      type: 'void',
                      'x-component': 'ArrayTable.Remove',
                      title: "{{ t('common.delete') }}",
                      'x-component-props': {
                        class:"text-red-500",
                      },
                      'x-reactions': {
                        dependencies: ['selectionOptions'],
                        fulfill: {
                          state: {
                            componentProps: {
                              disabled: '{{  $deps[0]?.length === 1 }}',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },

          is_compulsory: {
            type: 'boolean',
            title: "{{t('add-customized.compulsory-selection')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{compulsoryTypes}}',
            'x-validator': [
              {
                required: true,
                message: "{{t('add-customized.select-is-compulsory')}}",
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
  const { Drawer, drawerApi, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      title: title,
      appendToMain: true,
      class: 'w-2/3',
      contentClass: 'bg-muted',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          const values = {
            ...data
          };

          //处理选项
          const selectionOptions = [];
          if (data.type.value === 'SELECT' && data.options) {
            const options = JSON.parse(data.options);
            options.forEach((item) => {
              selectionOptions.push({
                name: item,
              });
            });
            values.selectionOptions = selectionOptions;
          }
          formAPI.setValues(values);
          formAPI.setFormState({ readPretty: data?.mode === 'detail' });

        }
      },
    },
    formOptions: {
      initialValues: {
        selectionOptions: [{}],
      },
      schema,
      scope: {
        featureTypes,
        selectTypes,
        compulsoryTypes
      },
    },
  });
  return { Drawer, drawerApi, Form, formAPI };
}
