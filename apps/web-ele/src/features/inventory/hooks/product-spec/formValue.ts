import type { ISchema } from '@igourd/common-ui';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createProductSpecValue,
  updateProductSpecValue,
} from '../../apis/product-spec';
// 定义表单数据类型
interface ProductLabelFormData {
  product_spec_name: string;
}

export function useProductSpecValueForm(func) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  // 表单提交处理
  const handleSubmit = async (values: ProductLabelFormData) => {
    try {
      let response = null;
      // 调用 API
      response = await (values.id
        ? updateProductSpecValue({
            ...values,
          })
        : createProductSpecValue({
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
    async onOpenChange(isOpen) {
      if (isOpen) {
        formAPI.reset();
        const data = drawerApi.getData();
        // 如果存在数据，则设置表单值
        if (data.id) {
          formAPI.setFieldState('status', (f) => {
            f.visible = true;
          });

          formAPI.setValues(data);
          formAPI.setFormState({ readPretty: data?.mode === 'detail' });
        } else {
          formAPI.setFieldState('status', (f) => {
            f.visible = false;
          });
          const vals = {
            product_spec_id: data.product_spec_id,
            product_spec_name: data.product_spec_name,
          };
          formAPI.setValues(vals);
        }
      } else {
        formAPI.values = {};
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
          'hide-required-asterisk': true,
        },
        properties: {
          product_spec_name: {
            type: 'string',
            title: "{{t('product-spec.product-spec-name')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('product-spec.product-spec-name')}}",
              clearable: true,
              disabled: true,
            },
          },
          product_spec_code: {
            type: 'string',
            title: "{{t('product-spec.spec-value-code')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('product-spec.spec-value-code')}}",
              clearable: true,
              min: 0,
              max: 99,
              align: 'left',
            },
          },
          product_spec_value: {
            type: 'string',
            title: "{{t('product-spec.spec-value')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('product-spec.spec-value')}}",
              clearable: true,
            },
          },
          status: {
            type: 'string',
            title: ' ',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-decorator-props': {
              asterisk: false, // label 上显示必填的 * 号
              feedbackLayout: 'none',
            },
            'x-component-props': {
              'active-value': 'OPEN',
              'inactive-value': 'CLOSED',
            },
          },
        },
      },
      t,
    },
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
    scope: {},
  });
  // 表单重置
  const resetForm = () => {
    formAPI.reset();
  };

  drawerApi.onOpened = () => {
    if (Reflect.has(drawerApi.getData() ?? {}, 'id')) {
      drawerApi.setState({
        title: t('product-spec.edit-spec-value'),
      });
    } else {
      drawerApi.setState({
        title: t('product-spec.add-spec-value'),
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
