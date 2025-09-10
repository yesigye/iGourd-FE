import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function usePrintOrderReceiptDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 打印设置
      printSettings: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.printSettings')}}",
          defaultOpen: true,
        },
        properties: {
          printer: {
            type: 'string',
            title: "{{t('sales.printer')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectPrinter')}}",
              clearable: true,
            },
            enum: [],
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseSelectPrinter')}}",
              },
            ],
          },
          printCopies: {
            type: 'number',
            title: "{{t('sales.printCopies')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseEnterPrintCopies')}}",
              min: 1,
              max: 10,
              precision: 0,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseEnterPrintCopies')}}",
              },
            ],
          },
          printFormat: {
            type: 'string',
            title: "{{t('sales.printFormat')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectPrintFormat')}}",
              clearable: true,
            },
            enum: [
              { label: "{{t('sales.receipt')}}", value: 'RECEIPT' },
              { label: "{{t('sales.invoice')}}", value: 'INVOICE' },
              { label: "{{t('sales.detail')}}", value: 'DETAIL' },
            ],
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseSelectPrintFormat')}}",
              },
            ],
          },
        },
      },

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

      // 打印预览
      printPreview: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.printPreview')}}",
          defaultOpen: true,
        },
        properties: {
          previewContent: {
            type: 'string',
            title: "{{t('sales.previewContent')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('sales.printPreviewContent')}}",
              rows: 10,
              readonly: true,
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
      printer: '',
      printCopies: 1,
      printFormat: 'RECEIPT',
      orderNo: '',
      customerName: '',
      orderDate: '',
      totalAmount: 0,
      previewContent: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.printOrderReceipt')}}",
    width: '45%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.printOrderReceipt(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('打印订单收据失败:', error);
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
          orderNo: res.data.orderNo || '',
          customerName: res.data.customerName || '',
          orderDate: res.data.orderDate || '',
          totalAmount: res.data.totalAmount || 0,
          previewContent: generatePreviewContent(res.data),
        });
      }
    } catch (error) {
      console.error('加载订单数据失败:', error);
    }
  };

  const generatePreviewContent = (orderData: any) => {
    return `
订单号: ${orderData.orderNo || ''}
客户: ${orderData.customerName || ''}
日期: ${orderData.orderDate || ''}
总金额: ${orderData.totalAmount || 0}
    `.trim();
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
