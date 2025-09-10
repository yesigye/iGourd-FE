import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { customerApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface CustomerFormData {
  name: string;
  profile_photo: string;
  label_id_list: string[];
  salesman_id: string;
  phone_number: string;
  contact_country_area_code: string;
  country: string;
  address: string;
  zip_code: string;
  email: string;
  birthday: string;
  gender: string;
  price_level_id: string;
  credit_limit: number;
  payment_terms: string;
  tax_number: string;
  remark: string;
  dynamic_data: Record<string, any>;
}

export function useCustomerForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的客户表单结构
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
            title: "{{t('customers.customerName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterCustomerName')}}",
              maxlength: 64,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseEnterCustomerName')}}",
              },
              {
                max: 64,
                message: "{{t('customers.nameTooLong')}}",
              },
            ],
          },
          profile_photo: {
            type: 'string',
            title: "{{t('customers.avatar')}}",
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
              placeholder: "{{t('set.uploadAvatar')}}",
            },
          },
          label_id_list: {
            type: 'array',
            title: "{{t('customers.customerLabel')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectCustomerLabelOptionValue')}}",
              multiple: true,
              filterable: true,
              clearable: true,
            },
          },
          salesman_id: {
            type: 'string',
            title: "{{t('customers.salesman')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterTheSalesman')}}",
              filterable: true,
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
          phone_number: {
            type: 'object',
            title: "{{t('customers.phoneNumber')}}",
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
              },
              phone_number: {
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: "{{t('customers.pleaseEnterPhoneNumber')}}",
                  maxlength: 15,
                  clearable: true,
                },
                'x-validator': [
                  {
                    pattern: /^[0-9]+$/,
                    message: "{{t('customers.pleaseEnterValidPhoneNumber')}}",
                  },
                ],
              },
            },
          },
          country: {
            type: 'string',
            title: "{{t('customers.country')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectCountry')}}",
              filterable: true,
              clearable: true,
            },
            'x-reactions': [
              {
                dependencies: ['.'],
                fulfill: {
                  state: {
                    'contactInfo.properties.phone_number.properties.contact_country_area_code.x-component-props.options': '{{$self.value ? getCountryAreaCodes($self.value) : []}}',
                  },
                },
              },
            ],
          },
          address: {
            type: 'string',
            title: "{{t('customers.address')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterAddress')}}",
              maxlength: 200,
              clearable: true,
            },
          },
          zip_code: {
            type: 'string',
            title: "{{t('customers.zipCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterZipCode')}}",
              maxlength: 20,
              clearable: true,
            },
          },
          email: {
            type: 'string',
            title: "{{t('customers.email')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterEmail')}}",
              clearable: true,
            },
            'x-validator': [
              {
                format: 'email',
                message: "{{t('customers.pleaseEnterValidEmail')}}",
              },
            ],
          },
          birthday: {
            type: 'string',
            title: "{{t('customers.birthday')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              type: 'date',
              placeholder: "{{t('customers.pleaseSelectBirthday')}}",
              clearable: true,
            },
          },
          gender: {
            type: 'string',
            title: "{{t('customers.gender')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectGender')}}",
              clearable: true,
              options: [
                { label: "{{t('customers.male')}}", value: 'MALE' },
                { label: "{{t('customers.female')}}", value: 'FEMALE' },
                { label: "{{t('customers.other')}}", value: 'OTHER' },
              ],
            },
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
          price_level_id: {
            type: 'string',
            title: "{{t('customers.priceLevel')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectPriceLevel')}}",
              clearable: true,
            },
          },
          credit_limit: {
            type: 'number',
            title: "{{t('customers.creditLimit')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterCreditLimit')}}",
              style: { width: '100%' },
              controls: false,
              min: 0,
            },
          },
          payment_terms: {
            type: 'string',
            title: "{{t('customers.paymentTerms')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectPaymentTerms')}}",
              clearable: true,
              options: [
                { label: "{{t('customers.paymentTerms_CASH')}}", value: 'CASH' },
                { label: "{{t('customers.paymentTerms_CREDIT')}}", value: 'CREDIT' },
                { label: "{{t('customers.paymentTerms_MONTHLY')}}", value: 'MONTHLY' },
                { label: "{{t('customers.paymentTerms_QUARTERLY')}}", value: 'QUARTERLY' },
              ],
            },
          },
          tax_number: {
            type: 'string',
            title: "{{t('customers.taxNumber')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterTaxNumber')}}",
              maxlength: 50,
              clearable: true,
            },
          },
        },
      },

      // 备注部分
      remarkInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.remark')}}",
          defaultOpen: true,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('customers.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('customers.pleaseEnterRemark')}}",
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
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    initialValues: {
      name: '',
      profile_photo: '',
      label_id_list: [],
      salesman_id: '',
      phone_number: '',
      contact_country_area_code: '',
      country: '',
      address: '',
      zip_code: '',
      email: '',
      birthday: '',
      gender: '',
      price_level_id: '',
      credit_limit: 0,
      payment_terms: '',
      tax_number: '',
      remark: '',
      dynamic_data: {},
    },
    scope: {},
  });

  // 表单提交处理
  const handleSubmit = async (values: CustomerFormData) => {
    try {
      // 处理动态数据
      const dynamicData = { ...values.dynamic_data };

      // 转换日期格式
      const formattedValues = {
        ...values,
        birthday: values.birthday ? new Date(values.birthday).toISOString().split('T')[0] : '',
        dynamic_data: JSON.stringify(dynamicData),
      };

      // 调用 API
      const response = await customerApi.create(formattedValues);
      return response;
    } catch (error) {
      console.error('Customer form submission error:', error);
      throw error;
    }
  };

  // 表单重置
  const resetForm = () => {
    formAPI.reset();
  };

  // 表单验证
  const validateForm = async () => {
    return await formAPI.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<CustomerFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  return {
    // 组件
    Form,
    formAPI,

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
