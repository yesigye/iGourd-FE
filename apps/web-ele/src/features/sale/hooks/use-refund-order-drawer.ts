import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useRefundOrderDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 退款订单信息
      refundOrderInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.refundOrderInfo')}}",
          defaultOpen: true,
        },
        properties: {
          refundOrderNo: {
            type: 'string',
            title: "{{t('sales.refundOrderNo')}}",
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
          refundDate: {
            type: 'string',
            title: "{{t('sales.refundDate')}}",
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

      // 退款信息
      refundInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.refundInfo')}}",
          defaultOpen: true,
        },
        properties: {
          refundAmount: {
            type: 'number',
            title: "{{t('sales.refundAmount')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseEnterRefundAmount')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseEnterRefundAmount')}}",
              },
            ],
          },
          refundMethod: {
            type: 'string',
            title: "{{t('sales.refundMethod')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectRefundMethod')}}",
              clearable: true,
            },
            enum: [
              { label: "{{t('sales.cashRefund')}}", value: 'CASH' },
              { label: "{{t('sales.cardRefund')}}", value: 'CARD' },
              { label: "{{t('sales.accountRefund')}}", value: 'ACCOUNT' },
            ],
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseSelectRefundMethod')}}",
              },
            ],
          },
          refundReason: {
            type: 'string',
            title: "{{t('sales.refundReason')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('sales.pleaseEnterRefundReason')}}",
              maxlength: 500,
              showWordLimit: true,
              rows: 3,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseEnterRefundReason')}}",
              },
            ],
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      refundOrderNo: '',
      originalOrderNo: '',
      customerName: '',
      refundDate: '',
      refundAmount: 0,
      refundMethod: '',
      refundReason: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.refundOrder')}}",
    width: '70%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.createRefundOrder(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('创建退款订单失败:', error);
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
      // 加载订单数据
      loadOrderData(data.orderId);
    } else {
      formApi.reset();
    }
    drawerApi.open();
  };

  const loadOrderData = async (orderId: string) => {
    try {
      const res = await SaleService.getOrderDetail(orderId);
      if (String(res?.code) === 'SUCCESS') {
        formApi.setValues({
          refundOrderNo: '',
          originalOrderNo: res.data.orderNo || '',
          customerName: res.data.customerName || '',
          refundDate: new Date().toISOString().split('T')[0],
          refundAmount: res.data.totalAmount || 0,
          refundMethod: '',
          refundReason: '',
        });
      }
    } catch (error) {
      console.error('加载订单数据失败:', error);
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
