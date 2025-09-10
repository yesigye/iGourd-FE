import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateAccountTaxApi } from '../apis'

export function useAccountTaxForm() {
  // 表单配置
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      tax_code: {
        type: 'string',
        title: "{{t('account.taxCode')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.taxCode')}}",
          maxlength: 50,
        },
      },
      tax_name: {
        type: 'string',
        title: "{{t('account.taxName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.taxName')}}",
          maxlength: 100,
        },
      },
      tax_rate: {
        type: 'number',
        title: "{{t('account.taxRate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('account.taxRate')}}",
          min: 0,
          max: 100,
          precision: 2,
        },
      },
      tax_type: {
        type: 'string',
        title: "{{t('account.taxType')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectTaxType')}}",
          options: [
            { label: '增值税', value: 'vat' },
            { label: '所得税', value: 'income' },
            { label: '营业税', value: 'business' },
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
      await formAPI.submit(createOrUpdateAccountTaxApi)
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
