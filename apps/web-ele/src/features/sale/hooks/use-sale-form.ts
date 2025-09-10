import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { saleApi } from '../apis';
import type { SaleInfo } from '../types';

export function useSaleForm() {
  const { t } = useI18n();

  const formData = ref<Partial<SaleInfo>>({});
  const loading = ref(false);

  // 客户列表
  const customerList = ref([]);

  // 表单配置
  const formSchema = {
    type: 'object',
    properties: {
      customer_id: {
        type: 'string',
        title: "{{t('sale.customerName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('sale.pleaseSelectCustomer')}}",
          options: customerList.value,
          filterable: true,
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'sale_date.x-component-props.disabled': '{{!$self.value}}',
                'total_amount.x-component-props.disabled': '{{!$self.value}}',
              },
            },
          },
        ],
      },
      sale_date: {
        type: 'string',
        title: "{{t('sale.saleDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('sale.saleDate')}}",
          type: 'date',
        },
      },
      total_amount: {
        type: 'number',
        title: "{{t('sale.totalAmount')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('sale.totalAmount')}}",
          min: 0,
          precision: 2,
        },
      },
      status: {
        type: 'string',
        title: "{{t('sale.status')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('sale.pleaseSelectStatus')}}",
          options: [
            { label: '待支付', value: 'pending' },
            { label: '已支付', value: 'paid' },
            { label: '已取消', value: 'cancelled' },
          ],
        },
      },
      remark: {
        type: 'string',
        title: "{{t('sale.remark')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          type: 'textarea',
          placeholder: "{{t('sale.remark')}}",
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
      const response = await saleApi.getDetail(id);
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
  const save = async (data: Partial<SaleInfo>) => {
    loading.value = true;
    try {
      let response;
      if (data.id) {
        response = await saleApi.update(data.id, data);
      } else {
        response = await saleApi.create(data);
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

  // 获取客户列表
  const getCustomerList = async () => {
    try {
      const response = await saleApi.getCustomerList({
        page_num: 1,
        page_size: 100,
      });

      if (response.code === 'SUCCESS') {
        customerList.value = response.data.list.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      }
    } catch (error) {
      console.error('获取客户列表失败:', error);
    }
  };

  return {
    formData,
    loading,
    formSchema,
    customerList,
    getDetail,
    save,
    resetForm,
    getCustomerList,
  };
}
