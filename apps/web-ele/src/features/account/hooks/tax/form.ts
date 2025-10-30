import type { ISchema } from '@igourd/common-ui';

import { action, useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { createTaxApi, updateTaxApi } from '@@/account/apis';

import { useLanguage } from '#/hooks';

// 定义表单数据类型
interface ProductLabelFormData {
  product_spec_name: string;
}

export function useTaxForm(func) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  // 表单提交处理
  const handleSubmit = async (values: ProductLabelFormData) => {
    try {
      let response = null;
      // 调用 API
      response = await (values.id
        ? updateTaxApi({
            ...values,
          })
        : createTaxApi({
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
    title: t('tax.add-tax'),
    appendToMain: true,
    class: 'w-1/2',
    contentClass: 'bg-muted',
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
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('tax.tax-name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('tax.tax-name')}}",
              clearable: true,
            },
          },
          tax_type: {
            type: 'string',
            title: "{{t('tax.tax-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('tax.tax-type')}}",
              clearable: true,
            },
            'x-reactions': ['{{useAsyncDataSource(loadTaxType)}}', {}],
          },
          taxation_office_tax_type: {
            type: 'string',
            title: "{{t('tax.taxation-office-tax-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('tax.taxation-office-tax-type')}}",
              clearable: true,
            },
            'x-reactions': ['{{useAsyncDataSource(loadTaxationType)}}', {}],
          },
          calculation_type: {
            type: 'string',
            title: "{{t('tax.calculation-type')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('tax.calculation-type')}}",
              clearable: true,
            },
            'x-reactions': ['{{useAsyncDataSource(loadCalculationType)}}', {}],
          },
          percentage: {
            type: 'string',
            title: "{{t('tax.percentage')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('tax.percentage')}}",
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
  const loadTaxType = async (field: { props: { name: string } }) => {
    const enumData = await useLanguage('basics.accounting.tax-type-enum');
    return new Promise((resolve) => {
      resolve(enumData);
    });
  };
  const loadTaxationType = async (field: { props: { name: string } }) => {
    const enumData = await useLanguage(
      'basics.accounting.taxation-office-tax-type-enum',
    );
    return new Promise((resolve) => {
      resolve(enumData);
    });
  };
  const loadCalculationType = async (field: { props: { name: string } }) => {
    const enumData = await useLanguage(
      'basics.accounting.tax-calculation-type-enum',
    );
    return new Promise((resolve) => {
      resolve(enumData);
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
    scope: {
      useAsyncDataSource,
      loadTaxType,
      loadTaxationType,
      loadCalculationType,
    },
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
