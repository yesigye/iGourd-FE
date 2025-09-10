import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useScanCashSettlementDrawer() {
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
              style: { color: '#ff0000', fontWeight: 'bold', fontSize: '18px' },
            },
          },
        },
      },

      // 扫码支付
      scanPayment: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.scanPayment')}}",
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
              { label: "{{t('sales.alipay'), value: 'ALIPAY' },
              { label: "{{t('sales.wechat'), value: 'WECHAT' },
              { label: "{{t('sales.unionPay'), value: 'UNIONPAY' },
            ],
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseSelectPaymentMethod')}}",
              },
            ],
          },
          paymentAmount: {
            type: 'number',
            title: "{{t('sales.paymentAmount')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseEnterPaymentAmount')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseEnterPaymentAmount')}}",
              },
            ],
          },
          qrCode: {
            type: 'string',
            title: "{{t('sales.qrCode')}}",
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

      // 支付状态
      paymentStatus: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.paymentStatus')}}",
          defaultOpen: true,
        },
        properties: {
          status: {
            type: 'string',
            title: "{{t('sales.status')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          transactionId: {
            type: 'string',
            title: "{{t('sales.transactionId')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          paymentTime: {
            type: 'string',
            title: "{{t('sales.paymentTime')}}",
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
      paymentMethod: '',
      paymentAmount: 0,
      qrCode: '',
      status: '',
      transactionId: '',
      paymentTime: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.scanCashSettlement')}}",
    width: '100%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.processScanPayment(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('处理扫码支付失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (data: {
    totalAmount?: number;
    orderData?: any;
  }) => {
    if (data.orderData) {
      formApi.setValues({
        orderNo: data.orderData.orderNo || '',
        customerName: data.orderData.customerName || '',
        orderDate: data.orderData.orderDate || '',
        totalAmount: data.totalAmount || 0,
        paymentMethod: '',
        paymentAmount: data.totalAmount || 0,
        qrCode: '',
        status: '',
        transactionId: '',
        paymentTime: '',
      });
    } else {
      formApi.reset();
    }
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  const generateQRCode = async (paymentMethod: string, amount: number) => {
    try {
      const res = await SaleService.generatePaymentQRCode({
        paymentMethod,
        amount,
        merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
      });
      if (String(res?.code) === 'SUCCESS') {
        formApi.setFieldState('qrCode', {
          value: res.data.qrCode,
        });
      }
    } catch (error) {
      console.error('生成支付二维码失败:', error);
    }
  };

  const checkPaymentStatus = async (transactionId: string) => {
    try {
      const res = await SaleService.checkPaymentStatus(transactionId);
      if (String(res?.code) === 'SUCCESS') {
        formApi.setValues({
          status: res.data.status,
          paymentTime: res.data.paymentTime,
        });
      }
    } catch (error) {
      console.error('查询支付状态失败:', error);
    }
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
    generateQRCode,
    checkPaymentStatus,
  };
}
