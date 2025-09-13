import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { CustomerService } from '../../customer/apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useSelectCustomersDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 搜索条件
      searchConditions: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customer.searchConditions')}}",
          defaultOpen: true,
        },
        properties: {
          customerName: {
            type: 'string',
            title: "{{t('customer.customerName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customer.pleaseEnterCustomerName')}}",
              clearable: true,
            },
          },
          customerCode: {
            type: 'string',
            title: "{{t('customer.customerCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customer.pleaseEnterCustomerCode')}}",
              clearable: true,
            },
          },
          phone: {
            type: 'string',
            title: "{{t('customer.phone')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customer.pleaseEnterPhone')}}",
              clearable: true,
            },
          },
          customerLevel: {
            type: 'string',
            title: "{{t('customer.customerLevel')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customer.pleaseSelectCustomerLevel')}}",
              clearable: true,
            },
            enum: [
              { label: "{{t('customer.vip')}}", value: 'VIP' },
              { label: "{{t('customer.gold')}}", value: 'GOLD' },
              { label: "{{t('customer.silver')}}", value: 'SILVER' },
              { label: "{{t('customer.bronze')}}", value: 'BRONZE' },
            ],
          },
        },
      },

      // 客户列表
      customerList: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customer.customerList')}}",
          defaultOpen: true,
        },
        properties: {
          selectedCustomer: {
            type: 'string',
            title: "{{t('customer.selectedCustomer')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customer.pleaseSelectCustomer')}}",
              clearable: true,
              showSearch: true,
              filterable: true,
            },
            enum: [],
            'x-validator': [
              {
                required: true,
                message: "{{t('customer.pleaseSelectCustomer')}}",
              },
            ],
          },
        },
      },

      // 客户信息
      customerInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customer.customerInfo')}}",
          defaultOpen: true,
        },
        properties: {
          customerName: {
            type: 'string',
            title: "{{t('customer.customerName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          customerCode: {
            type: 'string',
            title: "{{t('customer.customerCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          phone: {
            type: 'string',
            title: "{{t('customer.phone')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          email: {
            type: 'string',
            title: "{{t('customer.email')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          address: {
            type: 'string',
            title: "{{t('customer.address')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          customerLevel: {
            type: 'string',
            title: "{{t('customer.customerLevel')}}",
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
  const { Form, formAPI } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      customerName: '',
      customerCode: '',
      phone: '',
      customerLevel: '',
      selectedCustomer: '',
      email: '',
      address: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.selectCustomer')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values;
        const selectedCustomer = values.selectedCustomer;

        if (!selectedCustomer) {
          return false;
        }

        drawerApi.close();
        return true;
      } catch (error) {
        console.error('选择客户失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (title?: string) => {
    formAPI.reset();
    loadCustomerList();
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  const loadCustomerList = async () => {
    try {
      const res = await CustomerService.getCustomerList({
        merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
      });
      if (String(res?.code) === 'SUCCESS') {
        const options = res.data.map((item: any) => ({
          label: `${item.name} (${item.code})`,
          value: item.id,
        }));
        formAPI.setFieldState('selectedCustomer', {
          componentProps: {
            enum: options,
          },
        });
      }
    } catch (error) {
      console.error('加载客户列表失败:', error);
    }
  };

  const onCustomerChange = (customerId: string) => {
    if (customerId) {
      loadCustomerDetail(customerId);
    } else {
      formAPI.setValues({
        customerName: '',
        customerCode: '',
        phone: '',
        email: '',
        address: '',
        customerLevel: '',
      });
    }
  };

  const loadCustomerDetail = async (customerId: string) => {
    try {
      const res = await CustomerService.getCustomerDetail(customerId);
      if (String(res?.code) === 'SUCCESS') {
        formAPI.setValues({
          customerName: res.data.name || '',
          customerCode: res.data.code || '',
          phone: res.data.phone || '',
          email: res.data.email || '',
          address: res.data.address || '',
          customerLevel: res.data.level || '',
        });
      }
    } catch (error) {
      console.error('加载客户详情失败:', error);
    }
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi: formAPI,
    openDrawer,
    closeDrawer,
    loadCustomerList,
    onCustomerChange,
  };
}
