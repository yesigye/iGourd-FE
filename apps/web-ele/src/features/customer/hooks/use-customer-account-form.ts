import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { customerApi } from '../apis';
import { accountApi } from '../../account/apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface CustomerAccountFormData {
  customer_id: string;
  customer_name: string;
  account_type: string;
  amount: number;
  currency_code: string;
  exchange_rate: number;
  remark: string;
  attachment_url: string;
  merchant_id: string;
  creator_id: string;
  creator_name: string;
  create_time: string;
  update_time: string;
}

export function useCustomerAccountForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的客户账户表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 客户信息部分
      customerInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.customerInfo')}}",
          defaultOpen: true,
        },
        properties: {
          customer_id: {
            type: 'string',
            title: "{{t('customers.customer')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectCustomer')}}",
              clearable: true,
              filterable: true,
              showSearch: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseSelectCustomer')}}",
              },
            ],
          },
          customer_name: {
            type: 'string',
            title: "{{t('customers.customerName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
        },
      },

      // 账户类型部分
      accountType: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.accountType')}}",
          defaultOpen: true,
        },
        properties: {
          account_type: {
            type: 'string',
            title: "{{t('customers.accountType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                {
                  label: "{{t('customers.revenue')}}",
                  value: 'REVENUE',
                },
                {
                  label: "{{t('customers.expenditure')}}",
                  value: 'EXPENDITURE',
                },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseSelectAccountType')}}",
              },
            ],
          },
        },
      },

      // 金额信息部分
      amountInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.amountInfo')}}",
          defaultOpen: true,
        },
        properties: {
          amount: {
            type: 'number',
            title: "{{t('customers.amount')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterAmount')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseEnterAmount')}}",
              },
              {
                validator: (value: number) => {
                  if (value <= 0) {
                    return t('customers.amountMustBePositive');
                  }
                  return true;
                },
              },
            ],
          },
          currency_code: {
            type: 'string',
            title: "{{t('customers.currency')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectCurrency')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.pleaseSelectCurrency')}}",
              },
            ],
          },
          exchange_rate: {
            type: 'number',
            title: "{{t('customers.exchangeRate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterExchangeRate')}}",
              min: 0,
              precision: 4,
            },
          },
        },
      },

      // 其他信息部分
      otherInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.otherInfo')}}",
          defaultOpen: false,
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
          attachment_url: {
            type: 'string',
            title: "{{t('customers.attachment')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Upload',
            'x-component-props': {
              accept: '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg',
              maxSize: 10 * 1024 * 1024, // 10MB
              maxCount: 5,
              multiple: true,
              showFileList: true,
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    scope: {},
    useI18n,
    schema: formSchema,
    initialValues: {
      customer_id: '',
      customer_name: '',
      account_type: '',
      amount: 0,
      currency_code: '',
      exchange_rate: 1,
      remark: '',
      attachment_url: '',
      merchant_id: '',
      creator_id: '',
      creator_name: '',
      create_time: '',
      update_time: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: CustomerAccountFormData) => {
    try {
      // 调用 API
      const response = await customerApi.createAccount(values);
      return response;
    } catch (error) {
      console.error('Customer account form submission error:', error);
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
  const setFormValues = (values: Partial<CustomerAccountFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取客户列表
  const getCustomerList = async () => {
    try {
      const response = await customerApi.getList({});
      return response;
    } catch (error) {
      console.error('Get customer list error:', error);
      throw error;
    }
  };

  // 获取货币列表
  const getCurrencyList = async () => {
    try {
      // 这里需要调用 account API 获取货币列表
      const response = await accountApi.getCurrencyList({});
      return response;
    } catch (error) {
      console.error('Get currency list error:', error);
      throw error;
    }
  };

  // 设置客户信息
  const setCustomerInfo = (customerInfo: any) => {
    formAPI.setValues({
      customer_id: customerInfo.id,
      customer_name: customerInfo.name
    });
  };

  // 设置账户类型
  const setAccountType = (accountType: string) => {
    formAPI.setValues({ account_type: accountType });
  };

  // 设置创建者信息
  const setCreatorInfo = (creatorInfo: any) => {
    formAPI.setValues({
      creator_id: creatorInfo.id,
      creator_name: creatorInfo.name
    });
  };

  // 计算汇率
  const calculateExchangeRate = (fromCurrency: string, toCurrency: string) => {
    // 这里可以添加汇率计算逻辑
    // 实际实现需要调用汇率API
    return 1;
  };

  // 验证金额
  const validateAmount = (amount: number) => {
    if (amount <= 0) {
      return t('customers.amountMustBePositive');
    }
    if (amount > 999999999.99) {
      return t('customers.amountTooLarge');
    }
    return true;
  };

  // 验证汇率
  const validateExchangeRate = (rate: number) => {
    if (rate <= 0) {
      return t('customers.exchangeRateMustBePositive');
    }
    if (rate > 999999.9999) {
      return t('customers.exchangeRateTooLarge');
    }
    return true;
  };

  // 获取账户类型选项
  const getAccountTypeOptions = () => {
    return [
      {
        label: "{{t('customers.revenue')}}",
        value: 'REVENUE',
      },
      {
        label: "{{t('customers.expenditure')}}",
        value: 'EXPENDITURE',
      },
    ];
  };

  // 获取货币选项
  const getCurrencyOptions = async () => {
    try {
      const response = await getCurrencyList();
      return response.map((item: any) => ({
        label: `${item.name} (${item.code})`,
        value: item.code,
      }));
    } catch (error) {
      console.error('Get currency options error:', error);
      return [];
    }
  };

  // 获取客户选项
  const getCustomerOptions = async () => {
    try {
      const response = await getCustomerList();
      return response.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      console.error('Get customer options error:', error);
      return [];
    }
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
    getCustomerList,
    getCurrencyList,
    setCustomerInfo,
    setAccountType,
    setCreatorInfo,
    calculateExchangeRate,
    validateAmount,
    validateExchangeRate,
    getAccountTypeOptions,
    getCurrencyOptions,
    getCustomerOptions,
  };
}
