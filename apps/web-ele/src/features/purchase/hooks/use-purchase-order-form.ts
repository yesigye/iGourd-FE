import { useI18n } from '@igourd/locales';
import {
  useIgourdDrawer,
  useIgourdForm,
  type ISchema,
} from '@igourd/common-ui';
import { purchaseApi } from '../apis';

export function usePurchaseOrderForm() {
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
      product_id: {
        type: 'string',
        title: "{{t('purchase.productId')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputProductId')}}",
        },
      },
      product_name: {
        type: 'string',
        title: "{{t('purchase.productName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputProductName')}}",
        },
      },
      product_code: {
        type: 'string',
        title: "{{t('purchase.productCode')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputProductCode')}}",
        },
      },
      quantity: {
        type: 'number',
        title: "{{t('purchase.quantity')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'InputNumber',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputQuantity')}}",
          min: 0,
          precision: 0,
        },
        'x-reactions': [
          {
            dependencies: ['.', 'unit_price'],
            fulfill: {
              state: {
                'total_price.value':
                  '{{$deps[0] && $deps[1] ? Math.round($deps[0] * $deps[1] * 100) / 100 : 0}}',
              },
            },
          },
        ],
      },
      unit_price: {
        type: 'number',
        title: "{{t('purchase.unitPrice')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'InputNumber',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputUnitPrice')}}",
          min: 0,
          precision: 2,
        },
        'x-reactions': [
          {
            dependencies: ['.', 'quantity'],
            fulfill: {
              state: {
                'total_price.value':
                  '{{$deps[0] && $deps[1] ? Math.round($deps[0] * $deps[1] * 100) / 100 : 0}}',
              },
            },
          },
        ],
      },
      total_price: {
        type: 'number',
        title: "{{t('purchase.totalPrice')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'InputNumber',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseInputTotalPrice')}}",
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
            { label: '草稿', value: 'draft' },
            { label: '待审核', value: 'pending' },
            { label: '已审核', value: 'approved' },
            { label: '已发货', value: 'shipped' },
            { label: '已送达', value: 'delivered' },
            { label: '已取消', value: 'cancelled' },
            { label: '已完成', value: 'completed' },
          ],
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
    title: t('purchase.addOrder'),
    class:'w-full',
    appendToMain: true,
    async onConfirm() {
      await formAPI.validate();
      await formAPI.submit(purchaseApi.createOrUpdateOrder);
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
