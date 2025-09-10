import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui';
import { purchaseApi } from '../apis';

export function usePurchaseReturnedForm() {
  const { t } = useI18n();
  
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      purchase_id: {
        type: 'string',
        title: "{{t('purchase.purchaseId')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputPurchaseId')}}",
        },
      },
      returned_no: {
        type: 'string',
        title: "{{t('purchase.returnedNo')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputReturnedNo')}}",
        },
      },
      returned_date: {
        type: 'string',
        title: "{{t('purchase.returnedDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputReturnedDate')}}",
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
          placeholder: "{{t('purchase.pleaseInputTotalAmount')}}",
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
            { label: '待处理', value: 'pending' },
            { label: '已批准', value: 'approved' },
            { label: '已拒绝', value: 'rejected' },
            { label: '已完成', value: 'completed' },
          ],
        },
      },
      reason: {
        type: 'string',
        title: "{{t('purchase.reason')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputReason')}}",
        },
      },
      remark: {
        type: 'string',
        title: "{{t('purchase.remark')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
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
      await formAPI.submit(purchaseApi.createOrUpdateReturned);
      drawerApi.close();
    },
  });

  const { Form, formAPI } = useIgourdForm({
    scope: {},
    useI18n,
    schema: formSchema,
  });

  return { Drawer, Form };
}
