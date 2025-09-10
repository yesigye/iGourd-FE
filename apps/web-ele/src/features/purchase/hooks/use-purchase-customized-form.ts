import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface PurchaseCustomizedFormData {
  entity: string;
  name: string;
  is_compulsory: boolean;
  is_fixed_option: boolean | null;
  type: string;
  options: string;
  max_length: string;
  remark: string;
  merchant_id: string;
  selectionOptions: Array<{ name: string }>;
}

export function usePurchaseCustomizedForm() {
  const { t } = useI18n();

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('purchase.addCustomized')}}",
    class: 'w-1/2',
  });

  // 表单 Schema - 基于原有的自定义字段表单结构
  const formSchema: ISchema = {
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
            title: "{{t('purchase.featureName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('purchase.pleaseEnterFeatureName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseEnterFeatureName')}}",
              },
              { max: 64, message: "{{t('common.maxChars', { n: 64 })}}" },
            ],
          },

          type: {
            type: 'string',
            title: "{{t('purchase.featureType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{featureTypes}}',
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectFeatureType')}}",
              },
            ],
          },

          is_fixed_option: {
            type: 'boolean',
            title: "{{t('purchase.selectionType')}}",
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
            title: "{{t('purchase.selectionOptions')}}",
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
                colIndex: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: '#',
                    width: 60,
                    align: 'center',
                  },
                  properties: {
                    idxText: {
                      type: 'number',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-read-pretty': true,
                      'x-reactions': {
                        fulfill: {
                          'state.value':
                            "{{$index !== undefined ? $index + 1 : ''}}",
                        },
                      },
                    },
                  },
                },
                colName: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: "{{t('purchase.optionName')}}",
                  },
                  properties: {
                    name: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: "{{t('purchase.pleaseEnterOptionName')}}",
                        clearable: true,
                      },
                      'x-validator': [
                        {
                          required: true,
                          message: "{{t('purchase.pleaseEnterOptionName')}}",
                        },
                      ],
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
            title: "{{t('purchase.compulsorySelection')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: '{{compulsoryTypes}}',
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectIsCompulsory')}}",
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
  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    initialValues: {
      entity: 'VENDOR',
      name: '',
      is_compulsory: false,
      is_fixed_option: null,
      type: '',
      options: '',
      max_length: '',
      remark: '',
      merchant_id: '',
      selectionOptions: [{ name: '' }],
    },
    scope: {
      featureTypes: [
        { label: t('purchase.inputBox'), value: 'INPUT' },
        { label: t('purchase.selectBox'), value: 'SELECT' },
      ],

      // 选择类型（用户创建 / 固定值）
      // 注意：你原文件里 true=用户创建, false=固定值；保留相同语义
      selectTypes: [
        { label: t('purchase.userCreated'), value: true },
        { label: t('purchase.fixedValue'), value: false },
      ],

      // 是否必填
      compulsoryTypes: [
        { label: t('purchase.yes'), value: true },
        { label: t('purchase.no'), value: false },
      ],
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: PurchaseCustomizedFormData) => {
    try {
      // 处理选项数据
      const optionNames =
        values.selectionOptions
          ?.map((option) => option.name)
          .filter((name) => name.trim() !== '') || [];

      const formattedValues = {
        ...values,
        options: values.type === 'SELECT' ? JSON.stringify(optionNames) : '',
      };

      // 调用 API
      const response =
        await purchaseApi.createOrUpdateCustomizedField(formattedValues);
      return response;
    } catch (error) {
      console.error('Purchase customized form submission error:', error);
      throw error;
    }
  };

  // 表单重置
  const resetForm = () => {
    formAPI.reset();
    // 重置选项表格
    formAPI.setValues({
      selectionOptions: [{ name: '' }],
    });
  };

  // 表单验证
  const validateForm = async () => {
    return await formAPI.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<PurchaseCustomizedFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values;
  };

  // 添加选项
  const addOption = () => {
    const currentOptions = formAPI.getValues().selectionOptions || [];
    if (currentOptions.length >= 12) {
      throw new Error(t('purchase.personIsLazy', { value: 12 }));
    }

    const newOptions = [...currentOptions, { name: '' }];
    formAPI.setValues({ selectionOptions: newOptions });
  };

  // 删除选项
  const removeOption = (index: number) => {
    const currentOptions = formAPI.getValues().selectionOptions || [];
    if (currentOptions.length <= 1) {
      throw new Error(t('purchase.listMinWarning'));
    }

    const newOptions = currentOptions.filter((_, i) => i !== index);
    formAPI.setValues({ selectionOptions: newOptions });
  };

  // 更新选项
  const updateOption = (index: number, value: string) => {
    const currentOptions = formAPI.getValues().selectionOptions || [];
    const newOptions = [...currentOptions];
    newOptions[index] = { ...newOptions[index], name: value };
    formAPI.setValues({ selectionOptions: newOptions });
  };

  return {
    // 组件
    Form,
    formAPI,
    Drawer,
    drawerApi,
    // 配置
    formSchema,

    // 方法
    handleSubmit,
    resetForm,
    validateForm,
    setFormValues,
    getFormValues,
    addOption,
    removeOption,
    updateOption,
  };
}
