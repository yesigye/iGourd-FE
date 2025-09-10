import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { saleApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface SaleDailySettlementFormData {
  shift_date: string;
}

export function useSaleDailySettlementForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的日结表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      shift_date: {
        type: 'string',
        title: "{{t('common.date')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-component-props': {
          type: 'date',
          placeholder: "{{t('common.pleaseSelectDate')}}",
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          style: { width: '100%' },
        },
        'x-validator': [
          {
            required: true,
            message: "{{t('common.pleaseSelectDate')}}",
          },
        ],
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      shift_date: new Date().toISOString().split('T')[0],
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: SaleDailySettlementFormData) => {
    try {
      // 调用 API
      const response = await saleApi.createDailySettlement(values);
      return response;
    } catch (error) {
      console.error('Sale daily settlement form submission error:', error);
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
  const setFormValues = (values: Partial<SaleDailySettlementFormData>) => {
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
