import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useScanOrderSettleDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 订单信息
      orderInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.orderInfo')}}",
          defaultOpen: true,
        },
        properties: {
          orderNo: {
            type: 'string',
            title: "{{t('sales.orderNo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          customerName: {
            type: 'string',
            title: "{{t('sales.customerName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          orderDate: {
            type: 'string',
            title: "{{t('sales.orderDate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          totalAmount: {
            type: 'number',
            title: "{{t('sales.totalAmount')}}",
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

      // 商品列表
      productList: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.productList')}}",
          defaultOpen: true,
        },
        properties: {
          products: {
            type: 'array',
            title: "{{t('sales.products')}}",
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
                  title: "{{t('sales.productName')}}",
                  'x-component': 'PreviewText',
                },
                skuCode: {
                  type: 'string',
                  title: "{{t('sales.skuCode')}}",
                  'x-component': 'PreviewText',
                },
                quantity: {
                  type: 'number',
                  title: "{{t('sales.quantity')}}",
                  'x-component': 'PreviewText',
                },
                unitPrice: {
                  type: 'number',
                  title: "{{t('sales.unitPrice')}}",
                  'x-component': 'PreviewText',
                },
                totalAmount: {
                  type: 'number',
                  title: "{{t('sales.totalAmount')}}",
                  'x-component': 'PreviewText',
                },
              },
            },
          },
        },
      },

      // 结算信息
      settlementInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.settlementInfo')}}",
          defaultOpen: true,
        },
        properties: {
          paymentMethod: {
            type: 'string',
            title: "{{t('sales.paymentMethod')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectPaymentMethod')}}",
              clearable: true,
            },
            enum: [
              { label: "{{t('sales.cash')}}", value: 'CASH' },
              { label: "{{t('sales.card')}}", value: 'CARD' },
              { label: "{{t('sales.alipay')}}", value: 'ALIPAY' },
              { label: "{{t('sales.wechat')}}", value: 'WECHAT' },
            ],
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseSelectPaymentMethod')}}",
              },
            ],
          },
          receivedAmount: {
            type: 'number',
            title: "{{t('sales.receivedAmount')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseEnterReceivedAmount')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseEnterReceivedAmount')}}",
              },
            ],
          },
          changeAmount: {
            type: 'number',
            title: "{{t('sales.changeAmount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          discount: {
            type: 'number',
            title: "{{t('sales.discount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseEnterDiscount')}}",
              min: 0,
              max: 100,
              precision: 2,
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
      orderNo: '',
      customerName: '',
      orderDate: '',
      totalAmount: 0,
      products: [],
      paymentMethod: '',
      receivedAmount: 0,
      changeAmount: 0,
      discount: 0,
      remark: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.settlement')}}",
    width: '65%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.settleOrder(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('结算订单失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (data: {
    goodsList: any[];
    currentId: string;
  }) => {
    if (data.goodsList) {
      formApi.setValues({
        products: data.goodsList,
        totalAmount: calculateTotalAmount(data.goodsList),
        receivedAmount: calculateTotalAmount(data.goodsList),
        changeAmount: 0,
      });
    } else {
      formApi.reset();
    }
    drawerApi.open();
  };

  const calculateTotalAmount = (products: any[]) => {
    return products.reduce((total, product) => {
      return total + (product.quantity * product.unitPrice);
    }, 0);
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
  };
}
