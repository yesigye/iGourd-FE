import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateAccountSubsidiaryLedgerApi } from '../apis'

export function useAccountSubsidiaryLedgerForm() {
  // 表单配置
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      account_code: {
        type: 'string',
        title: "{{t('account.accountCode')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.accountCode')}}",
          maxlength: 50,
        },
      },
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
      subsidiary_name: {
        type: 'string',
        title: "{{t('account.subsidiaryName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.subsidiaryName')}}",
          maxlength: 100,
        },
      },
      balance: {
        type: 'number',
        title: "{{t('account.balance')}}",
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('account.balance')}}",
          precision: 2,
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
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ],
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
      await formAPI.submit(createOrUpdateAccountSubsidiaryLedgerApi)
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
