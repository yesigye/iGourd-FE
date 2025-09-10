import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateAccountApi } from '../apis'
// import type { AccountInfo } from '../types'

export function useAccountForm() {
  const { t } = useI18n()

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
          maxlength: 50,
        },
      },
      account_type: {
        type: 'string',
        title: "{{t('account.accountType')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectAccountType')}}",
          options: [
            { label: '现金账户', value: 'cash' },
            { label: '银行账户', value: 'bank' },
            { label: '支付宝账户', value: 'alipay' },
            { label: '微信账户', value: 'wechat' },
          ],
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'balance.x-component-props.disabled': '{{!$self.value}}',
                'status.x-component-props.disabled': '{{!$self.value}}',
              },
            },
          },
        ],
      },
      balance: {
        type: 'number',
        title: "{{t('account.balance')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('account.balance')}}",
          min: 0,
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
      await formAPI.submit(createOrUpdateAccountApi)
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
