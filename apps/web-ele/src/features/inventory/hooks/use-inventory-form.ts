import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer,useIgourdForm } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { InventoryInfo } from '../types';

export function useInventoryForm() {
  const { t } = useI18n();

  const formData = ref<Partial<InventoryInfo>>({});
  const loading = ref(false);

  // 表单配置
  const formSchema = {
    type: 'object',
    properties: {
      product_id: {
        type: 'string',
        title: "{{t('inventory.productName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('inventory.inventorySelectPlaceholder')}}",
          filterable: true,
          remote: true,
        },
      },
      warehouse_id: {
        type: 'string',
        title: "{{t('inventory.pleaseSelectWarehouse')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseSelectWarehouse')}}",
        },
      },
      stock_quantity: {
        type: 'number',
        title: "{{t('inventory.stockQuantity')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('inventory.stockQuantity')}}",
          min: 0,
          precision: 2,
        },
      },
      selling_price: {
        type: 'number',
        title: "{{t('common.search')}}",
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('inventory.sellingPrice')}}",
          min: 0,
          precision: 2,
        },
      },
      sku_barcode: {
        type: 'string',
        title: "{{t('inventory.skuBarcode')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('inventory.skuBarcode')}}",
          maxlength: 50,
        },
      },
      product_group_id: {
        type: 'string',
        title: "{{t('inventory.productGroup')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('inventory.productGroup')}}",
        },
      },
      warehouse_location_id: {
        type: 'string',
        title: "{{t('inventory.warehouseLocation')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('inventory.warehouseLocation')}}",
          maxlength: 100,
        },
      },
      remark: {
        type: 'string',
        title: "{{t('inventory.remark')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          type: 'textarea',
          placeholder: "{{t('inventory.remark')}}",
          maxlength: 500,
          rows: 3,
        },
      },
    },
  };

  const { Form, formAPI } = useIgourdForm({

    schema: formSchema,
    scope:{},
    useI18n
  });

  // 获取详情
  const getDetail = async (id: string) => {
    loading.value = true;
    try {
      const response = await inventoryApi.getDetail(id);
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
  const save = async (data: Partial<InventoryInfo>) => {
    loading.value = true;
    try {
      let response;
      if (data.id) {
        response = await inventoryApi.update(data.id, data);
      } else {
        response = await inventoryApi.create(data);
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
  const [ Drawer, drawerApi ] = useIgourdDrawer({
    onConfirm: async () => {
      await formAPI.submitForm();
      drawerApi.close();
    },
    appendToMain:true,
    onOpenChange: (isOpen: boolean) => {
      if (isOpen) {
        formAPI.setValues(formData.value);
    }
  })
  // 重置表单
  const resetForm = () => {
    formAPI.reset()
    // formData.value = {};
  };

  return {
    formData,
    Drawer,
    loading,
    formSchema,
    Form,
    getDetail,
    save,
    resetForm,
  };
}
