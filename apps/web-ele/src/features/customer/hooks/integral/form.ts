import type { ISchema } from '@igourd/common-ui';
import { ref } from 'vue';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createLabelBind,
  inventoryProductProfilePageList,
  updateProductLabel,
  getProductList,
  getProductlabelProductPage,
} from '@@/inventory/apis';

// 定义表单数据类型
interface ProductLabelFormData {
  merchant_id: string;
  name: string;
}

export function useSelectProductForm(func) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const detailData = ref();

  // 表单提交处理
  const handleSubmit = async (formData: ProductLabelFormData) => {
    try {
      func('confirm',formData);
      return null;
    } catch (error) {
      console.error('Purchase customized form submission error:', error);
      throw error;
    }
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "选择商品",
    appendToMain: true,
    class: 'w-2/3',
    async onOpenChange(isOpen) {
      if (isOpen) {
        formAPI.reset();
        let data = drawerApi.getData();
        if(!Array.isArray(data)){
          data = []
        }
        detailData.value = data;
        formAPI.setValues({
          product_list:data
        });
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
          labelCol: 2,
          wrapperCol: 22,
        },
        properties: {
          product_list: {
            type: 'array',
            title: "{{t('integral.product-choose')}}",
            'x-decorator': 'FormItem',
            'x-component': 'TransferTable',
            'x-component-props': {
              layout:"top-bottom",
              rowKey: 'id',
              columns: [
                {
                  label: "{{t('integral.major-name')}}",
                  prop: 'major_name',
                  filter: { type: 'input' },
                },
                {
                  label: "{{t('integral.product-code')}}",
                  prop: 'product_code',
                },
                {
                  label: "{{t('integral.sku-barcode')}}",
                  prop: 'sku_barcode',
                },
                {
                  label: "{{t('integral.product-unit-name')}}",
                  prop: 'product_unit_name',
                },
                {
                  label: "{{t('integral.selling-price')}}",
                  prop: 'selling_price',
                },
              ],
              fetchLeft: '{{ actions.fetchProducts }}',
              //fetchRight: '{{ actions.fetchSelectedProducts }}',
              fetchByIds: '{{ actions.fetchProductsByIds }}',
              getAllIdsUnderFilter: '{{ actions.getAllIdsUnderFilter }}',
              topFilterFields: [
                {
                  key: 'vendor',
                  label: "{{t('integral.vendor')}}",
                  type: 'remote-select',
                  remoteMethod: '{{ actions.searchVendors }}',
                },
                {
                  key: 'brand',
                  label: "{{t('integral.brand')}}",
                  type: 'select',
                  options: [{ label: 'Nike', value: 'nike' }],
                },
              ],
              searchPlaceholder: "{{t('integral.filters-placeholder')}}",
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
    initialValues: {},
    effects() {
      // 使用 Formily 的 effects 监听表单值变化
    },
    scope: {
      loadData,
      actions: {
        fetchProducts: getProductList,
        fetchSelectedProducts: (params) => {
          params.product_label_id = detailData.value.id;
          getProductlabelProductPage(params);
          return [{}];
        },
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
