import type { ISchema } from '@igourd/common-ui';
import { ref } from 'vue';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createLabelBind,
  inventoryProductProfilePageList,
  updateProductLabel,
  getProductlabelProductPage,
} from '@@/inventory/apis';

// 定义表单数据类型
interface ProductLabelFormData {
  merchant_id: string;
  name: string;
}

export function useProductLabelForm(func) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const detailData = ref();

  // 表单提交处理
  const handleSubmit = async (formData: ProductLabelFormData) => {
    try {
      let response = null;
      const productProfileIds = formData.product_list.map((item) => item.id);
      // 增加标签和绑定商品
      const params = {
        product_label_create_vo: {
          name: formData.name,
          merchant_id: currentLoginUserApp.owner_id,
        },
        product_label_product_bind_vo: {
          merchant_id: currentLoginUserApp.owner_id,
          product_profile_ids: productProfileIds,
        },
      };
      // 调用 API
      response = await (formData.id
        ? updateProductLabel({
            ...params,
          })
        : createLabelBind({
            ...params,
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
    class: 'w-1/2',
    contentClass: 'bg-muted',
    async onOpenChange(isOpen) {
      if (isOpen) {
        formAPI.reset();
        const data = drawerApi.getData();
        detailData.value = data;
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
            title: "{{t('product-label.product-choose')}}",
            'x-decorator': 'FormItem',
            'x-component': 'TransferTable',
            'x-component-props': {
              rowKey: 'id',
              columns: [
                {
                  label: "{{t('product-label.major-name')}}",
                  prop: 'major_name',
                  filter: { type: 'input' },
                },
                {
                  label: "{{t('product-label.product-code')}}",
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
                  label: "{{t('product-label.vendor')}}",
                  type: 'remote-select',
                  remoteMethod: '{{ actions.searchVendors }}',
                },
                {
                  key: 'brand',
                  label: "{{t('product-label.brand')}}",
                  type: 'select',
                  options: [{ label: 'Nike', value: 'nike' }],
                },
              ],
              searchPlaceholder: "{{t('product-label.filters-placeholder')}}",
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
        fetchProducts: inventoryProductProfilePageList,
        fetchSelectedProducts: (params) => {
          if(!detailData.value.id){
            return ;
          }
          params.product_label_id = detailData.value.id;
          
          return getProductlabelProductPage(params);
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
