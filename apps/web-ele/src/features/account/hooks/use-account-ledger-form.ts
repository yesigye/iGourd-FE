import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface AccountLedgerFormData {
  category: string;
  code: string;
  name: string;
  parent_id: string;
  balance_direction: string;
  balance_direction_sort: string;
  features_type: Record<string, boolean>;
  is_enabled: boolean;
  account_ledger_id: string;
  account_type: string;
  belong_type: string;
  currency_code: string;
  opening_balance: number;
  remark: string;
  merchant_id: string;
  account_set_id: string;
}

export function useAccountLedgerForm() {
  const { t } = useI18n();

  // 科目表单 Schema
  const accountSchema: ISchema = {
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
          category: {
            type: 'string',
            title: "{{t('account.category')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectCategory')}}",
              options: [
                { label: "{{t('account.asset'), value: 'ASSET' },
                { label: "{{t('account.liability'), value: 'LIABILITY' },
                { label: "{{t('account.equity'), value: 'EQUITY' },
                { label: "{{t('account.revenue'), value: 'REVENUE' },
                { label: "{{t('account.expense'), value: 'EXPENSE' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectCategory')}}",
              },
            ],
          },
          code: {
            type: 'string',
            title: "{{t('account.code')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterCode')}}",
              maxlength: 20,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterCode')}}",
              },
            ],
          },
          name: {
            type: 'string',
            title: "{{t('account.name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterName')}}",
              maxlength: 100,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterName')}}",
              },
            ],
          },
          parent_id: {
            type: 'string',
            title: "{{t('account.parentAccount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectParentAccount')}}",
              clearable: true,
            },
          },
        },
      },

      // 余额方向配置
      balanceConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.balanceConfig')}}",
          defaultOpen: true,
        },
        properties: {
          balance_direction: {
            type: 'string',
            title: "{{t('account.balanceDirection')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectBalanceDirection')}}",
              options: [
                { label: "{{t('account.debit'), value: 'DEBIT' },
                { label: "{{t('account.credit'), value: 'CREDIT' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectBalanceDirection')}}",
              },
            ],
          },
          balance_direction_sort: {
            type: 'string',
            title: "{{t('account.balanceDirectionSort')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectBalanceDirectionSort')}}",
              clearable: true,
            },
          },
        },
      },

      // 功能类型配置
      featuresConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.featuresConfig')}}",
          defaultOpen: true,
        },
        properties: {
          features_type: {
            type: 'object',
            title: "{{t('account.featuresType')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Checkbox.Group',
            'x-component-props': {
              options: [
                { label: "{{t('account.cash'), value: 'CASH' },
                { label: "{{t('account.bank'), value: 'BANK' },
                { label: "{{t('account.receivable'), value: 'RECEIVABLE' },
                { label: "{{t('account.payable'), value: 'PAYABLE' },
                { label: "{{t('account.inventory'), value: 'INVENTORY' },
                { label: "{{t('account.fixedAsset'), value: 'FIXED_ASSET' },
              ],
            },
          },
        },
      },

      // 状态配置
      statusConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.statusConfig')}}",
          defaultOpen: true,
        },
        properties: {
          is_enabled: {
            type: 'boolean',
            title: "{{t('account.isEnabled')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Switch',
            'x-component-props': {
              activeValue: true,
              inactiveValue: false,
            },
          },
        },
      },
    },
  };

  // 账户表单 Schema
  const subLedgerSchema: ISchema = {
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
          code: {
            type: 'string',
            title: "{{t('account.code')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterCode')}}",
              maxlength: 20,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterCode')}}",
              },
            ],
          },
          name: {
            type: 'string',
            title: "{{t('account.name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterName')}}",
              maxlength: 100,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseEnterName')}}",
              },
            ],
          },
        },
      },

      // 账户类型配置
      accountTypeConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.accountTypeConfig')}}",
          defaultOpen: true,
        },
        properties: {
          account_type: {
            type: 'string',
            title: "{{t('account.accountType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectAccountType')}}",
              options: [
                { label: "{{t('account.cash'), value: 'CASH' },
                { label: "{{t('account.bank'), value: 'BANK' },
                { label: "{{t('account.receivable'), value: 'RECEIVABLE' },
                { label: "{{t('account.payable'), value: 'PAYABLE' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectAccountType')}}",
              },
            ],
          },
          belong_type: {
            type: 'string',
            title: "{{t('account.belongType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectBelongType')}}",
              options: [
                { label: "{{t('account.customer'), value: 'CUSTOMER' },
                { label: "{{t('account.vendor'), value: 'VENDOR' },
                { label: "{{t('account.none'), value: 'NONE' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectBelongType')}}",
              },
            ],
          },
        },
      },

      // 货币配置
      currencyConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('account.currencyConfig')}}",
          defaultOpen: true,
        },
        properties: {
          currency_code: {
            type: 'string',
            title: "{{t('account.currencyCode')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('account.pleaseSelectCurrencyCode')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.pleaseSelectCurrencyCode')}}",
              },
            ],
          },
          opening_balance: {
            type: 'number',
            title: "{{t('account.openingBalance')}}",
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
          },
        },
      },

      // 备注配置
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
    useI18n,
    scope: {},
    schema: accountSchema,
    initialValues: {
      category: 'ASSET',
      code: '',
      name: '',
      parent_id: '',
      balance_direction: '',
      balance_direction_sort: '',
      features_type: {},
      is_enabled: false,
      account_ledger_id: '',
      account_type: 'CASH',
      belong_type: 'NONE',
      currency_code: '',
      opening_balance: 0,
      remark: '',
      merchant_id: '',
      account_set_id: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: AccountLedgerFormData, ledgerType: 'account' | 'subLedger') => {
    try {
      if (ledgerType === 'account') {
        // 处理科目数据
        const payload = {
          ...values,
          features_type: Object.entries(values.features_type || {})
            .filter(([_, value]) => value)
            .map(([key, _]) => key),
        };

        const response = await accountApi.createOrUpdateAccountLedger(payload);
        return response;
      } else {
        // 处理账户数据
        const response = await accountApi.createOrUpdateAccount(values);
        return response;
      }
    } catch (error) {
      console.error('Account ledger form submission error:', error);
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
  const setFormValues = (values: Partial<AccountLedgerFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取科目选项
  const getAccountLedgerOptions = async () => {
    try {
      const response = await accountApi.getAccountLedgerOptions();
      return response;
    } catch (error) {
      console.error('Get account ledger options error:', error);
      throw error;
    }
  };

  // 获取货币选项
  const getCurrencyOptions = async () => {
    try {
      const response = await accountApi.getCurrencyOptions();
      return response;
    } catch (error) {
      console.error('Get currency options error:', error);
      throw error;
    }
  };

  return {
    // 组件
    Form,
    formAPI,

    // 配置
    accountSchema,
    subLedgerSchema,

    // 方法
    handleSubmit,
    resetForm,
    validateForm,
    setFormValues,
    getFormValues,
    getAccountLedgerOptions,
    getCurrencyOptions,
  };
}
