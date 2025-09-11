import { useI18n } from '@igourd/locales';
import {
  useIgourdDrawer,
  useIgourdForm,
  type ISchema,
} from '@igourd/common-ui';
import { createOrUpdateCustomer, purchaseApi } from '../apis';

export function usePurchaseForm() {
  const { t } = useI18n();

  const fun = (value: string) => {
    if (value && value.length > 100) {
      return t('purchase.remarkLimit');
    }
    return '';
  };
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      vendor_id: {
        type: 'string',
        title: "{{t('purchase.vendorName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseSelectVendor')}}",
          filterable: true,
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'purchase_date.x-component-props.disabled': '{{!$self.value}}',
                'total_amount.x-component-props.disabled': '{{!$self.value}}',
              },
            },
          },
        ],
      },
      purchase_date: {
        type: 'string',
        title: "{{t('purchase.purchaseDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.purchaseDate')}}",
          type: 'date',
        },
      },
      total_amount: {
        type: 'number',
        title: "{{t('purchase.totalAmount')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'InputNumber',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.totalAmount')}}",
          min: 0,
          precision: 2,
        },
      },
      status: {
        type: 'string',
        title: "{{t('purchase.status')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseSelectStatus')}}",
          options: [
            { label: '待审核', value: 'pending' },
            { label: '已审核', value: 'approved' },
            { label: '已拒绝', value: 'rejected' },
          ],
        },
      },
      remark: {
        type: 'string',
        title: "{{t('purchase.remark')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
          rules: '[{validate: {{ fun}} ]',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          type: 'textarea',
          placeholder: "{{t('purchase.remark')}}",
          maxlength: 500,
          rows: 3,
        },
      },
    },
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    onOpenChange(isOpen) {
      if (!isOpen) {
        formAPI.setValues(drawerApi.getData() || {});
      }
    },
    async onConfirm() {
      await formAPI.validate();
      await formAPI.submit(createOrUpdateCustomer);
      drawerApi.close();
    },
  });

  const { Form, formAPI } = useIgourdForm({
    scope: {
      fun,
    },
    useI18n,
    schema: formSchema,
  });

  return { Drawer, Form };
}
