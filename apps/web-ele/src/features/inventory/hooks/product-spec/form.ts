import type { ISchema } from '@igourd/common-ui';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { createProductSpec, updateProductSpec } from '../../apis/product-spec';
// 定义表单数据类型
interface ProductLabelFormData {
  product_spec_name: string;
}

export function useProductSpecForm(func) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  // 表单提交处理
  const handleSubmit = async (values: ProductLabelFormData) => {
    try {
      let response = null;
      // 调用 API
      response = await (values.id
        ? updateProductSpec({
            ...values,
          })
        : createProductSpec({
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
    title: t('product-spec.add-spec'),
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
          product_spec_name: {
            type: 'string',
            title: "{{t('product-spec.product-spec-name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('product-spec.product-spec-name')}}",
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
   drawerApi.onOpened = () => {
    if (Reflect.has(drawerApi.getData() ?? {}, 'id')) {
      drawerApi.setState({
        title: t('product-spec.edit-spec'),
      });
    }else{
      drawerApi.setState({
        title: t('product-spec.add-spec'),
      });
    }
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
