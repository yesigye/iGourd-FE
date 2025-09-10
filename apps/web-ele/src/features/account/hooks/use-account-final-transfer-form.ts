import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateAccountFinalTransferApi } from '../apis'

export function useAccountFinalTransferForm() {
  // 表单配置
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      transfer_no: {
        type: 'string',
        title: "{{t('account.transferNo')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.transferNo')}}",
          maxlength: 50,
        },
      },
      from_account: {
        type: 'string',
        title: "{{t('account.fromAccount')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.fromAccount')}}",
          maxlength: 100,
        },
      },
      to_account: {
        type: 'string',
        title: "{{t('account.toAccount')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.toAccount')}}",
          maxlength: 100,
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
      transfer_date: {
        type: 'string',
        title: "{{t('account.transferDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectTransferDate')}}",
          type: 'date',
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
            { label: '待处理', value: 'pending' },
            { label: '已完成', value: 'completed' },
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
      await formAPI.submit(createOrUpdateAccountFinalTransferApi)
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
