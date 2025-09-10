import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { InventoryService } from '../../inventory/apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useSelectProductsDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 搜索条件
      searchConditions: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.searchConditions')}}",
          defaultOpen: true,
        },
        properties: {
          productName: {
            type: 'string',
            title: "{{t('inventory.productName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterProductName')}}",
              clearable: true,
            },
          },
          skuCode: {
            type: 'string',
            title: "{{t('inventory.skuCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterSkuCode')}}",
              clearable: true,
            },
          },
          category: {
            type: 'string',
            title: "{{t('inventory.category')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectCategory')}}",
              clearable: true,
            },
          },
          brand: {
            type: 'string',
            title: "{{t('inventory.brand')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseSelectBrand')}}",
              clearable: true,
            },
          },
        },
      },

      // 商品列表
      productList: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.productList')}}",
          defaultOpen: true,
        },
        properties: {
          selectedProducts: {
            type: 'array',
            title: "{{t('inventory.selectedProducts')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
            },
            items: {
              type: 'object',
              properties: {
                productName: {
                  type: 'string',
                  title: "{{t('inventory.productName')}}",
                  'x-component': 'PreviewText',
                },
                skuCode: {
                  type: 'string',
                  title: "{{t('inventory.skuCode')}}",
                  'x-component': 'PreviewText',
                },
                stockQuantity: {
                  type: 'number',
                  title: "{{t('inventory.stockQuantity')}}",
                  'x-component': 'PreviewText',
                },
                salePrice: {
                  type: 'number',
                  title: "{{t('inventory.salePrice')}}",
                  'x-component': 'PreviewText',
                },
                selectedQuantity: {
                  type: 'number',
                  title: "{{t('inventory.selectedQuantity')}}",
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    precision: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      productName: '',
      skuCode: '',
      category: '',
      brand: '',
      selectedProducts: [],
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.selectProducts')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const selectedProducts = values.selectedProducts || [];

        if (selectedProducts.length === 0) {
          return false;
        }

        drawerApi.close();
        return true;
      } catch (error) {
        console.error('选择商品失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (title?: string) => {
    formApi.reset();
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  const loadProducts = async (searchParams: any) => {
    try {
      const res = await InventoryService.getProductList({
        ...searchParams,
        merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
      });
      if (String(res?.code) === 'SUCCESS') {
        formApi.setFieldState('selectedProducts', {
          value: res.data || [],
        });
      }
    } catch (error) {
      console.error('加载商品列表失败:', error);
    }
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
    loadProducts,
  };
}
