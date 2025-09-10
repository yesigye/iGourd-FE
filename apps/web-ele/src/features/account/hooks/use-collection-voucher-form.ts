import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateCollectionVoucherApi } from '../apis'

export function useCollectionVoucherForm() {
  // 表单配置
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      voucher_no: {
        type: 'string',
        title: "{{t('account.voucherNo')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.voucherNo')}}",
          maxlength: 50,
        },
      },
      customer_id: {
        type: 'string',
        title: "{{t('account.customerName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectCustomer')}}",
          filterable: true,
        },
      },
      voucher_date: {
        type: 'string',
        title: "{{t('account.voucherDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectVoucherDate')}}",
          type: 'date',
        },
      },
      amount: {
        type: 'number',
        title: "{{t('account.amount')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('account.amount')}}",
          min: 0,
          precision: 2,
        },
      },
      payment_method: {
        type: 'string',
        title: "{{t('account.paymentMethod')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectPaymentMethod')}}",
          options: [
            { label: '现金', value: 'cash' },
            { label: '银行转账', value: 'bank_transfer' },
            { label: '支票', value: 'check' },
            { label: '信用卡', value: 'credit_card' },
            { label: '其他', value: 'other' },
          ],
        },
      },
      status: {
        type: 'string',
        title: "{{t('account.status')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectStatus')}}",
          options: [
            { label: '待确认', value: 'pending' },
            { label: '已确认', value: 'confirmed' },
            { label: '已取消', value: 'cancelled' },
          ],
        },
      },
      remark: {
        type: 'string',
        title: "{{t('account.remark')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          type: 'textarea',
          placeholder: "{{t('account.remark')}}",
          maxlength: 500,
          rows: 3,
        },
      },
    },
  }

  const [Drawer, drawerApi] = useIgourdDrawer({
    onOpenChange(isOpen) {
      if (!isOpen) {
        formAPI.setValues(drawerApi.getData() || {})
      }
    },
    async onConfirm() {
      await formAPI.validate()
      await formAPI.submit(createOrUpdateCollectionVoucherApi)
      drawerApi.close()
    },
  })

  const { Form, formAPI } = useIgourdForm({
    scope: {},
    useI18n,
    schema: formSchema,
  })
  return { Drawer, Form }
}
