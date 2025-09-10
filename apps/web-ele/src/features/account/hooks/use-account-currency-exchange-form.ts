import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface AccountCurrencyExchangeFormData {
  exchange_date: string;
  sell_amount: number;
  sell_currency_code: string;
  buy_amount: number;
  buy_currency_code: string;
  exchange_rate: number;
  remark: string;
  merchant_id: string;
}

export function useAccountCurrencyExchangeForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的货币兑换表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基础信息部分
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.basicInformation')}}",
          defaultOpen: true,
        },
        properties: {
          exchange_date: {
            type: 'string',
            title: "{{t('account.date')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('account.pickADate')}}",
              type: 'date',
              valueFormat: 'YYYY-MM-DD',
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterDate')}}",
              },
            ],
          },
        },
      },

      // 卖出信息部分
      sellInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.sellInformation')}}",
          defaultOpen: true,
        },
        properties: {
          sell_amount: {
            type: 'number',
            title: "{{t('account.sellingAmount')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterSellAmount')}}",
              min: 0,
              precision: 2,
              style: { width: '500px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterSellAmount')}}",
              },
            ],
          },
          sell_currency_code: {
            type: 'string',
            title: "{{t('account.sellCurrency')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectSellCurrency')}}",
              style: { width: '180px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectSellCurrency')}}",
              },
            ],
          },
        },
      },

      // 买入信息部分
      buyInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.buyInformation')}}",
          defaultOpen: true,
        },
        properties: {
          buy_amount: {
            type: 'number',
            title: "{{t('account.buyAmount')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterBuyAmount')}}",
              min: 0,
              precision: 2,
              style: { width: '500px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterBuyAmount')}}",
              },
            ],
          },
          buy_currency_code: {
            type: 'string',
            title: "{{t('account.buyCurrency')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectBuyCurrency')}}",
              style: { width: '180px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectBuyCurrency')}}",
              },
            ],
          },
        },
      },

      // 汇率信息部分
      rateInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.exchangeRateInformation')}}",
          defaultOpen: true,
        },
        properties: {
          exchange_rate: {
            type: 'number',
            title: "{{t('account.exchangeRate')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterExchangeRate')}}",
              min: 0,
              precision: 4,
              style: { width: '500px' },
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterExchangeRate')}}",
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
          title: "{{t('account.remark')}}",
          defaultOpen: false,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('account.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('account.pleaseEnterRemark')}}",
              maxlength: 256,
              showWordLimit: true,
              rows: 3,
              style: { width: '690px' },
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
      exchange_date: '',
      sell_amount: null,
      sell_currency_code: '',
      buy_amount: null,
      buy_currency_code: '',
      exchange_rate: null,
      remark: '',
      merchant_id: '',
    },
    scope: {},
  });

  // 表单提交处理
  const handleSubmit = async (values: AccountCurrencyExchangeFormData) => {
    try {
      // 调用 API
      const response = await accountApi.createCurrency(values);
      return response;
    } catch (error) {
      console.error('Account currency exchange form submission error:', error);
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
  const setFormValues = (values: Partial<AccountCurrencyExchangeFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取货币列表
  const getCurrencyList = async () => {
    try {
      const response = await accountApi.getCurrencyList({});
      return response;
    } catch (error) {
      console.error('Get currency list error:', error);
      throw error;
    }
  };

  // 计算汇率
  const calculateExchangeRate = (sellAmount: number, buyAmount: number) => {
    if (sellAmount && buyAmount) {
      return (buyAmount / sellAmount).toFixed(4);
    }
    return '';
  };

  // 获取货币兑换详情
  const getCurrencyExchangeDetail = async (exchangeId: number) => {
    try {
      const response = await accountApi.getCurrencyDetail(String(exchangeId));
      return response;
    } catch (error) {
      console.error('Get currency exchange detail error:', error);
      throw error;
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
    getCurrencyList,
    calculateExchangeRate,
    getCurrencyExchangeDetail,
  };
}
