import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useEditSkuDetailsDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // SKU 基本信息
      skuInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.skuInfo')}}",
          defaultOpen: true,
        },
        properties: {
          skuCode: {
            type: 'string',
            title: "{{t('inventory.skuCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          productName: {
            type: 'string',
            title: "{{t('inventory.productName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          skuName: {
            type: 'string',
            title: "{{t('inventory.skuName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterSkuName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterSkuName')}}",
              },
            ],
          },
          barcode: {
            type: 'string',
            title: "{{t('inventory.barcode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterBarcode')}}",
              clearable: true,
            },
          },
        },
      },

      // 规格信息
      specInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.specInfo')}}",
          defaultOpen: true,
        },
        properties: {
          specifications: {
            type: 'array',
            title: "{{t('inventory.specifications')}}",
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
                specName: {
                  type: 'string',
                  title: "{{t('inventory.specName')}}",
                  'x-component': 'Input',
                },
                specValue: {
                  type: 'string',
                  title: "{{t('inventory.specValue')}}",
                  'x-component': 'Input',
                },
              },
            },
          },
        },
      },

      // 价格信息
      priceInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.priceInfo')}}",
          defaultOpen: true,
        },
        properties: {
          costPrice: {
            type: 'number',
            title: "{{t('inventory.costPrice')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterCostPrice')}}",
              min: 0,
              precision: 2,
            },
          },
          salePrice: {
            type: 'number',
            title: "{{t('inventory.salePrice')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterSalePrice')}}",
              min: 0,
              precision: 2,
            },
          },
          marketPrice: {
            type: 'number',
            title: "{{t('inventory.marketPrice')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterMarketPrice')}}",
              min: 0,
              precision: 2,
            },
          },
        },
      },

      // 库存信息
      stockInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.stockInfo')}}",
          defaultOpen: true,
        },
        properties: {
          stockQuantity: {
            type: 'number',
            title: "{{t('inventory.stockQuantity')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterStockQuantity')}}",
              min: 0,
              precision: 0,
            },
          },
          minStock: {
            type: 'number',
            title: "{{t('inventory.minStock')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterMinStock')}}",
              min: 0,
              precision: 0,
            },
          },
          maxStock: {
            type: 'number',
            title: "{{t('inventory.maxStock')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterMaxStock')}}",
              min: 0,
              precision: 0,
            },
          },
        },
      },

      // 其他信息
      otherInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.otherInfo')}}",
          defaultOpen: false,
        },
        properties: {
          weight: {
            type: 'number',
            title: "{{t('inventory.weight')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterWeight')}}",
              min: 0,
              precision: 2,
            },
          },
          volume: {
            type: 'number',
            title: "{{t('inventory.volume')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterVolume')}}",
              min: 0,
              precision: 2,
            },
          },
          remark: {
            type: 'string',
            title: "{{t('inventory.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('inventory.pleaseEnterRemark')}}",
              maxlength: 500,
              showWordLimit: true,
              rows: 3,
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    initialValues: {
      skuCode: '',
      productName: '',
      skuName: '',
      barcode: '',
      specifications: [],
      costPrice: 0,
      salePrice: 0,
      marketPrice: 0,
      stockQuantity: 0,
      minStock: 0,
      maxStock: 0,
      weight: 0,
      volume: 0,
      remark: '',
    },
    scope: {},
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('inventory.skuDetails')}}",
    width: '50%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await inventoryApi.update(data.id, data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('更新SKU详情失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formAPI.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (data: {
    title?: string;
    skuData?: any;
    viewMode?: 'detail' | 'edit' | 'add';
  }) => {
    if (data.skuData) {
      formAPI.setValues(data.skuData);
    } else {
      formAPI.reset();
    }
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formAPI,
    openDrawer,
    closeDrawer,
  };
}
