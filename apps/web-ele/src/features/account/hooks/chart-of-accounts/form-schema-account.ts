import type { ISchema } from '@igourd/common-ui';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  getLeafLedgersApi,
  modifyAccountApi,
} from '../../apis/chart-of-accounts';
// 定义表单数据类型
interface ProductLabelFormData {
  product_spec_name: string;
}

export function useAccountForm(func) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  // 表单提交处理
  const handleSubmit = async (values: ProductLabelFormData) => {
    try {
      let response = null;
      // 调用 API
      response = await (values.id
        ? modifyAccountApi({
            ...values,
          })
        : modifyAccountApi({
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
  // 表单 Schema - 基于原有的自定义字段表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormLayout',
        properties: {
          product_spec_name: {
            type: 'string',
            title: "{{t('chart-of-accounts.account-ledger')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('chart-of-accounts.account-ledger')}}",
              clearable: true,
            },
            'x-reactions': ['{{useAsyncDataSource(getLeafLedgers)}}', {}],
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
          initial_balance: {
            type: 'string',
            title:
              "{{t('chart-of-accounts.add-account-form.initial-balance')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder:
                "{{t('chart-of-accounts.add-account-form.initial-balance')}}",
              clearable: true,
            },
          },
          end_balance: {
            type: 'string',
            title: "{{t('chart-of-accounts.add-account-form.end-balance')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder:
                "{{t('chart-of-accounts.add-account-form.end-balance')}}",
              clearable: true,
            },
          },
        },
      },
      t,
    },
  };

  const useAsyncDataSource = (service) => (field) => {
    field.loading = true;
    service(field).then(
      action?.bound((data) => {
        field.dataSource = data;
        field.loading = false;
      }),
    );
  };
  const getLeafLedgers = async (field: { props: { name: string } }) => {
    const result = await getLeafLedgersApi({
      account_set_id: '1942547124754341890',
    });
    debugger;
    return new Promise((resolve) => {
      resolve(result);
    });
  };
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
    scope: { useAsyncDataSource, getLeafLedgers },
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
