import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { SaleService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useSaleOrderDetailDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 订单基本信息
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
        },
      },

      // 商品信息
      productInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.productInfo')}}",
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
                quantity: {
                  type: 'number',
                  title: "{{t('sales.quantity')}}",
                  'x-component': 'PreviewText',
                },
                price: {
                  type: 'number',
                  title: "{{t('sales.price')}}",
                  'x-component': 'PreviewText',
                },
                total: {
                  type: 'number',
                  title: "{{t('sales.total')}}",
                  'x-component': 'PreviewText',
                },
              },
            },
          },
        },
      },

      // 金额信息
      amountInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.amountInfo')}}",
          defaultOpen: true,
        },
        properties: {
          subtotal: {
            type: 'number',
            title: "{{t('sales.subtotal')}}",
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
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          tax: {
            type: 'number',
            title: "{{t('sales.tax')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          total: {
            type: 'number',
            title: "{{t('sales.total')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#f56c6c', fontWeight: 'bold' },
            },
          },
        },
      },

      // 其他信息
      otherInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.otherInfo')}}",
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
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          createTime: {
            type: 'string',
            title: "{{t('sales.createTime')}}",
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
      status: '',
      products: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      remark: '',
      createTime: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.orderDetail')}}",
    width: '86%',
    onOpenChange: async (isOpen) => {
      if (isOpen) {
        const data = drawerApi.getData();
        if (data?.currentId) {
          try {
            const res = await SaleService.getOrderDetail({
              id: data.currentId,
              merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
            });
            if (String(res?.code) === 'SUCCESS') {
              formApi.setValues(res.data);
            }
          } catch (error) {
            console.error('获取订单详情失败:', error);
          }
        }
      }
    },
  });

  const openDrawer = (currentId: string) => {
    drawerApi.setData({ currentId }).open();
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

