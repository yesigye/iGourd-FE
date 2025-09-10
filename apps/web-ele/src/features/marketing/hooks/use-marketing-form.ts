import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { marketingApi } from '../apis';
import type { MarketingInfo } from '../types';

export function useMarketingForm() {
  const { t } = useI18n();
  
  const formData = ref<Partial<MarketingInfo>>({});
  const loading = ref(false);

  // 表单配置
  const formSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('marketing.name')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('marketing.name')}}",
          maxlength: 50,
        },
      },
      type: {
        type: 'string',
        title: "{{t('marketing.type')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectType')}}",
          options: [
            { label: '折扣活动', value: 'discount' },
            { label: '价格调整', value: 'price' },
            { label: '促销活动', value: 'promotion' },
          ],
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'start_date.x-component-props.disabled': '{{!$self.value}}',
                'end_date.x-component-props.disabled': '{{!$self.value}}',
              },
            },
          },
        ],
      },
      status: {
        type: 'string',
        title: "{{t('marketing.status')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectStatus')}}",
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ],
        },
      },
      start_date: {
        type: 'string',
        title: "{{t('marketing.startDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('marketing.startDate')}}",
          type: 'date',
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'end_date.x-component-props.disabledDate': '{{$self.value ? (date) => date < new Date($self.value) : null}}',
              },
            },
          },
        ],
      },
      end_date: {
        type: 'string',
        title: "{{t('marketing.endDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('marketing.endDate')}}",
          type: 'date',
        },
      },
      description: {
        type: 'string',
        title: "{{t('marketing.description')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          type: 'textarea',
          placeholder: "{{t('marketing.description')}}",
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
      const response = await marketingApi.getDetail(id);
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
  const save = async (data: Partial<MarketingInfo>) => {
    loading.value = true;
    try {
      let response;
      if (data.id) {
        response = await marketingApi.update(data.id, data);
      } else {
        response = await marketingApi.create(data);
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
