import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { PurchaseService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useBillSettlementDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基本信息
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.basicInfo')}}",
          defaultOpen: true,
        },
        properties: {
          purchaseOrderNo: {
            type: 'string',
            title: "{{t('inventory.purchaseOrderNo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#ff0000', fontWeight: 'bold' },
            },
          },
          vendor: {
            type: 'string',
            title: "{{t('purchase.vendor')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          settlementDate: {
            type: 'string',
            title: "{{t('purchase.settlementDate')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectSettlementDate')}}",
              format: 'YYYY-MM-DD',
              valueFormat: 'YYYY-MM-DD',
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectSettlementDate')}}",
              },
            ],
          },
          settlementAmount: {
            type: 'number',
            title: "{{t('purchase.settlementAmount')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterSettlementAmount')}}",
              min: 0,
              precision: 2,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseEnterSettlementAmount')}}",
              },
            ],
          },
        },
      },

      // 结算方式
      settlementMethod: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.settlementMethod')}}",
          defaultOpen: true,
        },
        properties: {
          paymentMethod: {
            type: 'string',
            title: "{{t('purchase.paymentMethod')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseSelectPaymentMethod')}}",
              options: [
                { label: "{{t('purchase.cash'), value: 'CASH' },
                { label: "{{t('purchase.bankTransfer'), value: 'BANK_TRANSFER' },
                { label: "{{t('purchase.check'), value: 'CHECK' },
                { label: "{{t('purchase.other'), value: 'OTHER' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseSelectPaymentMethod')}}",
              },
            ],
          },
          bankAccount: {
            type: 'string',
            title: "{{t('purchase.bankAccount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterBankAccount')}}",
              clearable: true,
            },
          },
          checkNumber: {
            type: 'string',
            title: "{{t('purchase.checkNumber')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('purchase.pleaseEnterCheckNumber')}}",
              clearable: true,
            },
          },
        },
      },

      // 其他信息
      otherInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('purchase.otherInfo')}}",
          defaultOpen: false,
        },
        properties: {
          remark: {
            type: 'string',
            title: "{{t('purchase.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('purchase.pleaseEnterRemark')}}",
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
      purchaseOrderNo: '',
      vendor: '',
      settlementDate: '',
      settlementAmount: 0,
      paymentMethod: '',
      bankAccount: '',
      checkNumber: '',
      remark: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('purchase.billSettlement')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await PurchaseService.settleBill(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('结算单据失败:', error);
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
    currentBillId?: any;
    currentRowData?: any;
  }) => {
    if (data.currentRowData) {
      formApi.setValues({
        purchaseOrderNo: data.currentRowData.purchase_order_no || '',
        vendor: data.currentRowData.vendor_name || '',
        settlementAmount: data.currentRowData.total_amount || 0,
      });
    } else {
      formApi.reset();
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
    formApi,
    openDrawer,
    closeDrawer,
  };
}

