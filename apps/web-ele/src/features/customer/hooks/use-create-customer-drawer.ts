import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { customerApi } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useCreateCustomerDrawer() {
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
          title: "{{t('customers.basicInfo')}}",
          defaultOpen: true,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('customers.customerName')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterCustomerName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.nameRequired')}}",
              },
            ],
          },
          phone: {
            type: 'string',
            title: "{{t('customers.phone')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterPhone')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('customers.phoneRequired')}}",
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "{{t('customers.phoneFormatError')}}",
              },
            ],
          },
          email: {
            type: 'string',
            title: "{{t('customers.email')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterEmail')}}",
              clearable: true,
            },
            'x-validator': [
              {
                format: 'email',
                message: "{{t('customers.emailFormatError')}}",
              },
            ],
          },
          gender: {
            type: 'string',
            title: "{{t('customers.gender')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectGender')}}",
              clearable: true,
              options: [
                { label: "{{t('customers.male')}}", value: 'MALE' },
                { label: "{{t('customers.female')}}", value: 'FEMALE' },
                { label: "{{t('customers.other')}}", value: 'OTHER' },
              ],
            },
          },
        },
      },

      // 详细信息
      detailInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.detailInfo')}}",
          defaultOpen: true,
        },
        properties: {
          birthday: {
            type: 'string',
            title: "{{t('customers.birthday')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectBirthday')}}",
              format: 'YYYY-MM-DD',
              valueFormat: 'YYYY-MM-DD',
            },
          },
          level: {
            type: 'string',
            title: "{{t('customers.customerLevel')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectLevel')}}",
              clearable: true,
              // 这里需要动态加载选项
            },
          },
          address: {
            type: 'string',
            title: "{{t('customers.address')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseEnterAddress')}}",
              clearable: true,
            },
          },
          source: {
            type: 'string',
            title: "{{t('customers.source')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectSource')}}",
              clearable: true,
              options: [
                { label: '门店', value: '1' },
                { label: '线上', value: '2' },
                { label: '推荐', value: '3' },
                { label: '其他', value: '4' },
              ],
            },
          },
        },
      },

      // 其他信息
      otherInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.otherInfo')}}",
          defaultOpen: false,
        },
        properties: {
          tags: {
            type: 'array',
            title: "{{t('customers.tags')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectTags')}}",
              multiple: true,
              clearable: true,
              // 这里需要动态加载选项
            },
          },
          status: {
            type: 'string',
            title: "{{t('customers.status')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseSelectStatus')}}",
              options: [
                { label: "{{t('customers.active')}}", value: 'ACTIVE' },
                { label: "{{t('customers.inactive')}}", value: 'INACTIVE' },
              ],
            },
          },
          remark: {
            type: 'string',
            title: "{{t('customers.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('customers.pleaseEnterRemark')}}",
              maxlength: 200,
              showWordLimit: true,
              rows: 3,
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
      name: '',
      phone: '',
      email: '',
      gender: '',
      birthday: '',
      level: '',
      address: '',
      source: '',
      tags: [],
      status: 'ACTIVE',
      remark: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: t('customers.addCustomer'),
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await CustomerService.createCustomer(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('创建客户失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formAPI.reset();
      drawerApi.close();
    },
  });

  const openDrawer = () => {
    formAPI.reset();
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formAPI,
    openDrawer,
    closeDrawer,
  };
}
