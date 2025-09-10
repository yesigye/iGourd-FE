import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { saleApi } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useOrderContentDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 订单筛选
      orderFilter: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.orderFilter')}}",
          defaultOpen: true,
        },
        properties: {
          orderStatus: {
            type: 'string',
            title: "{{t('sales.orderStatus')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectOrderStatus')}}",
              clearable: true,
            },
            enum: [
              { label: "{{t('sales.pending')}}", value: 'PENDING' },
              { label: "{{t('sales.confirmed')}}", value: 'CONFIRMED' },
              { label: "{{t('sales.shipped')}}", value: 'SHIPPED' },
              { label: "{{t('sales.delivered')}}", value: 'DELIVERED' },
              { label: "{{t('sales.cancelled')}}", value: 'CANCELLED' },
            ],
          },
          orderDate: {
            type: 'string',
            title: "{{t('sales.orderDate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectOrderDate')}}",
              clearable: true,
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: t('sales.startDate'),
              endPlaceholder: t('sales.endDate'),
            },
          },
          customerName: {
            type: 'string',
            title: "{{t('sales.customerName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseEnterCustomerName')}}",
              clearable: true,
            },
          },
          orderNo: {
            type: 'string',
            title: "{{t('sales.orderNo')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseEnterOrderNo')}}",
              clearable: true,
            },
          },
        },
      },

      // 订单列表
      orderList: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.orderList')}}",
          defaultOpen: true,
        },
        properties: {
          orders: {
            type: 'array',
            title: "{{t('sales.orders')}}",
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
                orderNo: {
                  type: 'string',
                  title: "{{t('sales.orderNo')}}",
                  'x-component': 'PreviewText',
                },
                customerName: {
                  type: 'string',
                  title: "{{t('sales.customerName')}}",
                  'x-component': 'PreviewText',
                },
                orderDate: {
                  type: 'string',
                  title: "{{t('sales.orderDate')}}",
                  'x-component': 'PreviewText',
                },
                totalAmount: {
                  type: 'number',
                  title: "{{t('sales.totalAmount')}}",
                  'x-component': 'PreviewText',
                },
                status: {
                  type: 'string',
                  title: "{{t('sales.status')}}",
                  'x-component': 'PreviewText',
                },
                actions: {
                  type: 'void',
                  title: "{{t('common.actions')}}",
                  'x-component': 'Space',
                  'x-component-props': {
                    children: [
                      {
                        type: 'void',
                        'x-component': 'ElButton',
                        'x-component-props': {
                          type: 'primary',
                          size: 'small',
                          children: t('common.view'),
                        },
                      },
                      {
                        type: 'void',
                        'x-component': 'ElButton',
                        'x-component-props': {
                          type: 'success',
                          size: 'small',
                          children: t('common.edit'),
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      // 订单统计
      orderStatistics: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.orderStatistics')}}",
          defaultOpen: true,
        },
        properties: {
          totalOrders: {
            type: 'number',
            title: "{{t('sales.totalOrders')}}",
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
          averageAmount: {
            type: 'number',
            title: "{{t('sales.averageAmount')}}",
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
      orderStatus: '',
      orderDate: '',
      customerName: '',
      orderNo: '',
      orders: [],
      totalOrders: 0,
      totalAmount: 0,
      averageAmount: 0,
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.orderContent')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formApi.values;
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await SaleService.exportOrderData(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('导出订单数据失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (data: {
    columnsVisible: any[];
    orderList: any[];
    orderListTotal: number;
    pageSize: number;
    currentPage: number;
  }) => {
    if (data.orderList) {
      formApi.setValues({
        orders: data.orderList,
        totalOrders: data.orderListTotal,
        totalAmount: calculateTotalAmount(data.orderList),
        averageAmount: calculateAverageAmount(data.orderList),
      });
    } else {
      formApi.reset();
    }
    drawerApi.open();
  };

  const calculateTotalAmount = (orders: any[]) => {
    return orders.reduce((total, order) => {
      return total + (order.totalAmount || 0);
    }, 0);
  };

  const calculateAverageAmount = (orders: any[]) => {
    if (orders.length === 0) return 0;
    return calculateTotalAmount(orders) / orders.length;
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  const searchOrders = async (searchParams: any) => {
    try {
      const res = await SaleService.getOrderList({
        ...searchParams,
        merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
      });
      if (String(res?.code) === 'SUCCESS') {
        formApi.setFieldState('orders', {
          value: res.data || [],
        });
      }
    } catch (error) {
      console.error('搜索订单失败:', error);
    }
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
    searchOrders,
  };
}
