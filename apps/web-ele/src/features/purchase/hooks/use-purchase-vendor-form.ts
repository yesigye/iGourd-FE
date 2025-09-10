import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface VendorFormData {
  name: string;
  profile_photo: string;
  effective_time: string;
  expiration_time: string;
  contact_name: string;
  contact_country_area_code: string;
  contact_telephone: string;
  address: string;
  country_id: string;
  zip_code: string;
  email: string;
  tin_number: string;
  tax_number: string;
  currency_code: string;
  balance: number;
  bank_name: string;
  bank_address: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_swift_code: string;
  remark: string;
  dynamic_data: Record<string, any>;
}

export function usePurchaseVendorForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的复杂表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基础信息部分
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.basicInformaion')}}",
          defaultOpen: true,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('purchase.vendor__name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterVendorName')}}",
              maxlength: 64,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseEnterVendorName')}}",
              },
              {
                max: 64,
                message: "{{t('purchase.nameTooLong')}}",
              },
            ],
          },
          profile_photo: {
            type: 'string',
            title: "{{t('purchase.profile__photo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Upload',
            'x-component-props': {
              listType: 'picture-card',
              limit: 1,
              accept: 'image/*',
              maxSize: 2 * 1024 * 1024, // 2MB
              placeholder: "{{t('inventory.uploadImage')}}",
            },
          },
          effective_time: {
            type: 'string',
            title: "{{t('purchase.effective_time')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              type: 'date',
              placeholder: "{{t('purchase.pleaseSelectEffectiveTime')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('marketing.pleaseEnterEffectiveTime')}}",
              },
            ],
          },
          expiration_time: {
            type: 'string',
            title: "{{t('purchase.expiration_time')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              type: 'date',
              placeholder: "{{t('purchase.pleaseSelectExpirationTime')}}",
              clearable: true,
            },
          },
        },
      },

      // 联系人信息部分
      contactInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.contactInformation')}}",
          defaultOpen: true,
        },
        properties: {
          contact_name: {
            type: 'string',
            title: "{{t('purchase.name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterContactName')}}",
              maxlength: 64,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseEnterContactName')}}",
              },
              {
                max: 64,
                message: "{{t('purchase.nameTooLong')}}",
              },
            ],
          },
          contact_phone: {
            type: 'object',
            title: "{{t('purchase.phone')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Space',
            'x-component-props': {
              style: { width: '100%' },
            },
            properties: {
              contact_country_area_code: {
                type: 'string',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('common.select')}}",
                  style: { width: '120px' },
                  clearable: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('purchase.pleaseEnterCountryAreaCode')}}",
                  },
                ],
              },
              contact_telephone: {
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: "{{t('purchase.pleaseEnterPhoneNumber')}}",
                  maxlength: 64,
                  clearable: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('purchase.pleaseEnterContactTelephone')}}",
                  },
                ],
              },
            },
          },
          country_id: {
            type: 'string',
            title: "{{t('purchase.country')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectCountry')}}",
              filterable: true,
              clearable: true,
            },
          },
          address: {
            type: 'string',
            title: "{{t('purchase.address')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterAddress')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          zip_code: {
            type: 'string',
            title: "{{t('purchase.zipCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterZipCode')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          email: {
            type: 'string',
            title: "{{t('purchase.email')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterEmail')}}",
              clearable: true,
            },
            'x-validator': [
              {
                format: 'email',
                message: "{{t('purchase.pleaseEnterValidEmail')}}",
              },
            ],
          },
        },
      },

      // 财务信息部分
      financialInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.financialInformation')}}",
          defaultOpen: true,
        },
        properties: {
          tin_number: {
            type: 'string',
            title: "{{t('purchase.tinNumber')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterTinNumber')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          tax_number: {
            type: 'string',
            title: "{{t('purchase.taxNumber')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterTaxNumber')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          currency_code: {
            type: 'string',
            title: "{{t('purchase.currency')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectCurrency')}}",
              filterable: true,
              clearable: true,
            },
          },
          balance: {
            type: 'number',
            title: "{{t('purchase.openingBalance')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterOpeningBalance')}}",
              style: { width: '100%' },
              controls: false,
            },
          },
          bank_name: {
            type: 'string',
            title: "{{t('purchase.bankName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterBankName')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          bank_address: {
            type: 'string',
            title: "{{t('purchase.bankAddress')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterBankAddress')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          bank_account_name: {
            type: 'string',
            title: "{{t('purchase.bankAccountName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterBankAccountName')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          bank_account_number: {
            type: 'string',
            title: "{{t('purchase.bankAccountNumber')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterBankAccountNumber')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          bank_swift_code: {
            type: 'string',
            title: "{{t('purchase.bankSwiftCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterBankSwiftCode')}}",
              maxlength: 64,
              clearable: true,
            },
          },
          remark: {
            type: 'string',
            title: "{{t('purchase.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('purchase.pleaseEnterRemark')}}",
              maxlength: 256,
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
      name: '',
      profile_photo: '',
      effective_time: '',
      expiration_time: '',
      contact_name: '',
      contact_country_area_code: '',
      contact_telephone: '',
      address: '',
      country_id: '',
      zip_code: '',
      email: '',
      tin_number: '',
      tax_number: '',
      currency_code: '',
      balance: null,
      bank_name: '',
      bank_address: '',
      bank_account_name: '',
      bank_account_number: '',
      bank_swift_code: '',
      remark: '',
      dynamic_data: {},
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: VendorFormData) => {
    try {
      // 处理动态数据
      const dynamicData = { ...values.dynamic_data };

      // 转换日期格式
      const formattedValues = {
        ...values,
        effective_time: values.effective_time ? new Date(values.effective_time).toISOString().split('T')[0] : '',
        expiration_time: values.expiration_time ? new Date(values.expiration_time).toISOString().split('T')[0] : '',
        dynamic_data: JSON.stringify(dynamicData),
      };

      // 调用 API
      const response = await purchaseApi.createOrUpdateVendor(formattedValues);
      return response;
    } catch (error) {
      console.error('Vendor form submission error:', error);
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
  const setFormValues = (values: Partial<VendorFormData>) => {
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
