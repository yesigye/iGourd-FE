import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { accountApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface AccountManagementFormData {
  account_type: string;
  name: string;
  bank_name: string;
  bank_account_number: string;
  branch_name: string;
  bank_address: string;
  currency_code: string;
  balance: string;
  remark: string;
  merchant_id: string;
}

export function useAccountManagementForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的账户管理表单结构
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
          account_type: {
            type: 'string',
            title: "{{t('account.accountTypes')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                { label: "{{t('account.bankAccount')}}", value: 'BANK' },
                { label: "{{t('account.cashAccount')}}", value: 'CASH' },
                { label: "{{t('account.creditCard')}}", value: 'CREDIT_CARD' },
                { label: "{{t('account.other')}}", value: 'OTHER' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.enterBookkeepingType')}}",
              },
            ],
            'x-reactions': [
              {
                dependencies: ['.'],
                fulfill: {
                  state: {
                    'bankInfo.visible': '{{$self.value === "BANK"}}',
                  },
                },
              },
            ],
          },
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
              maxlength: 64,
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.enterAccountName')}}",
              },
            ],
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
        'x-reactions': [
          {
            dependencies: ['account_type'],
            fulfill: {
              state: {
                visible: '{{$deps[0] === "BANK"}}',
              },
            },
          },
        ],
        properties: {
          bank_name: {
            type: 'string',
            title: "{{t('account.bank_name')}}",
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
                message: "{{t('account.enterBankName')}}",
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
                message: "{{t('account.enterBankAccount')}}",
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
                message: "{{t('account.enterBranchName')}}",
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
                message: "{{t('account.enterBankAddress')}}",
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
                message: "{{t('account.enterCurrency')}}",
              },
            ],
          },
          balance: {
            type: 'string',
            title: "{{t('account.balance')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('account.pleaseEnterBalance')}}",
              type: 'number',
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('account.enterBalance')}}",
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
              style: { width: '692px' },
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    schema: formSchema,
    scope: {},
    useI18n,
    initialValues: {
      account_type: '',
      name: '',
      bank_name: '',
      bank_account_number: '',
      branch_name: '',
      bank_address: '',
      currency_code: '',
      balance: '',
      remark: '',
      merchant_id: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: AccountManagementFormData) => {
    try {
      // 调用 API
      const response = await accountApi.createOrUpdateAccountManagement(values);
      return response;
    } catch (error) {
      console.error('Account management form submission error:', error);
      throw error;
    }
  };
  const [Drawer, drawerApi] = useIgourdDrawer({
    onOpenChange(isOpen) {
      if (isOpen) {
        formAPI.setValues(drawerApi.getData() || {});
      }
    },
  });
  // 表单重置
  const resetForm = () => {
    formAPI.reset();
  };

  // 表单验证
  const validateForm = async () => {
    return await formAPI.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<AccountManagementFormData>) => {
    formAPI.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values;
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

  return {
    // 组件
    Form,
    formAPI,
    Drawer,
    // 配置
    formSchema,

    // 方法
    handleSubmit,
    resetForm,
    validateForm,
    setFormValues,
    getFormValues,
    getCurrencyList,
  };
}
