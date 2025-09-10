import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useReturnedTotalSettlementDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 退货汇总信息
      returnedInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.returnedInfo')}}",
          defaultOpen: true,
        },
        properties: {
          totalReturnedAmount: {
            type: 'number',
            title: "{{t('sales.totalReturnedAmount')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#ff0000', fontWeight: 'bold' },
            },
          },
          returnedOrderCount: {
            type: 'number',
            title: "{{t('sales.returnedOrderCount')}}",
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
            title: "{{t('sales.settlementDate')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectSettlementDate')}}",
              clearable: true,
              format: 'YYYY-MM-DD',
              valueFormat: 'YYYY-MM-DD',
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseSelectSettlementDate')}}",
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
          title: "{{t('sales.settlementMethod')}}",
          defaultOpen: true,
        },
        properties: {
          settlementType: {
            type: 'string',
            title: "{{t('sales.settlementType')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectSettlementType')}}",
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
                message: "{{t('sales.pleaseSelectSettlementType')}}",
              },
            ],
          },
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
      totalReturnedAmount: 0,
      returnedOrderCount: 0,
      settlementDate: '',
      settlementType: '',
      refundAmount: 0,
      remark: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.refundSettlement')}}",
    width: '500px',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.createRefundSettlement(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('创建退款结算失败:', error);
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
    compuredReturnedinfo?: any;
    returnOrderList?: any[];
  }) => {
    if (data.compuredReturnedinfo) {
      formApi.setValues({
        totalReturnedAmount: data.compuredReturnedinfo.totalAmount || 0,
        returnedOrderCount: data.returnOrderList?.length || 0,
        settlementDate: '',
        settlementType: '',
        refundAmount: data.compuredReturnedinfo.totalAmount || 0,
        remark: '',
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
