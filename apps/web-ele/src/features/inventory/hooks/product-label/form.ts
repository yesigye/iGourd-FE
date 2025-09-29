import type { ISchema } from '@igourd/common-ui';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  createProductLabel,
  updateProductLabel,
  wareHouseProductSearch,
} from '@@/inventory/apis';

// 定义表单数据类型
interface ProductLabelFormData {
  merchant_id: string;
  name: string;
}

export function useProductLabelForm(func) {
  const { t } = useI18n();
  // 表单提交处理
  const handleSubmit = async (values: ProductLabelFormData) => {
    try {
      let response = null;
      // 调用 API
      response = await (values.id
        ? updateProductLabel({
            ...values,
          })
        : createProductLabel({
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
    title: t('product-label.add-product-label'),
    appendToMain: true,
    class: 'w-full',
    async onOpenChange(isOpen) {
      if (isOpen) {
        formAPI.reset();
        const data = drawerApi.getData();
        formAPI.setValues(data);
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
          labelCol: 4,
          wrapperCol: 20,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('product-label.product-label-name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('product-label.please-enter-label-name')}}",
              clearable: true,
            },
          },
          product_list: {
            type: 'array',
            title: '商品选择',
            'x-decorator': 'FormItem',
            'x-component': 'TransferTable',
            'x-component-props': {
              rowKey: 'id',
              columns: [
                {
                  label: 'Product',
                  prop: 'major_name',
                  filter: { type: 'input' },
                },
                {
                  label: 'Product Code',
                  prop: 'product_code',
                  width: 140,
                  filter: {
                    type: 'select',
                    options: [
                      { label: 'A', value: 'A' },
                      { label: 'B', value: 'B' },
                    ],
                  },
                },
              ],
              fetchLeft: '{{ actions.fetchProducts }}',
              fetchRight: '{{ actions.fetchSelectedProducts }}',
              fetchByIds: '{{ actions.fetchProductsByIds }}',
              getAllIdsUnderFilter: '{{ actions.getAllIdsUnderFilter }}',
              topFilterFields: [
                {
                  key: 'vendor',
                  label: '供应商',
                  type: 'remote-select',
                  remoteMethod: '{{ actions.searchVendors }}',
                },
                {
                  key: 'brand',
                  label: '品牌',
                  type: 'select',
                  options: [{ label: 'Nike', value: 'nike' }],
                },
              ],
              searchPlaceholder: '输入采购单号/供应商/商品名',
              excludeSelectedFromLeft: true,
            },
          },
        },
      },
    },
  };
  const loadData = async (node, resolve) => {};
  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    readPretty: false,
    initialValues: {
      name: '',
    },
    effects() {
      // 使用 Formily 的 effects 监听表单值变化
    },
    scope: {
      loadData,
      actions: {
        fetchProducts: wareHouseProductSearch,
        fetchSelectedProducts: () => [],
        fetchProductsByIds: () => [],
        getAllIdsUnderFilter: () => [],
        searchVendors: () => [],
      },
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
