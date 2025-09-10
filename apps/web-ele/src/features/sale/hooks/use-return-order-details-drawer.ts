import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useReturnOrderDetailsDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 退货订单信息
      returnOrderInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.returnOrderInfo')}}",
          defaultOpen: true,
        },
        properties: {
          returnOrderNo: {
            type: 'string',
            title: "{{t('sales.returnOrderNo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          originalOrderNo: {
            type: 'string',
            title: "{{t('sales.originalOrderNo')}}",
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
          returnDate: {
            type: 'string',
            title: "{{t('sales.returnDate')}}",
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

      // 退货原因
      returnReason: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.returnReason')}}",
          defaultOpen: true,
        },
        properties: {
          reason: {
            type: 'string',
            title: "{{t('sales.reason')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          description: {
            type: 'string',
            title: "{{t('sales.description')}}",
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

      // 退货商品
      returnProducts: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.returnProducts')}}",
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
                returnQuantity: {
                  type: 'number',
                  title: "{{t('sales.returnQuantity')}}",
                  'x-component': 'PreviewText',
                },
                returnPrice: {
                  type: 'number',
                  title: "{{t('sales.returnPrice')}}",
                  'x-component': 'PreviewText',
                },
                returnAmount: {
                  type: 'number',
                  title: "{{t('sales.returnAmount')}}",
                  'x-component': 'PreviewText',
                },
              },
            },
          },
        },
      },

      // 退货金额
      returnAmount: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.returnAmount')}}",
          defaultOpen: true,
        },
        properties: {
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
          refundAmount: {
            type: 'number',
            title: "{{t('sales.refundAmount')}}",
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
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      returnOrderNo: '',
      originalOrderNo: '',
      customerName: '',
      returnDate: '',
      reason: '',
      description: '',
      products: [],
      totalAmount: 0,
      refundAmount: 0,
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.returnOrderDetails')}}",
    width: '80%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.processReturnOrder(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('处理退货订单失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (data: {
    title?: string;
    orderId?: string;
  }) => {
    if (data.orderId) {
      // 加载退货订单数据
      loadReturnOrderData(data.orderId);
    } else {
      formApi.reset();
    }
    drawerApi.open();
  };

  const loadReturnOrderData = async (orderId: string) => {
    try {
      const res = await SaleService.getReturnOrderDetail(orderId);
      if (String(res?.code) === 'SUCCESS') {
        formApi.setValues(res.data);
      }
    } catch (error) {
      console.error('加载退货订单数据失败:', error);
    }
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
