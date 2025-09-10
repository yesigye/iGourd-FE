import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface InventoryUnitFormData {
  name: string;
  merchant_id: string;
}

export function useInventoryUnitForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的单位表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('inventory.unitName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseInputName')}}",
          maxlength: 64,
          clearable: true,
          style: { width: '360px' },
        },
        'x-validator': [
          {
            required: true,
            message: "{{t('inventory.unitNameNotEmpty')}}",
          },
          {
            max: 64,
            message: "{{t('inventory.nameTooLong')}}",
          },
        ],
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      name: '',
      merchant_id: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: InventoryUnitFormData) => {
    try {
      // 调用 API
      const response = await inventoryApi.createOrUpdateUnit(values);
      return response;
    } catch (error) {
      console.error('Inventory unit form submission error:', error);
      throw error;
    }
  };

  // 表单重置
  const resetForm = () => {
    formApi.reset();
  };

  // 表单验证
  const validateForm = async () => {
    return await formApi.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<InventoryUnitFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
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
  };
}
