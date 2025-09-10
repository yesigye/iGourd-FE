import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { storeApi } from '../apis';
import type { StoreInfo } from '../types';

export function useStoreForm() {
  const { t } = useI18n();
  
  const formData = ref<Partial<StoreInfo>>({});
  const loading = ref(false);

  // 表单配置
  const formSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('store.name')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('store.name')}}",
          maxlength: 50,
        },
      },
      address: {
        type: 'string',
        title: "{{t('store.address')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('store.address')}}",
          maxlength: 200,
        },
      },
      contact_person: {
        type: 'string',
        title: "{{t('store.contactPerson')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('store.contactPerson')}}",
          maxlength: 50,
        },
      },
      contact_phone: {
        type: 'string',
        title: "{{t('store.contactPhone')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('store.contactPhone')}}",
          maxlength: 20,
        },
      },
      status: {
        type: 'string',
        title: "{{t('store.status')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('store.pleaseSelectStatus')}}",
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ],
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'description.x-component-props.disabled': '{{$self.value === "inactive"}}',
              },
            },
          },
        ],
      },
      description: {
        type: 'string',
        title: "{{t('store.description')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          type: 'textarea',
          placeholder: "{{t('store.description')}}",
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
      const response = await storeApi.getDetail(id);
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
  const save = async (data: Partial<StoreInfo>) => {
    loading.value = true;
    try {
      let response;
      if (data.id) {
        response = await storeApi.update(data.id, data);
      } else {
        response = await storeApi.create(data);
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
