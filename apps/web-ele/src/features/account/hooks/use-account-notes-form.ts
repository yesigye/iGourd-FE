import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface AccountNotesFormData {
  type: string;
  change_type: string;
  financial_classification_id: string;
  finance_category_id: string;
  receivable_amount: number;
  payable_amount: number;
  currency_code: string;
  exchange_rate: number;
  partner_type: string;
  partner_id: string;
  partner_name: string;
  account_id: string;
  account_name: string;
  remark: string;
  attachment_url: string;
  merchant_id: string;
  creator_id: string;
  creator_name: string;
  create_time: string;
  update_time: string;
}

export function useAccountNotesForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的账户备注抽屉表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 创建者信息
      creatorInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.creatorInfo')}}",
          defaultOpen: true,
        },
        properties: {
          creator_name: {
            type: 'string',
            title: "{{t('account.creator')}}",
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

      // 单据类型部分
      billType: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.billType')}}",
          defaultOpen: true,
        },
        properties: {
          type: {
            type: 'string',
            title: "{{t('account.accountType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                {
                  label: "{{t('account.income')}}",
                  value: 'INCOME',
                },
                {
                  label: "{{t('account.expense')}}",
                  value: 'EXPENSE',
                },
                {
                  label: "{{t('account.transfer')}}",
                  value: 'TRANSFER',
                },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectAccountType')}}",
              },
            ],
          },
          change_type: {
            type: 'string',
            title: "{{t('account.revenueExpenditure')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                {
                  label: "{{t('account.income')}}",
                  value: 'INCOME',
                },
                {
                  label: "{{t('account.expense')}}",
                  value: 'EXPENSE',
                },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectRevenueExpenditure')}}",
              },
            ],
          },
          financial_classification_id: {
            type: 'string',
            title: "{{t('account.financialClassification')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectFinancialClassification')}}",
              clearable: true,
              filterable: true,
            },
          },
        },
      },

      // 金额设置部分
      amountSetting: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.amountSetting')}}",
          defaultOpen: true,
        },
        properties: {
          receivable_amount: {
            type: 'number',
            title: "{{t('account.receivableAmount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterReceivableAmount')}}",
              min: 0,
              precision: 2,
            },
          },
          payable_amount: {
            type: 'number',
            title: "{{t('account.payableAmount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterPayableAmount')}}",
              min: 0,
              precision: 2,
            },
          },
          currency_code: {
            type: 'string',
            title: "{{t('account.currency')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectCurrency')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectCurrency')}}",
              },
            ],
          },
          exchange_rate: {
            type: 'number',
            title: "{{t('account.exchangeRate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterExchangeRate')}}",
              min: 0,
              precision: 4,
            },
          },
        },
      },

      // 交易对象部分
      tradingPartner: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.tradingPartner')}}",
          defaultOpen: true,
        },
        properties: {
          partner_type: {
            type: 'string',
            title: "{{t('account.partnerType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                {
                  label: "{{t('account.customer')}}",
                  value: 'CUSTOMER',
                },
                {
                  label: "{{t('account.vendor')}}",
                  value: 'VENDOR',
                },
                {
                  label: "{{t('account.other')}}",
                  value: 'OTHER',
                },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectPartnerType')}}",
              },
            ],
          },
          partner_id: {
            type: 'string',
            title: "{{t('account.partner')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectPartner')}}",
              clearable: true,
              filterable: true,
              showSearch: true,
            },
          },
          partner_name: {
            type: 'string',
            title: "{{t('account.partnerName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterPartnerName')}}",
              clearable: true,
            },
          },
        },
      },

      // 账户信息部分
      accountInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.accountInfo')}}",
          defaultOpen: true,
        },
        properties: {
          account_id: {
            type: 'string',
            title: "{{t('account.account')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectAccount')}}",
              clearable: true,
              filterable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectAccount')}}",
              },
            ],
          },
          account_name: {
            type: 'string',
            title: "{{t('account.accountName')}}",
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

      // 其他信息部分
      otherInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.other')}}",
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
              maxlength: 500,
              showWordLimit: true,
              rows: 3,
            },
          },
          attachment_url: {
            type: 'string',
            title: "{{t('account.attachment')}}",
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
    scope:{},
    useI18n,
    schema: formSchema,
    initialValues: {
      type: '',
      change_type: '',
      financial_classification_id: '',
      finance_category_id: '',
      receivable_amount: 0,
      payable_amount: 0,
      currency_code: '',
      exchange_rate: 1,
      partner_type: '',
      partner_id: '',
      partner_name: '',
      account_id: '',
      account_name: '',
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
  const handleSubmit = async (values: AccountNotesFormData) => {
    try {
      // 调用 API
      const response = await accountApi.createNotes(values);
      return response;
    } catch (error) {
      console.error('Account notes form submission error:', error);
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
  const setFormValues = (values: Partial<AccountNotesFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values;
  };

  // 获取财务分类列表
  const getFinancialCategoryList = async () => {
    try {
      const response = await accountApi.getAccountClassificationList({});
      return response;
    } catch (error) {
      console.error('Get financial category list error:', error);
      throw error;
    }
  };

  // 获取货币列表
  const getCurrencyList = async () => {
    try {
      const response = await accountApi.getCurrencyList();
      return response;
    } catch (error) {
      console.error('Get currency list error:', error);
      throw error;
    }
  };

  // 获取账户列表
  const getAccountList = async () => {
    try {
      const response = await accountApi.getList({});
      return response;
    } catch (error) {
      console.error('Get account list error:', error);
      throw error;
    }
  };

  // 获取客户列表
  const getCustomerList = async () => {
    try {
      const response = await accountApi.getCustomerList();
      return response;
    } catch (error) {
      console.error('Get customer list error:', error);
      throw error;
    }
  };

  // 获取供应商列表
  const getVendorList = async () => {
    try {
      // 使用客户列表作为供应商列表的替代
      const response = await accountApi.getCustomerList({});
      return response;
    } catch (error) {
      console.error('Get vendor list error:', error);
      throw error;
    }
  };

  // 根据交易对象类型获取对应的选项
  const getPartnerOptions = async (partnerType: string) => {
    switch (partnerType) {
      case 'CUSTOMER':
        return await getCustomerList();
      case 'VENDOR':
        return await getVendorList();
      default:
        return [];
    }
  };

  // 设置创建者信息
  const setCreatorInfo = (creatorInfo: any) => {
    formAPI.setValues({
      creator_id: creatorInfo.id,
      creator_name: creatorInfo.name
    });
  };

  // 设置账户信息
  const setAccountInfo = (accountInfo: any) => {
    formAPI.setValues({
      account_id: accountInfo.id,
      account_name: accountInfo.name
    });
  };

  // 设置交易对象信息
  const setPartnerInfo = (partnerInfo: any) => {
    formAPI.setValues({
      partner_id: partnerInfo.id,
      partner_name: partnerInfo.name
    });
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
    getFinancialCategoryList,
    getCurrencyList,
    getAccountList,
    getCustomerList,
    getVendorList,
    getPartnerOptions,
    setCreatorInfo,
    setAccountInfo,
    setPartnerInfo,
  };
}
