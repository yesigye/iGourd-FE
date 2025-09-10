import { useIgourdForm } from "@igourd/common-ui"
import { useI18n } from "@igourd/locales"
import type { ISchema } from '@igourd/common-ui';

// 详情表单 Schema - 只读模式
const customerDetailSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: "{{t('customer.customerName')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    salesman_name: {
      type: 'string',
      title: "{{t('customer.salesman')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    contact_name: {
      type: 'string',
      title: "{{t('customer.contact_name')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    phone_number: {
      type: 'string',
      title: "{{t('customer.phone_number')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    balance: {
      type: 'number',
      title: "{{t('customer.balance')}}",
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {
        disabled: true
      }
    },
    points: {
      type: 'number',
      title: "{{t('customer.points')}}",
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {
        disabled: true
      }
    },
    debt_amount: {
      type: 'number',
      title: "{{t('customer.debt')}}",
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {
        disabled: true
      }
    },
    vip_code: {
      type: 'string',
      title: "{{t('customer.vipCode')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    vip_level: {
      type: 'string',
      title: "{{t('customer.vipLevel')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    vip_points_multiple: {
      type: 'number',
      title: "{{t('customer.vipPointsMultiple')}}",
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {
        disabled: true
      }
    },
    vip_discount_percentage: {
      type: 'number',
      title: "{{t('customer.vipDiscountPercentage')}}",
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {
        disabled: true
      }
    },
    vip_rights_expiration_date: {
      type: 'string',
      title: "{{t('customer.vipRightsExpirationDate')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    vip_other_rights: {
      type: 'string',
      title: "{{t('customer.vipOtherRights')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        disabled: true,
        rows: 3
      }
    },
    vip_begin_time: {
      type: 'string',
      title: "{{t('customer.vipBeginTime')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    label_id_list: {
      type: 'array',
      title: "{{t('customer.customerLabel')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    address: {
      type: 'string',
      title: "{{t('customer.address')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        disabled: true,
        rows: 3
      }
    },
    last_order_date: {
      type: 'string',
      title: "{{t('customer.lastOrderDate')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    remark: {
      type: 'string',
      title: "{{t('customer.remark')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        disabled: true,
        rows: 3
      }
    },
    creator_name: {
      type: 'string',
      title: "{{t('customer.creator')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    },
    create_time: {
      type: 'string',
      title: "{{t('customer.creationTime')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        disabled: true
      }
    }
  }
}

export function useCustomerDetailForm(scope?: Record<string, any>) {
  const { t } = useI18n();

  const [Form, formAPI] = useIgourdForm({
    readPretty: true,
    schema: customerDetailSchema,
    useI18n,
    scope,
  });

  return { Form, formAPI };
}
