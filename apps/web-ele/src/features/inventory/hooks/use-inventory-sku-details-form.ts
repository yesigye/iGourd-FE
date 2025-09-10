import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface InventorySkuDetailsFormData {
  id: number;
  major_name: string;
  product_unit_id: number;
  product_unit_name: string;
  selling_price: number;
  cost_price: number;
  sku_barcode: string;
  spec_code: string;
  profile_photo: string;
  remark: string;
  status: string;
}

export function useInventorySkuDetailsForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的库存SKU详情表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基础信息部分
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.basicInformation')}}",
          defaultOpen: true,
        },
        properties: {
          major_name: {
            type: 'string',
            title: "{{t('inventory.productName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterProductName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterProductName')}}",
              },
            ],
          },
          product_unit_name: {
            type: 'string',
            title: "{{t('inventory.productUnit')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterProductUnit')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterProductUnit')}}",
              },
            ],
          },
          spec_code: {
            type: 'string',
            title: "{{t('inventory.specCode')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterSpecCode')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterSpecCode')}}",
              },
            ],
          },
          sku_barcode: {
            type: 'string',
            title: "{{t('inventory.skuBarcode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterSkuBarcode')}}",
              clearable: true,
            },
          },
        },
      },

      // 价格信息部分
      priceInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.priceInformation')}}",
          defaultOpen: true,
        },
        properties: {
          selling_price: {
            type: 'number',
            title: "{{t('inventory.sellingPrice')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterSellingPrice')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterSellingPrice')}}",
              },
            ],
          },
          cost_price: {
            type: 'number',
            title: "{{t('inventory.costPrice')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterCostPrice')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterCostPrice')}}",
              },
            ],
          },
        },
      },

      // 图片信息部分
      imageInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.imageInformation')}}",
          defaultOpen: true,
        },
        properties: {
          profile_photo: {
            type: 'string',
            title: "{{t('inventory.productImage')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Upload',
            'x-component-props': {
              accept: 'image/*',
              maxSize: 2 * 1024 * 1024, // 2MB
              multiple: false,
              showFileList: false,
              beforeUpload: (file) => {
                const isImage = file.type.startsWith('image/');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isImage) {
                  throw new Error(t('common.fileNotSupport'));
                }
                if (!isLt2M) {
                  throw new Error(t('inventory.imageSizeShouldBeLessThan2MB'));
                }
                return true;
              },
            },
          },
        },
      },

      // 状态配置部分
      statusConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.statusConfig')}}",
          defaultOpen: true,
        },
        properties: {
          status: {
            type: 'string',
            title: "{{t('inventory.status')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectStatus')}}",
              options: [
                { label: "{{t('inventory.onSale'), value: 'ON_SALE' },
                { label: "{{t('inventory.offSale'), value: 'OFF_SALE' },
                { label: "{{t('inventory.discontinued'), value: 'DISCONTINUED' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseSelectStatus')}}",
              },
            ],
          },
        },
      },

      // 备注部分
      remarkConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.remark')}}",
          defaultOpen: false,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('inventory.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('inventory.pleaseEnterRemark')}}",
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
      id: 0,
      major_name: '',
      product_unit_id: 0,
      product_unit_name: '',
      selling_price: 0,
      cost_price: 0,
      sku_barcode: '',
      spec_code: '',
      profile_photo: '',
      remark: '',
      status: 'ON_SALE',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: InventorySkuDetailsFormData) => {
    try {
      // 调用 API
      const response = await inventoryApi.modifyProductInfo(values);
      return response;
    } catch (error) {
      console.error('Inventory SKU details form submission error:', error);
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
  const setFormValues = (values: Partial<InventorySkuDetailsFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 上传图片
  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await inventoryApi.uploadFile(formData);
      return response;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  };

  // 获取SKU详情
  const getSkuDetail = async (skuId: number) => {
    try {
      const response = await inventoryApi.getSkuDetail(skuId);
      return response;
    } catch (error) {
      console.error('Get SKU detail error:', error);
      throw error;
    }
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
    uploadImage,
    getSkuDetail,
  };
}
