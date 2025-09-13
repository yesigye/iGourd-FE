import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useTakeDetailDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 取货信息
      takeInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.takeInfo')}}",
          defaultOpen: true,
        },
        properties: {
          takeNo: {
            type: 'string',
            title: "{{t('sales.takeNo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
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
          takeDate: {
            type: 'string',
            title: "{{t('sales.takeDate')}}",
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

      // 取货商品
      takeProducts: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.takeProducts')}}",
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
                takeQuantity: {
                  type: 'number',
                  title: "{{t('sales.takeQuantity')}}",
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

      // 取货状态
      takeStatus: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.takeStatus')}}",
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
          takePerson: {
            type: 'string',
            title: "{{t('sales.takePerson')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          remark: {
            type: 'string',
            title: "{{t('sales.remark')}}",
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
      takeNo: '',
      orderNo: '',
      customerName: '',
      takeDate: '',
      products: [],
      status: '',
      takePerson: '',
      remark: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.takeDetail')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.updateTakeDetail(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('更新取货详情失败:', error);
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

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
  };
}
