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
        const data = drawerApi.getData();
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
            title: '商品选择',
            'x-decorator': 'FormItem',
            'x-component': 'TransferTable',
            'x-component-props': {
              layout:"top-bottom",
              rowKey: 'id',
              columns: [
                {
                  label: '商品名称',
                  prop: 'major_name',
                  filter: { type: 'input' },
                },
                {
                  label: '商品代码',
                  prop: 'product_code',
                },
                {
                  label: 'sku编码',
                  prop: 'sku_barcode',
                },
                {
                  label: '单位',
                  prop: 'product_unit_name',
                },
                {
                  label: '售卖价格',
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
    initialValues: {},
    effects() {
      // 使用 Formily 的 effects 监听表单值变化
    },
    scope: {
      loadData,
      actions: {
        fetchProducts: getProductList,
        fetchSelectedProducts: (params) => {
          params.product_label_id = detailData.id;
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
