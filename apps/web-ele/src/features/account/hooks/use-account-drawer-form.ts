import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface AccountDrawerFormData {
  account_type: string;
  name: string;
  account_ledger_id: string;
  balance_direction_sort: string;
  currency_code: string;
  opening_balance: number;
  current_balance: number;
  remark: string;
  merchant_id: string;
  belong_type: string;
}

export function useAccountDrawerForm() {
  const { t } = useI18n();

  // 现金账户 Schema
  const cashSchema: ISchema = {
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
          name: {
            type: 'string',
            title: "{{t('account.accountName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterAccountName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterAccountName')}}",
              },
            ],
          },
          account_ledger_id: {
            type: 'string',
            title: "{{t('account.accountLedger')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectAccountLedger')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectAccountLedger')}}",
              },
            ],
          },
          balance_direction_sort: {
            type: 'string',
            title: "{{t('account.balanceDirection')}}",
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

      // 财务信息部分
      financialInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.financialInformation')}}",
          defaultOpen: true,
        },
        properties: {
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
          opening_balance: {
            type: 'number',
            title: "{{t('account.openingBalance')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterOpeningBalance')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterOpeningBalance')}}",
              },
            ],
          },
          current_balance: {
            type: 'number',
            title: "{{t('account.currentBalance')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterCurrentBalance')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterCurrentBalance')}}",
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
              maxlength: 500,
              showWordLimit: true,
              rows: 3,
            },
          },
        },
      },
    },
  };

  // 银行账户 Schema
  const bankSchema: ISchema = {
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
          name: {
            type: 'string',
            title: "{{t('account.accountName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterAccountName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterAccountName')}}",
              },
            ],
          },
          account_ledger_id: {
            type: 'string',
            title: "{{t('account.accountLedger')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectAccountLedger')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectAccountLedger')}}",
              },
            ],
          },
          balance_direction_sort: {
            type: 'string',
            title: "{{t('account.balanceDirection')}}",
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

      // 银行信息部分
      bankInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.bankInformation')}}",
          defaultOpen: true,
        },
        properties: {
          bank_name: {
            type: 'string',
            title: "{{t('account.bankName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterBankName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterBankName')}}",
              },
            ],
          },
          bank_account_number: {
            type: 'string',
            title: "{{t('account.bankAccount')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterBankAccount')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterBankAccount')}}",
              },
            ],
          },
          branch_name: {
            type: 'string',
            title: "{{t('account.branchName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterBranchName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterBranchName')}}",
              },
            ],
          },
          bank_address: {
            type: 'string',
            title: "{{t('account.bankAddress')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterBankAddress')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterBankAddress')}}",
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
          title: "{{t('account.financialInformation')}}",
          defaultOpen: true,
        },
        properties: {
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
          opening_balance: {
            type: 'number',
            title: "{{t('account.openingBalance')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterOpeningBalance')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterOpeningBalance')}}",
              },
            ],
          },
          current_balance: {
            type: 'number',
            title: "{{t('account.currentBalance')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterCurrentBalance')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterCurrentBalance')}}",
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
    scope: {},
    useI18n,
    schema: cashSchema, // 默认使用现金账户 schema
    initialValues: {
      account_type: 'CASH',
      name: '',
      account_ledger_id: '',
      balance_direction_sort: '',
      currency_code: '',
      opening_balance: 0,
      current_balance: 0,
      remark: '',
      merchant_id: '',
      belong_type: 'NONE',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: AccountDrawerFormData) => {
    try {
      // 调用 API
      const response = await accountApi.createOrUpdateAccount(values);
      return response;
    } catch (error) {
      console.error('Account drawer form submission error:', error);
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
  const setFormValues = (values: Partial<AccountDrawerFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取账户详情
  const getAccountDetail = async (accountId: string) => {
    try {
      const response = await accountApi.getAccountDetail(accountId);
      return response;
    } catch (error) {
      console.error('Get account detail error:', error);
      throw error;
    }
  };

  // 获取账户科目列表
  const getAccountLedgerList = async () => {
    try {
      const response = await accountApi.getAccountLedgerList();
      return response;
    } catch (error) {
      console.error('Get account ledger list error:', error);
      throw error;
    }
  };

  // 获取账户设置货币
  const getAccountSetCurrency = async (accountSetId: string) => {
    try {
      const response = await accountApi.getAccountSetCurrency(accountSetId);
      return response;
    } catch (error) {
      console.error('Get account set currency error:', error);
      throw error;
    }
  };

  // 根据账户类型获取对应的 schema
  const getSchemaByAccountType = (accountType: string) => {
    return accountType === 'CASH' ? cashSchema : bankSchema;
  };

  // 更新表单 schema
  const updateSchema = (accountType: string) => {
    const newSchema = getSchemaByAccountType(accountType);
    formAPI.setSchema(newSchema);
  };

  return {
    // 组件
    Form,
    formAPI,

    // 配置
    cashSchema,
    bankSchema,

    // 方法
    handleSubmit,
    resetForm,
    validateForm,
    setFormValues,
    getFormValues,
    getAccountDetail,
    getAccountLedgerList,
    getAccountSetCurrency,
    getSchemaByAccountType,
    updateSchema,
  };
}
