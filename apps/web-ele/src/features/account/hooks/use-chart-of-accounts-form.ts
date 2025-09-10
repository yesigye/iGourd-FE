import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateChartOfAccountsApi } from '../apis'

export function useChartOfAccountsForm() {
  // 表单配置
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      code: {
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
      name: {
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
      balance_direction: {
        type: 'string',
        title: "{{t('account.balanceDirection')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectBalanceDirection')}}",
          options: [
            { label: '借方', value: 'debit' },
            { label: '贷方', value: 'credit' },
          ],
        },
      },
      initial_balance: {
        type: 'number',
        title: "{{t('account.initialBalance')}}",
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('account.initialBalance')}}",
          precision: 2,
        },
      },
      source_type: {
        type: 'string',
        title: "{{t('account.sourceType')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectSourceType')}}",
          options: [
            { label: '系统', value: 'system' },
            { label: '手动', value: 'manual' },
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
      await formAPI.submit(createOrUpdateChartOfAccountsApi)
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
