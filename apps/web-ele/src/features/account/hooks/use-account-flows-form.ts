import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateAccountFlowsApi } from '../apis'

export function useAccountFlowsForm() {
  // 表单配置
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      account_name: {
        type: 'string',
        title: "{{t('account.accountName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.accountName')}}",
          maxlength: 100,
        },
      },
      transaction_type: {
        type: 'string',
        title: "{{t('account.transactionType')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectTransactionType')}}",
          options: [
            { label: '收入', value: 'income' },
            { label: '支出', value: 'expense' },
            { label: '转账', value: 'transfer' },
          ],
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
          precision: 2,
        },
      },
      balance_after: {
        type: 'number',
        title: "{{t('account.balanceAfter')}}",
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('account.balanceAfter')}}",
          precision: 2,
        },
      },
      transaction_date: {
        type: 'string',
        title: "{{t('account.transactionDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectTransactionDate')}}",
          type: 'datetime',
        },
      },
      description: {
        type: 'string',
        title: "{{t('account.description')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          type: 'textarea',
          placeholder: "{{t('account.description')}}",
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
      await formAPI.submit(createOrUpdateAccountFlowsApi)
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
