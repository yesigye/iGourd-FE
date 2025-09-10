import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { customerApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface CustomerCustomizedFormData {
  entity: string;
  name: string;
  is_compulsory: boolean;
  is_fixed_option: boolean | null;
  type: string;
  options: string;
  max_length: number;
  remark: string;
  merchant_id: string;
  selectionOptions: Array<{ name: string }>;
}

export function useCustomerCustomizedForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的客户自定义字段表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基础信息部分
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customer.basicInformation')}}",
          defaultOpen: true,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('customers.featureName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterCustomerFeatureName')}}",
              maxlength: 32,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseEnterCustomerFeatureName')}}",
              },
            ],
          },
          type: {
            type: 'string',
            title: "{{t('purchase.featureType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                { label: "{{t('inventory.input')}}", value: 'INPUT' },
                { label: "{{t('inventory.select')}}", value: 'SELECT' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseSelectFeatureType')}}",
              },
            ],
          },
        },
      },

      // 选择类型配置（当 type 为 SELECT 时显示）
      selectTypeConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.selectionTypeConfig')}}",
          defaultOpen: true,
        },
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              visible: '{{$deps[0] === "SELECT"}}',
            },
          },
        },
        properties: {
          is_fixed_option: {
            type: 'boolean',
            title: "{{t('purchase.selectionType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                { label: "{{t('purchase.userCreated')}}", value: true },
                { label: "{{t('purchase.fixed')}}", value: false },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseSelectIsFixedValue')}}",
              },
            ],
          },
          selectionOptions: {
            type: 'array',
            title: "{{t('purchase.selectionOptions')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: { pageSize: 5 },
            },
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: "{{t('purchase.optionName')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: "{{t('purchase.pleaseEnterOptionName')}}",
                    maxlength: 10,
                    clearable: true,
                  },
                },
              },
            },
          },
        },
      },

      // 必填配置
      compulsoryConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.compulsoryConfig')}}",
          defaultOpen: true,
        },
        properties: {
          is_compulsory: {
            type: 'boolean',
            title: "{{t('purchase.compulsorySelection')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                { label: "{{t('customers.yes')}}", value: true },
                { label: "{{t('customers.no')}}", value: false },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseSelectIsCompulsory')}}",
              },
            ],
          },
        },
      },

      // 其他配置
      otherConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customer.otherConfig')}}",
          defaultOpen: false,
        },
        properties: {
          max_length: {
            type: 'number',
            title: "{{t('customer.maxLength')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('customer.pleaseEnterMaxLength')}}",
              min: 1,
              max: 1000,
            },
          },
          remark: {
            type: 'string',
            title: "{{t('customer.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('customer.pleaseEnterRemark')}}",
              maxlength: 500,
              showWordLimit: true,
              rows: 3,
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      entity: 'CUSTOMER',
      name: '',
      is_compulsory: false,
      is_fixed_option: null,
      type: 'INPUT',
      options: '',
      max_length: 20,
      remark: '',
      merchant_id: '',
      selectionOptions: [{ name: '' }],
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: CustomerCustomizedFormData) => {
    try {
      // 处理选项数据
      const optionNames = values.selectionOptions
        ?.map(option => option.name)
        .filter(name => name.trim() !== '') || [];

      const formattedValues = {
        ...values,
        options: values.type === 'SELECT' ? JSON.stringify(optionNames) : '',
      };

      // 调用 API
      const response = await customerApi.createOrUpdateCustomizedField(formattedValues);
      return response;
    } catch (error) {
      console.error('Customer customized form submission error:', error);
      throw error;
    }
  };

  // 表单重置
  const resetForm = () => {
    formApi.reset();
    // 重置选项表格
    formApi.setValues({
      selectionOptions: [{ name: '' }],
    });
  };

  // 表单验证
  const validateForm = async () => {
    return await formApi.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<CustomerCustomizedFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 添加选项
  const addOption = () => {
    const currentOptions = formApi.getValues().selectionOptions || [];
    if (currentOptions.length >= 12) {
      throw new Error(t('purchase.personIsLazy', { value: 12 }));
    }

    const newOptions = [...currentOptions, { name: '' }];
    formApi.setValues({ selectionOptions: newOptions });
  };

  // 删除选项
  const removeOption = (index: number) => {
    const currentOptions = formApi.getValues().selectionOptions || [];
    if (currentOptions.length <= 1) {
      throw new Error(t('purchase.listMinWarning'));
    }

    const newOptions = currentOptions.filter((_, i) => i !== index);
    formApi.setValues({ selectionOptions: newOptions });
  };

  // 更新选项
  const updateOption = (index: number, value: string) => {
    const currentOptions = formApi.getValues().selectionOptions || [];
    const newOptions = [...currentOptions];
    newOptions[index] = { ...newOptions[index], name: value };
    formApi.setValues({ selectionOptions: newOptions });
  };

  return {
    // 组件
    Form,
    formApi,

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
