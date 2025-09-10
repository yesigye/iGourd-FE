import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui';
import { purchaseApi } from '../apis';

export function usePurchaseNewOrderHistoryForm() {
  const { t } = useI18n();
  
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      order_id: {
        type: 'string',
        title: "{{t('purchase.orderId')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputOrderId')}}",
        },
      },
      order_no: {
        type: 'string',
        title: "{{t('purchase.orderNo')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputOrderNo')}}",
        },
      },
      action: {
        type: 'string',
        title: "{{t('purchase.action')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseSelectAction')}}",
          options: [
            { label: '创建', value: 'created' },
            { label: '更新', value: 'updated' },
            { label: '确认', value: 'confirmed' },
            { label: '发货', value: 'shipped' },
            { label: '送达', value: 'delivered' },
            { label: '取消', value: 'cancelled' },
            { label: '完成', value: 'completed' },
          ],
        },
      },
      action_date: {
        type: 'string',
        title: "{{t('purchase.actionDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputActionDate')}}",
          type: 'date',
        },
      },
      operator: {
        type: 'string',
        title: "{{t('purchase.operator')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputOperator')}}",
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
      await formAPI.submit(purchaseApi.createOrUpdateNewOrderHistory);
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
