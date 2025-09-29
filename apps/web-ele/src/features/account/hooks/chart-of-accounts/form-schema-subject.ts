import type { ISchema } from '@igourd/common-ui';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createAccountLedgerApi,
  modifyAccountLedgerApi,
} from '../../apis/chart-of-accounts';
// 定义表单数据类型
interface ProductLabelFormData {
  product_spec_name: string;
}

export function useSubjectForm(func) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  // 表单提交处理
  const handleSubmit = async (values: ProductLabelFormData) => {
    try {
      let response = null;
      // 调用 API
      response = await (values.id
        ? modifyAccountLedgerApi({
            ...values,
          })
        : createAccountLedgerApi({
            ...values,
          }));
      func('refresh-tree');
      return response;
    } catch (error) {
      console.error('Purchase customized form submission error:', error);
      throw error;
    }
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: t('chart-of-accounts.add-account-ledger'),
    appendToMain: true,
    class: 'w-1/2',
    async onOpenChange(isOpen, val) {
      if (isOpen) {
        formAPI.reset();
        const data = drawerApi.getData();
        formAPI.setValues(data);
      }
    },
    onClosed() {
      formAPI.reset();
    },
    async onConfirm() {
      await formAPI.validate();
      drawerApi.lock();
      await handleSubmit(formAPI.values as ProductLabelFormData)
        .then(() => {
          drawerApi.close();
        })
        .finally(() => {
          drawerApi.unlock();
        });
    },
  });
  // 记账类型字典数据
  const accountingTypeOptions = [
    {
      label: t('chart-of-accounts.add-subject-form.quantity-accounting'),
      value: 'QTY',
    },
    {
      label: t('chart-of-accounts.add-subject-form.auxiliary-accounting'),
      value: 'AUX',
      childRequiredMessage: t(
        'chart-of-accounts.add-subject-form.auxiliary-accounting-required-child-message',
      ),
    },
    {
      label: t(
        'chart-of-accounts.add-subject-form.foreign-currency-accounting',
      ),
      value: 'FOREIGN',
    },
  ];
  // 表单 Schema - 基于原有的自定义字段表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
        },
        properties: {
          ledger_type: {
            type: 'string',
            title: "{{t('chart-of-accounts.add-subject-form.ledger-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder:
                "{{t('chart-of-accounts.add-subject-form.ledger-type')}}",
              clearable: true,
            },
          },
          parent_ledger: {
            type: 'string',
            title: "{{t('chart-of-accounts.add-subject-form.parent-ledger')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder:
                "{{t('chart-of-accounts.add-subject-form.parent-ledger')}}",
              clearable: true,
            },
          },
          code: {
            type: 'string',
            title: "{{t('chart-of-accounts.add-account-form.code')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('chart-of-accounts.add-account-form.code')}}",
              clearable: true,
            },
          },
          name: {
            type: 'string',
            title: "{{t('chart-of-accounts.add-account-form.name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('chart-of-accounts.add-account-form.name')}}",
              clearable: true,
            },
          },
          account_status: {
            type: 'string',
            title: "{{t('chart-of-accounts.add-subject-form.account-status')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
              placeholder:
                "{{t('chart-of-accounts.add-subject-form.account-status')}}",
              clearable: true,
            },
          },
          account_type: {
            type: 'string',
            title: "{{t('chart-of-accounts.add-subject-form.account-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox.Group',
            enum: accountingTypeOptions,
            'x-component-props': {
              placeholder:
                "{{t('chart-of-accounts.add-subject-form.account-type')}}",
              clearable: true,
            },
          },
        },
      },
      t,
    },
  };
  const loadData = async (node, resolve) => {};
  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    readPretty: false,
    initialValues: {
      product_spec_name: '',
    },
    effects() {
      // 使用 Formily 的 effects 监听表单值变化
    },
    scope: { loadData },
  });
  // 表单重置
  const resetForm = () => {
    formAPI.reset();
  };

  return {
    Form,
    formAPI,
    Drawer,
    drawerApi,
    formSchema,
    handleSubmit,
    resetForm,
  };
}
