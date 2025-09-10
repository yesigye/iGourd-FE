import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { reportApi } from '../apis';
import type { ReportInfo } from '../types';

export function useReportForm() {
  const { t } = useI18n();
  
  const formData = ref<Partial<ReportInfo>>({});
  const loading = ref(false);

  // 表单配置
  const formSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('report.name')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('report.name')}}",
          maxlength: 50,
        },
      },
      type: {
        type: 'string',
        title: "{{t('report.type')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('report.pleaseSelectType')}}",
          options: [
            { label: '客户报表', value: 'customer' },
            { label: '财务报表', value: 'financial' },
            { label: '库存报表', value: 'inventory' },
            { label: '销售报表', value: 'sales' },
          ],
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'status.x-component-props.disabled': '{{!$self.value}}',
                'description.x-component-props.disabled': '{{!$self.value}}',
              },
            },
          },
        ],
      },
      status: {
        type: 'string',
        title: "{{t('report.status')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('report.pleaseSelectStatus')}}",
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ],
        },
      },
      description: {
        type: 'string',
        title: "{{t('report.description')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          type: 'textarea',
          placeholder: "{{t('report.description')}}",
          maxlength: 500,
          rows: 3,
        },
      },
    },
  };

  // 获取详情
  const getDetail = async (id: string) => {
    loading.value = true;
    try {
      const response = await reportApi.getDetail(id);
      if (response.code === 'SUCCESS') {
        formData.value = response.data;
      }
    } catch (error) {
      console.error('获取详情失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 保存
  const save = async (data: Partial<ReportInfo>) => {
    loading.value = true;
    try {
      let response;
      if (data.id) {
        response = await reportApi.update(data.id, data);
      } else {
        response = await reportApi.create(data);
      }
      
      if (response.code === 'SUCCESS') {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('保存失败:', error);
      return { success: false, message: '保存失败' };
    } finally {
      loading.value = false;
    }
  };

  // 重置表单
  const resetForm = () => {
    formData.value = {};
  };

  return {
    formData,
    loading,
    formSchema,
    getDetail,
    save,
    resetForm,
  };
}
