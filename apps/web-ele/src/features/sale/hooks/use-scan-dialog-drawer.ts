import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useScanDialogDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 扫码信息
      scanInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.scanInfo')}}",
          defaultOpen: true,
        },
        properties: {
          barcode: {
            type: 'string',
            title: "{{t('inventory.barcode')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseScanOrEnterBarcode')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseScanOrEnterBarcode')}}",
              },
            ],
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
          stockQuantity: {
            type: 'number',
            title: "{{t('inventory.stockQuantity')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
        },
      },

      // 商品信息
      productInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('inventory.productInfo')}}",
          defaultOpen: true,
        },
        properties: {
          quantity: {
            type: 'number',
            title: "{{t('inventory.quantity')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterQuantity')}}",
              min: 1,
              precision: 0,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterQuantity')}}",
              },
            ],
          },
          unitPrice: {
            type: 'number',
            title: "{{t('inventory.unitPrice')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('inventory.pleaseEnterUnitPrice')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('inventory.pleaseEnterUnitPrice')}}",
              },
            ],
          },
          totalAmount: {
            type: 'number',
            title: "{{t('inventory.totalAmount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#ff0000', fontWeight: 'bold' },
            },
          },
        },
      },

      // 备注信息
      remarkInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.remarkInfo')}}",
          defaultOpen: false,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('sales.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('sales.pleaseEnterRemark')}}",
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
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      barcode: '',
      productName: '',
      skuCode: '',
      stockQuantity: 0,
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      remark: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.scanDialog')}}",
    width: '799px',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.addScannedProduct(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('添加扫码商品失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (data: {
    goodsList?: any;
    customerInfo?: any;
    guiderInfo?: object;
  }) => {
    formApi.reset();
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  const scanBarcode = async (barcode: string) => {
    try {
      const res = await SaleService.getProductByBarcode(barcode);
      if (String(res?.code) === 'SUCCESS') {
        formApi.setValues({
          barcode: barcode,
          productName: res.data.productName || '',
          skuCode: res.data.skuCode || '',
          stockQuantity: res.data.stockQuantity || 0,
          quantity: 1,
          unitPrice: res.data.salePrice || 0,
          totalAmount: res.data.salePrice || 0,
        });
      }
    } catch (error) {
      console.error('扫码获取商品信息失败:', error);
    }
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
    scanBarcode,
  };
}
